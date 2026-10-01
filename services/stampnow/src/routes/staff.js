/**
 * Mitarbeiter-API: Login, Scannen, Einlösen, Rückgängig, Kunde am Tresen anlegen.
 */
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';
import { one, q } from '../db.js';
import {
  clearSessionCookie, hashPassword, login, requireStaff, setSessionCookie, validatePassword,
} from '../auth.js';
import {
  AppError, createCustomerAndCard, normalizePhone, redeem, stampByQr, undoStamp,
} from '../services.js';
import { manageUrl } from '../wallet/view.js';

export const staffRouter = Router();

const loginLimit = rateLimit({ windowMs: 15 * 60e3, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { error: 'Zu viele Login-Versuche. Bitte 15 Minuten warten.' } });
const scanLimit = rateLimit({ windowMs: 60e3, limit: 60, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { error: 'Zu viele Scans pro Minute.' } });

staffRouter.post('/auth/login', loginLimit, async (req, res) => {
  const s = await login(req.body?.email, req.body?.password);
  if (!s) return res.status(401).json({ error: 'E-Mail oder Passwort falsch.' });
  setSessionCookie(res, s);
  res.json({ role: s.role, name: s.name, business: s.business_name });
});

staffRouter.post('/auth/logout', (req, res) => { clearSessionCookie(res); res.json({ ok: true }); });

staffRouter.get('/auth/me', requireStaff(), (req, res) => {
  const s = req.staff;
  res.json({ id: s.id, name: s.name, email: s.email, role: s.role, business: s.business_name, slug: s.slug });
});

staffRouter.post('/scan', requireStaff(), scanLimit, async (req, res) => {
  res.json(await stampByQr(req.staff, req.body?.qr, { force: req.body?.force === true }));
});

staffRouter.post('/cards/:id/redeem', requireStaff(), async (req, res) => {
  res.json(await redeem(req.staff, req.params.id));
});

staffRouter.post('/stamps/:eventId/undo', requireStaff(), async (req, res) => {
  if (!/^\d+$/.test(req.params.eventId)) throw new AppError('bad_id', 'Ungültig');
  res.json(await undoStamp(req.staff, req.params.eventId));
});

/** Kunde am Tresen anlegen → QR, den der Kunde mit seinem Handy scannt, um die Karte zu öffnen. */
staffRouter.post('/customers', requireStaff(), async (req, res) => {
  const b = await one('SELECT * FROM businesses WHERE id = $1', [req.staff.business_id]);
  const { card } = await createCustomerAndCard(b, {
    name: req.body?.name, phone: req.body?.phone,
    marketingConsent: req.body?.marketingConsent === true, source: `counter:${req.staff.id}`,
  });
  const url = manageUrl(card.public_id);
  res.status(201).json({ url, qrSvg: await QRCode.toString(url, { type: 'svg', margin: 1 }) });
});

/** Karte verloren / neues Handy: Link erneut zeigen (Mitarbeiter prüft die Person vor Ort). */
staffRouter.post('/customers/resend', requireStaff(), async (req, res) => {
  const p = normalizePhone(req.body?.phone);
  if (!p) throw new AppError('bad_phone', 'Ungültige Nummer.');
  const c = await one(
    `SELECT c.public_id, cu.name FROM customers cu JOIN cards c ON c.customer_id = cu.id
      WHERE cu.business_id = $1 AND cu.phone_e164 = $2`, [req.staff.business_id, p]);
  if (!c) throw new AppError('not_found', 'Keine Karte mit dieser Nummer.', 404);
  const url = manageUrl(c.public_id);
  res.json({ name: c.name, url, qrSvg: await QRCode.toString(url, { type: 'svg', margin: 1 }) });
});

/** Eigenes Passwort ändern (alle Rollen). Loggt alle anderen Geräte aus. */
staffRouter.post('/me/password', requireStaff(), async (req, res) => {
  const row = await one('SELECT password_hash FROM staff WHERE id = $1', [req.staff.id]);
  if (!(await bcrypt.compare(String(req.body?.current || ''), row.password_hash))) {
    throw new AppError('wrong', 'Aktuelles Passwort ist falsch.', 403);
  }
  const err = validatePassword(req.body?.next);
  if (err) throw new AppError('weak', err);
  const upd = await one('UPDATE staff SET password_hash = $2, session_version = session_version + 1 WHERE id = $1 RETURNING id, session_version',
    [req.staff.id, await hashPassword(req.body.next)]);
  setSessionCookie(res, upd); // dieses Gerät bleibt eingeloggt, alle anderen fliegen raus
  res.json({ ok: true });
});
