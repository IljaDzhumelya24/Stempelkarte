/**
 * Geschäftslogik: Betriebe, Kunden, Karten, Stempeln, Einlösen, DSGVO-Aktionen.
 * Routen rufen nur diese Funktionen auf – so ist alles an einer Stelle testbar.
 */
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { many, one, q, tx } from './db.js';
import { hashPassword } from './auth.js';
import { newPublicId, randomPassword, verifyQr } from './tokens.js';
import { DEFAULT_RULES } from './engine/rules.js';
import { retireCard, syncCard } from './wallet/index.js';

export class AppError extends Error {
  constructor(code, message, status = 400, extra = {}) {
    super(message); this.code = code; this.status = status; this.extra = extra;
  }
}

export function normalizePhone(raw) {
  const p = parsePhoneNumberFromString(String(raw || ''), 'DE');
  if (!p || !p.isValid()) return null;
  return p.number; // E.164, z.B. +491701234567
}

export function maskPhone(e164) {
  if (!e164) return '';
  return e164.slice(0, 4) + ' ••• ' + e164.slice(-3);
}

export function cleanName(raw) {
  const s = String(raw || '').replace(/\s+/g, ' ').trim();
  if (s.length < 2 || s.length > 60) return null;
  return s;
}

export async function audit(businessId, staffId, action, detail = {}) {
  await q('INSERT INTO audit_log (business_id, staff_id, action, detail) VALUES ($1,$2,$3,$4)',
    [businessId, staffId, action, detail]);
}

// ---------------------------------------------------------------- Betriebe
export async function createBusiness({ name, slug, ownerEmail, ownerName = '', password }) {
  slug = String(slug || '').toLowerCase().trim();
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) throw new AppError('bad_slug', 'Kürzel: 3–40 Zeichen, nur a-z, 0-9 und -');
  if (!name) throw new AppError('bad_name', 'Name fehlt');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(ownerEmail || '')) throw new AppError('bad_email', 'E-Mail ungültig');
  const pw = password || randomPassword();
  const hash = await hashPassword(pw);
  return tx(async (c) => {
    const b = (await c.query('INSERT INTO businesses (name, slug, contact_email) VALUES ($1,$2,$3) RETURNING *',
      [name, slug, ownerEmail])).rows[0];
    await c.query(`INSERT INTO staff (business_id, email, name, role, password_hash) VALUES ($1,$2,$3,'owner',$4)`,
      [b.id, ownerEmail, ownerName, hash]);
    for (const r of DEFAULT_RULES) {
      await c.query('INSERT INTO rules (business_id, key, enabled, message, params) VALUES ($1,$2,$3,$4,$5)',
        [b.id, r.key, r.enabled, r.message, r.params]);
    }
    return { business: b, ownerPassword: pw };
  }).catch((e) => {
    if (e.code === '23505') throw new AppError('duplicate', 'Kürzel oder E-Mail ist schon vergeben.', 409);
    throw e;
  });
}

// ---------------------------------------------------------------- Kunden & Karten
/**
 * Neue Karte anlegen. Existiert die Nummer schon, wird KEINE Karte herausgegeben –
 * sonst könnte jeder mit einer fremden Telefonnummer deren Karte abrufen.
 */
export async function createCustomerAndCard(business, { name, phone, marketingConsent, source }) {
  const n = cleanName(name);
  if (!n) throw new AppError('bad_name', 'Bitte einen Namen angeben (2–60 Zeichen).');
  const p = normalizePhone(phone);
  if (!p) throw new AppError('bad_phone', 'Bitte eine gültige Handynummer angeben.');
  try {
    return await tx(async (c) => {
      const cust = (await c.query(
        `INSERT INTO customers (business_id, name, phone_e164, marketing_consent, marketing_consent_at, marketing_consent_source)
         VALUES ($1,$2,$3,$4, CASE WHEN $4 THEN now() END, CASE WHEN $4 THEN $5 END) RETURNING *`,
        [business.id, n, p, Boolean(marketingConsent), source])).rows[0];
      const card = (await c.query(
        'INSERT INTO cards (business_id, customer_id, public_id) VALUES ($1,$2,$3) RETURNING *',
        [business.id, cust.id, newPublicId()])).rows[0];
      return { customer: cust, card };
    });
  } catch (e) {
    if (e.code === '23505') {
      throw new AppError('phone_exists',
        'Für diese Nummer gibt es hier schon eine Karte. Bitte kurz beim Team melden – wir schicken sie dir erneut.', 409);
    }
    throw e;
  }
}

async function cardForStaff(client, staff, publicId) {
  const card = (await client.query(
    `SELECT c.*, cu.name AS customer_name, cu.phone_e164, b.max_stamps, b.stamp_cooldown_hours, b.reward_text
       FROM cards c JOIN customers cu ON cu.id = c.customer_id JOIN businesses b ON b.id = c.business_id
      WHERE c.public_id = $1 FOR UPDATE OF c`, [publicId])).rows[0];
  if (!card) throw new AppError('unknown_card', 'Diese Karte gibt es nicht (mehr).', 404);
  if (card.business_id !== staff.business_id) {
    throw new AppError('other_business', 'Diese Karte gehört zu einem anderen Betrieb.', 403);
  }
  return card;
}

