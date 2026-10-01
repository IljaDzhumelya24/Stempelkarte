/**
 * Inhaber-Dashboard-API (Phase 4 Prototyp). Alle Routen nur für Rolle "owner"
 * und immer auf den eigenen Betrieb beschränkt (business_id aus der Session).
 */
import { Router } from 'express';
import express from 'express';
import QRCode from 'qrcode';
import { config } from '../config.js';
import { many, one, q } from '../db.js';
import { hashPassword, requireOwner } from '../auth.js';
import {
  AppError, audit, deleteCustomer, exportCustomerData,
} from '../services.js';
import { SEGMENTS } from '../engine/segments.js';
import { RULE_META } from '../engine/rules.js';
import { loadSegmented, manualCampaign, ruleEffect, runAutomations } from '../engine/runner.js';
import { google, sendCardMessage, syncCard } from '../wallet/index.js';
import { validLocations } from '../wallet/view.js';
import { randomPassword } from '../tokens.js';

export const dashRouter = Router();
dashRouter.use(requireOwner);

const TZ = config.timezone;

// ------------------------------------------------------------ Übersicht
dashRouter.get('/overview', async (req, res) => {
  const bid = req.staff.business_id;
  const { business, cards } = await loadSegmented(bid);
  const segCounts = Object.fromEntries(Object.keys(SEGMENTS).map((k) => [k, 0]));
  for (const c of cards) segCounts[c.seg.segment]++;

  const k = await one(`
    SELECT
      (SELECT count(*) FROM customers WHERE business_id = $1)                                            AS customers,
      (SELECT count(*) FROM customers WHERE business_id = $1 AND created_at > now() - interval '30 days')  AS new30,
      (SELECT count(*) FROM customers WHERE business_id = $1 AND marketing_consent)                        AS consent,
      (SELECT count(*) FROM stamp_events WHERE business_id = $1 AND kind = 'stamp' AND created_at > now() - interval '7 days')  AS visits7,
      (SELECT count(*) FROM stamp_events WHERE business_id = $1 AND kind = 'stamp'
          AND created_at BETWEEN now() - interval '14 days' AND now() - interval '7 days')                AS visits_prev7,
      (SELECT count(*) FROM stamp_events WHERE business_id = $1 AND kind = 'redeem' AND created_at > now() - interval '30 days') AS redeemed30,
      (SELECT count(*) FROM campaign_log WHERE business_id = $1 AND variant = 'sent' AND created_at > now() - interval '30 days') AS messages30
  `, [bid]);

  const weekly = await many(`
    WITH weeks AS (
      SELECT generate_series(date_trunc('week', (now() AT TIME ZONE $2)) - interval '11 weeks',
                             date_trunc('week', (now() AT TIME ZONE $2)), interval '1 week') AS wk)
    SELECT to_char(w.wk, 'YYYY-MM-DD') AS week,
           count(e.id) FILTER (WHERE e.kind = 'stamp') AS visits,
           count(DISTINCT e.card_id) FILTER (WHERE e.kind = 'stamp') AS customers
      FROM weeks w
      LEFT JOIN stamp_events e ON e.business_id = $1
           AND date_trunc('week', e.created_at AT TIME ZONE $2) = w.wk
     GROUP BY w.wk ORDER BY w.wk`, [bid, TZ]);

  // Wiederkehrquote: Kunden mit 1. Besuch vor 30–180 Tagen – wie viele kamen wieder?
  const cohort = cards.filter((c) => c.seg.firstVisit && (Date.now() - c.seg.firstVisit) / 864e5 >= 30
    && (Date.now() - c.seg.firstVisit) / 864e5 <= 180);
  const returned = cohort.filter((c) => c.seg.visits >= 2).length;

  res.json({
    business: { name: business.name, slug: business.slug, maxStamps: business.max_stamps },
    kpis: { ...k, returnRate: cohort.length ? returned / cohort.length : null, returnCohort: cohort.length },
    segments: Object.entries(SEGMENTS).map(([key, m]) => ({ key, ...m, count: segCounts[key] })),
    weekly,
    wallet: { apple: config.apple.enabled, google: config.google.enabled },
    signupUrl: `${config.publicUrl}/k/${business.slug}`,
  });
});

