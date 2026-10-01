/**
 * Kryptografische Kennungen.
 *
 * public_id   128 Bit Zufall – nicht erratbar (alte IDs hatten nur 32 Bit).
 * QR-Inhalt   "SI1.<public_id>.<hmac>" – der Server akzeptiert nur Codes mit gültiger
 *             Signatur. Ausgedachte oder manipulierte Codes werden sofort abgelehnt,
 *             bevor die Datenbank überhaupt gefragt wird.
 * Apple-Auth  pro Karte abgeleitet (HMAC) – muss nicht gespeichert werden.
 * Manage-Link Geheimer Link für den Kunden ("Meine Daten": Export, Einwilligung, Löschen).
 *
 * Alle Schlüssel werden aus APP_SECRET abgeleitet. APP_SECRET ändern = alle QR-Codes
 * und Links werden ungültig. Also: einmal sicher setzen und nicht mehr anfassen.
 */
import crypto from 'node:crypto';
import { deriveKey } from './config.js';

const b64u = (buf) => buf.toString('base64url');
const hmac = (purpose, data, bytes) =>
  crypto.createHmac('sha256', deriveKey(purpose)).update(data).digest().subarray(0, bytes);

export const newPublicId = () => b64u(crypto.randomBytes(16)); // 22 Zeichen

const PUBLIC_ID_RE = /^[A-Za-z0-9_-]{22}$/;
export const isPublicId = (s) => typeof s === 'string' && PUBLIC_ID_RE.test(s);

function safeEqual(a, b) {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

export function qrPayload(publicId) {
  return `SI1.${publicId}.${b64u(hmac('qr', publicId, 12))}`;
}

/** Gibt die public_id zurück, wenn der QR-Inhalt echt ist, sonst null. */
export function verifyQr(text) {
  if (typeof text !== 'string') return null;
  const m = text.trim().match(/^SI1\.([A-Za-z0-9_-]{22})\.([A-Za-z0-9_-]{16})$/);
  if (!m) return null;
  return safeEqual(m[2], b64u(hmac('qr', m[1], 12))) ? m[1] : null;
}

export const appleAuthToken = (publicId) => b64u(hmac('apple-auth', publicId, 24));
export const verifyAppleAuth = (publicId, token) => safeEqual(token, appleAuthToken(publicId));

export const manageToken = (publicId) => b64u(hmac('manage', publicId, 16));
export const verifyManage = (publicId, token) => isPublicId(publicId) && safeEqual(token, manageToken(publicId));

export const randomPassword = () => b64u(crypto.randomBytes(9)); // 12 Zeichen