function cardSummary(card, extra = {}) {
  return {
    cardId: card.id,
    publicId: card.public_id,
    customerName: card.customer_name,
    phone: maskPhone(card.phone_e164),
    stamps: card.stamps,
    max: card.max_stamps,
    rewardPending: card.reward_pending,
    rewardText: card.reward_text,
    ...extra,
  };
}

/**
 * Kernfunktion: Mitarbeiter scannt einen QR-Code.
 * Schutz: Signaturprüfung, Mandanten-Check, Sperrzeit (Standard 12 h), Zeilen-Lock
 * gegen Doppelscans in derselben Sekunde.
 */
export async function stampByQr(staff, qrText, { force = false } = {}) {
  const publicId = verifyQr(qrText);
  if (!publicId) throw new AppError('invalid_qr', 'Kein gültiger StampNow-Code.', 400);
  if (force && staff.role !== 'owner') throw new AppError('forbidden', 'Nur Inhaber dürfen die Sperrzeit übergehen.', 403);

  const result = await tx(async (c) => {
    const card = await cardForStaff(c, staff, publicId);
    if (card.reward_pending) {
      return cardSummary(card, { status: 'reward_pending' });
    }
    const last = (await c.query(
      `SELECT created_at FROM stamp_events WHERE card_id = $1 AND kind = 'stamp' ORDER BY created_at DESC LIMIT 1`,
      [card.id])).rows[0];
    if (last && !force && card.stamp_cooldown_hours > 0) {
      const nextAllowed = new Date(+last.created_at + card.stamp_cooldown_hours * 36e5);
      if (nextAllowed > new Date()) {
        return cardSummary(card, { status: 'cooldown', lastStampAt: last.created_at, nextAllowedAt: nextAllowed });
      }
    }
    const offer = (await c.query(
      `SELECT id FROM offers WHERE card_id = $1 AND used_at IS NULL AND expires_at > now() AND kind = 'double_stamp'
        ORDER BY created_at LIMIT 1`, [card.id])).rows[0];
    const amount = offer ? 2 : 1;
    if (offer) await c.query('UPDATE offers SET used_at = now() WHERE id = $1', [offer.id]);

    const newStamps = Math.min(card.max_stamps, card.stamps + amount);
    const rewardPending = newStamps >= card.max_stamps;
    const ev = (await c.query(
      `INSERT INTO stamp_events (business_id, card_id, staff_id, kind, amount, offer_id)
       VALUES ($1,$2,$3,'stamp',$4,$5) RETURNING id, created_at`,
      [card.business_id, card.id, staff.id, newStamps - card.stamps, offer?.id || null])).rows[0];
    await c.query('UPDATE cards SET stamps = $2, reward_pending = $3, updated_at = now() WHERE id = $1',
      [card.id, newStamps, rewardPending]);
    await c.query('UPDATE customers SET last_activity_at = now() WHERE id = $1', [card.customer_id]);
    const visits = (await c.query(`SELECT count(*)::int AS n FROM stamp_events WHERE card_id = $1 AND kind = 'stamp'`,
      [card.id])).rows[0].n;
    return cardSummary({ ...card, stamps: newStamps, reward_pending: rewardPending }, {
      status: 'stamped', added: newStamps - card.stamps, bonus: Boolean(offer), eventId: ev.id, visits,
    });
  });

  if (result.status === 'stamped') syncCard(result.cardId).catch(() => {});
  return result;
}

/** Belohnung einlösen: Karte zurück auf 0. */
export async function redeem(staff, cardId) {
  const r = await tx(async (c) => {
    const card = (await c.query(
      `SELECT c.*, cu.name AS customer_name, cu.phone_e164, b.max_stamps, b.reward_text
         FROM cards c JOIN customers cu ON cu.id = c.customer_id JOIN businesses b ON b.id = c.business_id
        WHERE c.id = $1 AND c.business_id = $2 FOR UPDATE OF c`, [cardId, staff.business_id])).rows[0];
    if (!card) throw new AppError('unknown_card', 'Karte nicht gefunden.', 404);
    if (!card.reward_pending) throw new AppError('no_reward', 'Auf dieser Karte ist keine Belohnung offen.', 409);
    await c.query(
      `UPDATE cards SET stamps = 0, reward_pending = false, rewards_redeemed = rewards_redeemed + 1,
              news_text = '', updated_at = now() WHERE id = $1`, [card.id]);
    await c.query(`INSERT INTO stamp_events (business_id, card_id, staff_id, kind, amount) VALUES ($1,$2,$3,'redeem',0)`,
      [card.business_id, card.id, staff.id]);
    return cardSummary({ ...card, stamps: 0, reward_pending: false }, { status: 'redeemed' });
  });
  syncCard(r.cardId).catch(() => {});
  return r;
}