// ------------------------------------------------------------ Kunden
dashRouter.get('/customers', async (req, res) => {
  const { cards } = await loadSegmented(req.staff.business_id);
  const seg = String(req.query.segment || 'all');
  const search = String(req.query.q || '').toLowerCase().trim();
  const rows = cards
    .filter((c) => seg === 'all' || c.seg.segment === seg)
    .filter((c) => !search || c.name.toLowerCase().includes(search) || c.phone_e164.includes(search.replace(/\s/g, '')))
    .sort((a, b) => (+b.seg.lastVisit || +b.created_at) - (+a.seg.lastVisit || +a.created_at))
    .map((c) => ({
      customerId: c.customer_id, cardId: c.id, name: c.name, phone: c.phone_e164,
      segment: c.seg.segment, visits: c.seg.visits, lastVisit: c.seg.lastVisit, dueAt: c.seg.dueAt,
      intervalDays: c.seg.intervalDays, stamps: c.stamps, rewardPending: c.reward_pending,
      consent: c.marketing_consent, wallet: c.has_apple ? 'Apple' : c.has_google ? 'Google' : '–',
    }));
  res.json({ customers: rows, total: cards.length });
});

async function ownCustomer(req) {
  const c = await one(
    `SELECT cu.*, c.id AS card_id, c.public_id, c.stamps, c.reward_pending, c.rewards_redeemed, c.news_text,
            c.has_apple, c.has_google
       FROM customers cu JOIN cards c ON c.customer_id = cu.id
      WHERE cu.id = $1 AND cu.business_id = $2`, [req.params.id, req.staff.business_id]);
  if (!c) throw new AppError('not_found', 'Kunde nicht gefunden.', 404);
  return c;
}

dashRouter.get('/customers/:id', async (req, res) => {
  const c = await ownCustomer(req);
  const { cards } = await loadSegmented(req.staff.business_id);
  const seg = cards.find((x) => x.id === c.card_id)?.seg;
  const events = await many(
    `SELECT e.id, e.kind, e.amount, e.created_at, s.name AS staff_name FROM stamp_events e
       LEFT JOIN staff s ON s.id = e.staff_id WHERE e.card_id = $1 ORDER BY e.created_at DESC LIMIT 100`, [c.card_id]);
  const messages = await many(
    `SELECT rule_key, variant, message, created_at FROM campaign_log WHERE card_id = $1 ORDER BY created_at DESC LIMIT 50`, [c.card_id]);
  const offers = await many(
    `SELECT kind, source, expires_at, used_at FROM offers WHERE card_id = $1 ORDER BY created_at DESC LIMIT 20`, [c.card_id]);
  res.json({
    customer: {
      id: c.id, name: c.name, phone: c.phone_e164, createdAt: c.created_at, consent: c.marketing_consent,
      consentAt: c.marketing_consent_at, consentSource: c.marketing_consent_source,
    },
    card: { id: c.card_id, stamps: c.stamps, rewardPending: c.reward_pending, rewardsRedeemed: c.rewards_redeemed,
      news: c.news_text, apple: c.has_apple, google: c.has_google },
    seg, events, messages, offers,
  });
});

dashRouter.post('/customers/:id/adjust', async (req, res) => {
  const c = await ownCustomer(req);
  const b = await one('SELECT max_stamps FROM businesses WHERE id = $1', [req.staff.business_id]);
  const target = Number(req.body?.stamps);
  if (!Number.isInteger(target) || target < 0 || target > b.max_stamps) throw new AppError('bad', `Wert 0–${b.max_stamps}`);
  await q('UPDATE cards SET stamps = $2, reward_pending = $3, updated_at = now() WHERE id = $1',
    [c.card_id, target, target >= b.max_stamps]);
  await q(`INSERT INTO stamp_events (business_id, card_id, staff_id, kind, amount) VALUES ($1,$2,$3,'adjust',$4)`,
    [req.staff.business_id, c.card_id, req.staff.id, target - c.stamps]);
  await audit(req.staff.business_id, req.staff.id, 'stamps_adjusted', { customerId: c.id, from: c.stamps, to: target });
  syncCard(c.card_id).catch(() => {});
  res.json({ ok: true });
});

dashRouter.post('/customers/:id/message', async (req, res) => {
  const c = await ownCustomer(req);
  const text = String(req.body?.text || '').trim().slice(0, 300);
  if (!text) throw new AppError('empty', 'Nachricht fehlt.');
  if (!c.marketing_consent) throw new AppError('no_consent', 'Kunde hat keiner Werbung zugestimmt.', 409);
  const ok = await sendCardMessage(c.card_id, text);
  await q(`INSERT INTO campaign_log (business_id, card_id, rule_key, variant, message) VALUES ($1,$2,'manual',$3,$4)`,
    [req.staff.business_id, c.card_id, ok ? 'sent' : 'failed', text]);
  res.json({ ok });
});

dashRouter.get('/customers/:id/export', async (req, res) => {
  const data = await exportCustomerData(req.staff.business_id, req.params.id);
  await audit(req.staff.business_id, req.staff.id, 'customer_exported', { customerId: req.params.id });
  res.set('Content-Disposition', 'attachment; filename="kundendaten.json"').json(data);
});

dashRouter.delete('/customers/:id', async (req, res) => {
  const ok = await deleteCustomer(req.staff.business_id, req.params.id, { staffId: req.staff.id, reason: 'owner' });
  if (!ok) throw new AppError('not_found', 'Kunde nicht gefunden.', 404);
  res.json({ ok: true });
});

