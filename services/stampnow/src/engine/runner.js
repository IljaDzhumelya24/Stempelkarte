/**
 * Führt die Automationen aus und liefert Auswertungen fürs Dashboard.
 */
import { config } from '../config.js';
import { many, one, q } from '../db.js';
import { sendCardMessage } from '../wallet/index.js';
import { classify } from './segments.js';
import { decide, inSendWindow, renderMessage } from './rules.js';

/** Alle Karten eines Betriebs mit Segment. */
export async function loadSegmented(businessId, now = new Date()) {
  const business = await one('SELECT * FROM businesses WHERE id = $1', [businessId]);
  const cards = await many(
    `SELECT c.id, c.public_id, c.stamps, c.reward_pending, c.rewards_redeemed, c.has_apple, c.has_google, c.created_at,
            cu.id AS customer_id, cu.name, cu.phone_e164, cu.marketing_consent, cu.created_at AS customer_created_at
       FROM cards c JOIN customers cu ON cu.id = c.customer_id WHERE c.business_id = $1`, [businessId]);
  const visits = await many(
    `SELECT card_id, created_at FROM stamp_events WHERE business_id = $1 AND kind = 'stamp' AND card_id IS NOT NULL`,
    [businessId]);
  const byCard = new Map();
  for (const v of visits) {
    if (!byCard.has(v.card_id)) byCard.set(v.card_id, []);
    byCard.get(v.card_id).push(v.created_at);
  }
  return {
    business,
    cards: cards.map((c) => ({ ...c, seg: classify(byCard.get(c.id) || [], business.expected_interval_days, now) })),
  };
}

export async function runAutomations({ now = new Date(), businessId = null, ignoreWindow = false } = {}) {
  const summary = { businesses: 0, sent: 0, holdout: 0, failed: 0, skipped: 0 };
  if (!config.automationsEnabled) return { ...summary, disabled: true };
  if (!ignoreWindow && !inSendWindow(now, config.timezone)) return { ...summary, outsideWindow: true };

  const businesses = businessId ? [{ id: businessId }] : await many('SELECT id FROM businesses');
  for (const { id } of businesses) {
    summary.businesses++;
    const rules = await many('SELECT key, enabled, message, params FROM rules WHERE business_id = $1', [id]);
    if (!rules.some((r) => r.enabled)) continue;
    const { business, cards } = await loadSegmented(id, now);
    const logs = await many(
      `SELECT card_id, rule_key, created_at FROM campaign_log WHERE business_id = $1 AND variant <> 'failed' AND card_id IS NOT NULL`, [id]);
    const logByCard = new Map();
    for (const l of logs) {
      if (!logByCard.has(l.card_id)) logByCard.set(l.card_id, []);
      logByCard.get(l.card_id).push(l);
    }
    for (const c of cards) {
      const d = decide({
        card: c, customer: c, business, seg: c.seg, rules, log: logByCard.get(c.id) || [], now,
      });
      if (!d) { summary.skipped++; continue; }
      if (d.holdout) {
        await q(`INSERT INTO campaign_log (business_id, card_id, rule_key, variant, message, created_at) VALUES ($1,$2,$3,'holdout',$4,$5)`,
          [id, c.id, d.ruleKey, d.message, now]);
        summary.holdout++;
        continue;
      }
      if (d.offerDays) {
        await q(`INSERT INTO offers (business_id, card_id, kind, source, created_at, expires_at)
                 VALUES ($1,$2,'double_stamp',$3,$4,$5)`,
          [id, c.id, d.ruleKey, now, new Date(+now + d.offerDays * 864e5)]);
      }
      const ok = await sendCardMessage(c.id, d.message).catch(() => false);
      await q(`INSERT INTO campaign_log (business_id, card_id, rule_key, variant, message, created_at) VALUES ($1,$2,$3,$4,$5,$6)`,
        [id, c.id, d.ruleKey, ok ? 'sent' : 'failed', d.message, now]);
      summary[ok ? 'sent' : 'failed']++;
    }
  }
  return summary;
}

/** Manuelle Aktion aus dem Dashboard an ein Segment (nur mit Einwilligung). */
export async function manualCampaign(businessId, { segment, message, offerDays = 0, dryRun = false }, now = new Date()) {
  const { business, cards } = await loadSegmented(businessId, now);
  const recent = new Set((await many(
    `SELECT DISTINCT card_id FROM campaign_log WHERE business_id = $1 AND variant = 'sent' AND created_at > $2`,
    [businessId, new Date(+now - 864e5)])).map((r) => r.card_id));
  const targets = cards.filter((c) => c.marketing_consent && (segment === 'all' || c.seg.segment === segment) && !recent.has(c.id));
  if (dryRun) return { recipients: targets.length };
  let sent = 0;
  for (const c of targets) {
    const text = renderMessage(message, {
      name: c.name.split(' ')[0], business: business.name, reward: business.reward_text,
      missing: business.max_stamps - c.stamps, offerDays,
    });
    if (offerDays > 0) {
      await q(`INSERT INTO offers (business_id, card_id, kind, source, expires_at) VALUES ($1,$2,'double_stamp','manual',$3)`,
        [businessId, c.id, new Date(+now + offerDays * 864e5)]);
    }
    const ok = await sendCardMessage(c.id, text).catch(() => false);
    await q(`INSERT INTO campaign_log (business_id, card_id, rule_key, variant, message) VALUES ($1,$2,'manual',$3,$4)`,
      [businessId, c.id, ok ? 'sent' : 'failed', text]);
    if (ok) sent++;
  }
  return { recipients: targets.length, sent };
}

/**
 * Wirkung je Regel: Wie viele kamen innerhalb von 21 Tagen wieder –
 * mit Nachricht (sent) vs. Kontrollgruppe (holdout)?
 */
export async function ruleEffect(businessId, windowDays = 21) {
  const rows = await many(
    `SELECT l.rule_key, l.variant,
            count(*)::int AS n,
            count(*) FILTER (WHERE EXISTS (
              SELECT 1 FROM stamp_events e WHERE e.card_id = l.card_id AND e.kind = 'stamp'
                AND e.created_at > l.created_at AND e.created_at <= l.created_at + make_interval(days => $2)))::int AS returned,
            count(*) FILTER (WHERE l.created_at <= now() - make_interval(days => $2))::int AS matured
       FROM campaign_log l
      WHERE l.business_id = $1 AND l.variant IN ('sent','holdout')
      GROUP BY l.rule_key, l.variant`, [businessId, windowDays]);
  const out = {};
  for (const r of rows) {
    out[r.rule_key] ??= { sent: 0, sentReturned: 0, holdout: 0, holdoutReturned: 0 };
    if (r.variant === 'sent') { out[r.rule_key].sent = r.n; out[r.rule_key].sentReturned = r.returned; }
    else { out[r.rule_key].holdout = r.n; out[r.rule_key].holdoutReturned = r.returned; }
  }
  for (const v of Object.values(out)) {
    v.sentRate = v.sent ? v.sentReturned / v.sent : null;
    v.holdoutRate = v.holdout ? v.holdoutReturned / v.holdout : null;
    v.uplift = v.sentRate != null && v.holdoutRate != null ? v.sentRate - v.holdoutRate : null;
    // Unter ~30 pro Gruppe ist der Unterschied meist Zufall
    v.reliable = v.sent >= 30 && v.holdout >= 30;
  }
  return out;
}
