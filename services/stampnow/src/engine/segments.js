/**
 * Kunden-Segmentierung (reine Funktionen, ohne Datenbank – dadurch testbar).
 *
 * Idee: Jeder Kunde hat seinen eigenen Rhythmus. Wer normalerweise alle 4 Wochen
 * kommt und jetzt 7 Wochen weg ist, ist "gefährdet" – ein 8-Wochen-Kunde nach
 * 7 Wochen dagegen nicht. Der persönliche Rhythmus = Median der Abstände
 * zwischen Besuchen. Bei zu wenigen Besuchen nehmen wir den Branchenwert des Betriebs.
 */
const DAY = 864e5;

export const SEGMENTS = {
  registered: { label: 'Angemeldet', hint: 'Karte geholt, noch kein Stempel' },
  new: { label: 'Neukunde', hint: '1–2 Besuche, im Rhythmus' },
  regular: { label: 'Stammkunde', hint: '3+ Besuche, im Rhythmus' },
  at_risk: { label: 'Gefährdet', hint: 'überfällig (1,5–3× üblicher Abstand)' },
  lost: { label: 'Verloren', hint: 'mehr als 3× üblicher Abstand weg' },
};

export function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

/**
 * @param {Date[]|number[]} visits  Zeitpunkte der Stempel (beliebige Reihenfolge)
 * @param {number} defaultInterval  Branchenwert des Betriebs in Tagen
 * @param {Date} now
 */
export function classify(visits, defaultInterval, now = new Date()) {
  const t = visits.map((v) => +new Date(v)).sort((a, b) => a - b);
  const n = t.length;
  if (n === 0) {
    return { segment: 'registered', visits: 0, intervalDays: defaultInterval, daysSinceLast: null, ratio: 0, lastVisit: null, firstVisit: null, dueAt: null };
  }
  // Mehrere Stempel am selben Tag zählen als ein Besuch für den Rhythmus
  const gaps = [];
  for (let i = 1; i < n; i++) {
    const g = (t[i] - t[i - 1]) / DAY;
    if (g >= 1) gaps.push(g);
  }
  let interval;
  if (gaps.length >= 2) interval = median(gaps);
  else if (gaps.length === 1) interval = (gaps[0] + defaultInterval) / 2;
  else interval = defaultInterval;
  interval = clamp(interval, 3, 365);

  const last = t[n - 1];
  const daysSinceLast = (+now - last) / DAY;
  const ratio = daysSinceLast / interval;

  let segment;
  if (ratio > 3) segment = 'lost';
  else if (ratio > 1.5) segment = 'at_risk';
  else if (n <= 2) segment = 'new';
  else segment = 'regular';

  return {
    segment,
    visits: n,
    intervalDays: Math.round(interval * 10) / 10,
    daysSinceLast: Math.round(daysSinceLast * 10) / 10,
    ratio: Math.round(ratio * 100) / 100,
    lastVisit: new Date(last),
    firstVisit: new Date(t[0]),
    dueAt: new Date(last + interval * DAY),
  };
}