// ------------------------------------------------------------ Automationen
dashRouter.get('/rules', async (req, res) => {
  const bid = req.staff.business_id;
  const rules = await many('SELECT key, enabled, message, params FROM rules WHERE business_id = $1', [bid]);
  const effect = await ruleEffect(bid);
  const b = await one('SELECT message_cap_days, holdout_percent FROM businesses WHERE id = $1', [bid]);
  res.json({
    settings: b,
    rules: Object.keys(RULE_META).map((key) => {
      const r = rules.find((x) => x.key === key) || {};
      return { key, title: RULE_META[key].title, description: RULE_META[key].description,
        enabled: r.enabled ?? false, message: r.message ?? RULE_META[key].message,
        params: { ...RULE_META[key].params, ...(r.params || {}) }, effect: effect[key] || null };
    }),
    manualEffect: effect.manual || null,
  });
});

dashRouter.put('/rules/:key', async (req, res) => {
  const meta = RULE_META[req.params.key];
  if (!meta) throw new AppError('not_found', 'Regel unbekannt.', 404);
  const message = String(req.body?.message ?? meta.message).trim().slice(0, 300);
  if (message.length < 10) throw new AppError('short', 'Nachricht zu kurz.');
  const params = { ...meta.params };
  for (const [k, v] of Object.entries(req.body?.params || {})) {
    if (k in meta.params && Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 365) params[k] = Number(v);
  }
  await q(`INSERT INTO rules (business_id, key, enabled, message, params) VALUES ($1,$2,$3,$4,$5)
           ON CONFLICT (business_id, key) DO UPDATE SET enabled = EXCLUDED.enabled, message = EXCLUDED.message, params = EXCLUDED.params`,
    [req.staff.business_id, req.params.key, req.body?.enabled === true, message, params]);
  res.json({ ok: true });
});

dashRouter.post('/campaign', async (req, res) => {
  const segment = String(req.body?.segment || 'all');
  if (segment !== 'all' && !SEGMENTS[segment]) throw new AppError('bad_segment', 'Segment unbekannt.');
  const message = String(req.body?.message || '').trim().slice(0, 300);
  if (!req.body?.dryRun && message.length < 10) throw new AppError('short', 'Nachricht zu kurz.');
  const offerDays = Math.max(0, Math.min(60, Number(req.body?.offerDays) || 0));
  const r = await manualCampaign(req.staff.business_id, { segment, message, offerDays, dryRun: req.body?.dryRun === true });
  if (!req.body?.dryRun) await audit(req.staff.business_id, req.staff.id, 'campaign_sent', { segment, recipients: r.recipients });
  res.json(r);
});

/** Für Demo/Tests: Automationen jetzt sofort laufen lassen (ignoriert Sendezeiten). */
dashRouter.post('/automations/run', async (req, res) => {
  res.json(await runAutomations({ businessId: req.staff.business_id, ignoreWindow: true }));
});