/** Fehlscan rückgängig machen (max. 10 Minuten, nur eigener Betrieb). */
export async function undoStamp(staff, eventId) {
  const r = await tx(async (c) => {
    const ev = (await c.query(
      `SELECT * FROM stamp_events WHERE id = $1 AND business_id = $2 AND kind = 'stamp' FOR UPDATE`,
      [eventId, staff.business_id])).rows[0];
    if (!ev) throw new AppError('unknown_event', 'Stempel nicht gefunden.', 404);
    if (Date.now() - ev.created_at > 10 * 60e3) throw new AppError('too_late', 'Rückgängig nur 10 Minuten lang möglich.', 409);
    const card = (await c.query('SELECT * FROM cards WHERE id = $1 FOR UPDATE', [ev.card_id])).rows[0];
    if (!card) throw new AppError('unknown_card', 'Karte nicht gefunden.', 404);
    const newStamps = Math.max(0, card.stamps - ev.amount);
    await c.query('UPDATE cards SET stamps = $2, reward_pending = false, updated_at = now() WHERE id = $1', [card.id, newStamps]);
    if (ev.offer_id) await c.query('UPDATE offers SET used_at = NULL WHERE id = $1', [ev.offer_id]);
    await c.query('DELETE FROM stamp_events WHERE id = $1', [ev.id]);
    await c.query(`INSERT INTO audit_log (business_id, staff_id, action, detail) VALUES ($1,$2,'stamp_undo',$3)`,
      [staff.business_id, staff.id, { cardId: card.id, amount: ev.amount }]);
    return { status: 'undone', cardId: card.id, stamps: newStamps };
  });
  syncCard(r.cardId).catch(() => {});
  return r;
}

// ---------------------------------------------------------------- DSGVO
export async function exportCustomerData(businessId, customerId) {
  const customer = await one('SELECT * FROM customers WHERE id = $1 AND business_id = $2', [customerId, businessId]);
  if (!customer) throw new AppError('not_found', 'Kunde nicht gefunden.', 404);
  const card = await one('SELECT public_id, stamps, reward_pending, rewards_redeemed, news_text, created_at FROM cards WHERE customer_id = $1', [customerId]);
  const business = await one('SELECT name, address, contact_email FROM businesses WHERE id = $1', [businessId]);
  const visits = await many(
    `SELECT e.kind, e.amount, e.created_at FROM stamp_events e JOIN cards c ON c.id = e.card_id
      WHERE c.customer_id = $1 ORDER BY e.created_at`, [customerId]);
  const messages = await many(
    `SELECT l.rule_key, l.variant, l.message, l.created_at FROM campaign_log l JOIN cards c ON c.id = l.card_id
      WHERE c.customer_id = $1 AND l.variant = 'sent' ORDER BY l.created_at`, [customerId]);
  return {
    exportiert_am: new Date().toISOString(),
    verantwortlicher: business,
    kunde: {
      name: customer.name, telefon: customer.phone_e164, angelegt_am: customer.created_at,
      werbe_einwilligung: customer.marketing_consent, einwilligung_am: customer.marketing_consent_at,
      einwilligung_quelle: customer.marketing_consent_source,
    },
    karte: card, besuche: visits, nachrichten: messages,
  };
}

export async function setMarketingConsent(customerId, consent, source) {
  await q(
    `UPDATE customers SET marketing_consent = $2,
            marketing_consent_at = CASE WHEN $2 THEN now() ELSE NULL END,
            marketing_consent_source = CASE WHEN $2 THEN $3 ELSE NULL END
      WHERE id = $1`, [customerId, Boolean(consent), source]);
}

/** Löscht Kunde + Karte. Besuchsstatistik bleibt anonym (card_id → NULL). */
export async function deleteCustomer(businessId, customerId, { staffId = null, reason = 'request' } = {}) {
  const card = await one('SELECT * FROM cards WHERE customer_id = $1 AND business_id = $2', [customerId, businessId]);
  if (card) await retireCard(card);
  const r = await q('DELETE FROM customers WHERE id = $1 AND business_id = $2', [customerId, businessId]);
  if (r.rowCount) await audit(businessId, staffId, 'customer_deleted', { reason });
  return r.rowCount > 0;
}

/** Löschfrist: Kunden ohne Aktivität seit X Monaten automatisch löschen. */
export async function purgeInactiveCustomers() {
  const rows = await many(
    `SELECT cu.id, cu.business_id FROM customers cu JOIN businesses b ON b.id = cu.business_id
      WHERE cu.last_activity_at < now() - make_interval(months => b.retention_months)`);
  for (const r of rows) await deleteCustomer(r.business_id, r.id, { reason: 'retention' });
  return rows.length;
}
