/**
 * Automationen: welche Nachricht bekommt welcher Kunde wann?
 * Reine Funktionen – der Job in runner.js lädt die Daten und verschickt.
 *
 * Schutzregeln (gelten immer):
 *  1. Nur Kunden mit Werbe-Einwilligung.
 *  2. Höchstens 1 automatische Nachricht pro Kunde in `message_cap_days` (Standard 14).
 *  3. Jede Regel höchstens einmal pro "Abwesenheit" (= seit dem letzten Besuch).
 *  4. Kontrollgruppe (Holdout, Standard 10 %): bekommt bewusst nichts. Nur so lässt
 *     sich messen, ob die Nachrichten wirklich mehr Besuche bringen.
 */
import crypto from 'node:crypto';

export const DEFAULT_RULES = [
  {
    key: 'reward_waiting',
    title: 'Belohnung wartet',
    description: 'Karte ist voll, Belohnung aber seit 14 Tagen nicht abgeholt.',
    enabled: true,
    message: 'Hallo {name}, deine Belohnung bei {business} wartet auf dich: {reward}. Bis bald!',
    params: { afterDays: 14 },
  },
  {
    key: 'almost_there',
    title: 'Fast voll',
    description: 'Nur noch 1 Stempel fehlt und der nächste Besuch wäre bald fällig.',
    enabled: true,
    message: 'Nur noch {missing} Stempel, {name}! Beim nächsten Besuch bei {business} gibt es: {reward}.',
    params: { maxMissing: 1, minRatio: 0.8 },
  },
  {
    key: 'second_visit',
    title: 'Neukunde → zweiter Besuch',
    description: 'Nach dem ersten Besuch: Anreiz für den zweiten, bevor der Kunde vergisst.',
    enabled: true,
    message: 'Schön, dass du bei {business} warst, {name}! Beim nächsten Besuch in den kommenden {offerDays} Tagen gibt es doppelte Stempel.',
    params: { minRatio: 0.8, offerDays: 21 },
  },
  {
    key: 'win_back',
    title: 'Stammkunde zurückholen',
    description: 'Kunde mit 2+ Besuchen ist deutlich über seinen üblichen Rhythmus.',
    enabled: true,
    message: 'Wir vermissen dich, {name}! Komm in den nächsten {offerDays} Tagen zu {business} und hol dir doppelte Stempel.',
    params: { offerDays: 14 },
  },
  {
    key: 'last_try',
    title: 'Letzter Versuch',
    description: 'Kunde gilt als verloren. Einmaliger letzter Anreiz, danach Ruhe.',
    enabled: false,
    message: 'Lange nicht gesehen, {name}. Als Dankeschön: doppelte Stempel bei {business} für die nächsten {offerDays} Tage.',
    params: { offerDays: 30 },
  },
];

export const RULE_ORDER = DEFAULT_RULES.map((r) => r.key);
export const RULE_META = Object.fromEntries(DEFAULT_RULES.map((r) => [r.key, r]));

export function renderMessage(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m)).slice(0, 300);
}

/** Deterministische Zuordnung zur Kontrollgruppe (gleicher Kunde + gleiche Episode = gleiches Ergebnis). */
export function inHoldout(cardId, ruleKey, episodeKey, percent) {
  if (!percent) return false;
  const h = crypto.createHash('sha256').update(`${cardId}|${ruleKey}|${episodeKey}`).digest();
  return h.readUInt16BE(0) % 100 < percent;
}

const DAY = 864e5;

/**
 * @param ctx.card        { id, stamps, reward_pending }
 * @param ctx.customer    { name, marketing_consent }
 * @param ctx.business    { name, reward_text, max_stamps, message_cap_days, holdout_percent }
 * @param ctx.seg         Ergebnis von classify()
 * @param ctx.rules       [{ key, enabled, message, params }]
 * @param ctx.log         bisherige Einträge dieser Karte [{ rule_key, created_at }]
 * @param ctx.now
 * @returns null oder { ruleKey, message, offerDays, holdout }
 */
export function decide(ctx) {
  const { card, customer, business, seg, rules, log = [], now = new Date() } = ctx;
  if (!customer.marketing_consent) return null;
  if (seg.visits === 0) return null;

  // Frequenzgrenze über alle Regeln
  const capFrom = +now - business.message_cap_days * DAY;
  if (log.some((l) => +new Date(l.created_at) > capFrom)) return null;

  const lastVisit = +seg.lastVisit;
  const firedThisEpisode = new Set(log.filter((l) => +new Date(l.created_at) > lastVisit).map((l) => l.rule_key));
  const firedEver = new Set(log.map((l) => l.rule_key));
  const byKey = Object.fromEntries(rules.map((r) => [r.key, r]));
  const missing = business.max_stamps - card.stamps;

  const conditions = {
    reward_waiting: (p) => card.reward_pending && seg.daysSinceLast >= (p.afterDays ?? 14),
    almost_there: (p) => !card.reward_pending && missing > 0 && missing <= (p.maxMissing ?? 1)
      && seg.ratio >= (p.minRatio ?? 0.8) && seg.ratio <= 3,
    second_visit: (p) => seg.visits === 1 && !firedEver.has('second_visit')
      && seg.ratio >= (p.minRatio ?? 0.8) && seg.ratio <= 3,
    win_back: () => seg.visits >= 2 && seg.segment === 'at_risk',
    last_try: () => seg.segment === 'lost' && !firedEver.has('last_try'),
  };

  for (const key of RULE_ORDER) {
    const rule = byKey[key];
    if (!rule?.enabled || firedThisEpisode.has(key)) continue;
    const p = { ...(RULE_META[key]?.params || {}), ...(rule.params || {}) };
    if (!conditions[key](p)) continue;
    const vars = {
      name: customer.name.split(' ')[0],
      business: business.name,
      reward: business.reward_text,
      missing,
      offerDays: p.offerDays ?? '',
    };
    return {
      ruleKey: key,
      message: renderMessage(rule.message, vars),
      offerDays: p.offerDays || 0,
      holdout: inHoldout(card.id, key, String(lastVisit), business.holdout_percent),
    };
  }
  return null;
}

/** Stille Zeiten: nur werktags (Mo–Sa) zwischen 10 und 19 Uhr Ortszeit senden. */
export function inSendWindow(now, timeZone = 'Europe/Berlin', startHour = 10, endHour = 19) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone, hour: 'numeric', hourCycle: 'h23', weekday: 'short' })
    .formatToParts(now);
  const hour = Number(parts.find((p) => p.type === 'hour').value);
  const wd = parts.find((p) => p.type === 'weekday').value;
  return wd !== 'Sun' && hour >= startHour && hour < endHour;
}