// ------------------------------------------------------------ Einstellungen
const SETTINGS = {
  name: (v) => String(v).trim().slice(0, 60),
  program_name: (v) => String(v).trim().slice(0, 40),
  reward_text: (v) => String(v).trim().slice(0, 60),
  max_stamps: (v) => Math.round(Number(v)),
  stamp_cooldown_hours: (v) => Math.round(Number(v)),
  expected_interval_days: (v) => Math.round(Number(v)),
  bg_color: (v) => (/^#[0-9a-fA-F]{6}$/.test(v) ? v : null),
  fg_color: (v) => (/^#[0-9a-fA-F]{6}$/.test(v) ? v : null),
  accent_color: (v) => (/^#[0-9a-fA-F]{6}$/.test(v) ? v : null),
  address: (v) => String(v).trim().slice(0, 200),
  contact_email: (v) => String(v).trim().slice(0, 120),
  contact_phone: (v) => String(v).trim().slice(0, 40),
  retention_months: (v) => Math.round(Number(v)),
  message_cap_days: (v) => Math.round(Number(v)),
  holdout_percent: (v) => Math.round(Number(v)),
};

dashRouter.get('/settings', async (req, res) => {
  const b = await one('SELECT * FROM businesses WHERE id = $1', [req.staff.business_id]);
  const out = Object.fromEntries(Object.keys(SETTINGS).map((k) => [k, b[k]]));
  res.json({ ...out, slug: b.slug, locations: b.locations,
    logoUrl: b.logo_png ? `/media/logo/${b.id}.png?v=${new Date(b.logo_updated_at || 0).getTime()}` : null });
});

dashRouter.put('/settings', async (req, res) => {
  const sets = []; const vals = [req.staff.business_id];
  for (const [k, fn] of Object.entries(SETTINGS)) {
    if (!(k in (req.body || {}))) continue;
    const v = fn(req.body[k]);
    if (v === null || v === '' && ['name', 'program_name', 'reward_text'].includes(k) || Number.isNaN(v)) {
      throw new AppError('bad_value', `Ungültiger Wert: ${k}`);
    }
    vals.push(v); sets.push(`${k} = $${vals.length}`);
  }
  if ('locations' in (req.body || {})) {
    vals.push(JSON.stringify(validLocations(req.body.locations))); sets.push(`locations = $${vals.length}::jsonb`);
  }
  if (!sets.length) return res.json({ ok: true });
  try {
    await q(`UPDATE businesses SET ${sets.join(', ')}, updated_at = now() WHERE id = $1`, vals);
  } catch (e) {
    if (e.code === '23514') throw new AppError('range', 'Ein Wert liegt außerhalb des erlaubten Bereichs.');
    throw e;
  }
  await refreshAllCards(req.staff.business_id);
  res.json({ ok: true });
});

dashRouter.put('/settings/logo', express.raw({ type: 'image/png', limit: '400kb' }), async (req, res) => {
  const buf = req.body;
  if (!Buffer.isBuffer(buf) || buf.length < 50 || buf.readUInt32BE(0) !== 0x89504e47) {
    throw new AppError('bad_png', 'Bitte ein PNG hochladen (max. 400 KB).');
  }
  await q('UPDATE businesses SET logo_png = $2, logo_updated_at = now(), updated_at = now() WHERE id = $1',
    [req.staff.business_id, buf]);
  await refreshAllCards(req.staff.business_id);
  res.json({ ok: true });
});

/** Nach Design-/Standortänderung: Google-Klasse aktualisieren, Apple-Karten neu ausliefern. */
async function refreshAllCards(bid) {
  const b = await one('SELECT * FROM businesses WHERE id = $1', [bid]);
  if (config.google.enabled) google.upsertClass(b).catch((e) => console.error('[Google class]', e.message));
  await q('UPDATE cards SET updated_at = now() WHERE business_id = $1', [bid]);
  const cards = await many('SELECT id FROM cards WHERE business_id = $1 AND has_apple', [bid]);
  (async () => { for (const c of cards) await syncCard(c.id).catch(() => {}); })();
}

dashRouter.get('/poster.svg', async (req, res) => {
  const url = `${config.publicUrl}/k/${req.staff.slug}`;
  res.type('image/svg+xml').send(await QRCode.toString(url, { type: 'svg', margin: 2, errorCorrectionLevel: 'M' }));
});

// ------------------------------------------------------------ Team
dashRouter.get('/staff', async (req, res) => {
  res.json(await many(
    `SELECT id, email, name, role, active, last_login_at, created_at FROM staff WHERE business_id = $1 ORDER BY role, name`,
    [req.staff.business_id]));
});

dashRouter.post('/staff', async (req, res) => {
  const email = String(req.body?.email || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new AppError('bad_email', 'E-Mail ungültig.');
  const role = req.body?.role === 'owner' ? 'owner' : 'staff';
  const pw = randomPassword();
  try {
    await q('INSERT INTO staff (business_id, email, name, role, password_hash) VALUES ($1,$2,$3,$4,$5)',
      [req.staff.business_id, email, String(req.body?.name || '').slice(0, 60), role, await hashPassword(pw)]);
  } catch (e) {
    if (e.code === '23505') throw new AppError('duplicate', 'E-Mail ist schon vergeben.', 409);
    throw e;
  }
  await audit(req.staff.business_id, req.staff.id, 'staff_created', { email, role });
  res.status(201).json({ email, password: pw });
});

dashRouter.patch('/staff/:id', async (req, res) => {
  if (req.params.id === req.staff.id) throw new AppError('self', 'Du kannst dich nicht selbst deaktivieren.');
  const active = req.body?.active === true;
  const r = await q(
    `UPDATE staff SET active = $3, session_version = session_version + 1 WHERE id = $1 AND business_id = $2`,
    [req.params.id, req.staff.business_id, active]);
  if (!r.rowCount) throw new AppError('not_found', 'Nicht gefunden.', 404);
  await audit(req.staff.business_id, req.staff.id, active ? 'staff_activated' : 'staff_deactivated', { id: req.params.id });
  res.json({ ok: true });
});

dashRouter.post('/staff/:id/reset-password', async (req, res) => {
  const pw = randomPassword();
  const r = await q(
    `UPDATE staff SET password_hash = $3, session_version = session_version + 1 WHERE id = $1 AND business_id = $2`,
    [req.params.id, req.staff.business_id, await hashPassword(pw)]);
  if (!r.rowCount) throw new AppError('not_found', 'Nicht gefunden.', 404);
  res.json({ password: pw });
});
