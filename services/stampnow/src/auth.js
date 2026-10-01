/**
 * Mitarbeiter-Login.
 * - Passwörter: bcrypt (Kosten 12)
 * - Session: signiertes JWT im HttpOnly-Cookie; enthält session_version, damit
 *   "Mitarbeiter deaktivieren" oder "Passwort ändern" alle Geräte sofort ausloggt.
 * - CSRF: Jede schreibende API-Anfrage braucht den Header `X-StampIt: 1`.
 *   Fremde Websites können diesen Header ohne CORS-Freigabe nicht setzen.
 */
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config, deriveKey, isProd } from './config.js';
import { one, q } from './db.js';

const COOKIE = 'stampit_session';
const SESSION_DAYS = 14;
const key = () => deriveKey('session');

export const hashPassword = (pw) => bcrypt.hash(pw, 12);

export function validatePassword(pw) {
  if (typeof pw !== 'string' || pw.length < 10) return 'Passwort muss mindestens 10 Zeichen haben.';
  if (pw.length > 200) return 'Passwort ist zu lang.';
  return null;
}

// Gegen Timing-Angriffe: auch bei unbekannter E-Mail einmal bcrypt rechnen.
const DUMMY_HASH = bcrypt.hashSync('dummy-password-für-timing', 12);

export async function login(email, password) {
  const s = await one(
    `SELECT s.*, b.slug, b.name AS business_name FROM staff s JOIN businesses b ON b.id = s.business_id
     WHERE lower(s.email) = lower($1)`, [String(email || '').trim()]);
  const ok = await bcrypt.compare(String(password || ''), s ? s.password_hash : DUMMY_HASH);
  if (!s || !ok || !s.active) return null;
  await q('UPDATE staff SET last_login_at = now() WHERE id = $1', [s.id]);
  return s;
}

export function setSessionCookie(res, staff) {
  const token = jwt.sign({ sid: staff.id, v: staff.session_version }, key(),
    { algorithm: 'HS256', expiresIn: `${SESSION_DAYS}d` });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: isProd || config.publicUrl.startsWith('https://'),
    sameSite: 'lax',
    maxAge: SESSION_DAYS * 864e5,
    path: '/',
  });
}

export const clearSessionCookie = (res) => res.clearCookie(COOKIE, { path: '/' });

/** Lädt den eingeloggten Mitarbeiter (oder null). */
export async function currentStaff(req) {
  const token = req.cookies?.[COOKIE];
  if (!token) return null;
  let payload;
  try { payload = jwt.verify(token, key(), { algorithms: ['HS256'] }); } catch { return null; }
  const s = await one(
    `SELECT s.id, s.business_id, s.email, s.name, s.role, s.active, s.session_version,
            b.slug, b.name AS business_name
       FROM staff s JOIN businesses b ON b.id = s.business_id WHERE s.id = $1`, [payload.sid]);
  if (!s || !s.active || s.session_version !== payload.v) return null;
  return s;
}

export function requireStaff(roles = ['owner', 'staff']) {
  return async (req, res, next) => {
    const s = await currentStaff(req);
    if (!s) return res.status(401).json({ error: 'Bitte neu einloggen.' });
    if (!roles.includes(s.role)) return res.status(403).json({ error: 'Nur für Inhaber.' });
    req.staff = s;
    next();
  };
}
export const requireOwner = requireStaff(['owner']);

export function csrfGuard(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('x-stampit') !== '1') return res.status(403).json({ error: 'Ungültige Anfrage (CSRF).' });
  next();
}

export function requireAdminToken(req, res, next) {
  const auth = req.get('authorization') || '';
  const expected = `Bearer ${config.adminToken}`;
  const a = Buffer.from(auth), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'unauthorized' });
  next();
}
