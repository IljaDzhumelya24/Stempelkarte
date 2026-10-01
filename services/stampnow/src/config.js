/**
 * Zentrale Konfiguration. Alle Geheimnisse kommen AUSSCHLIESSLICH aus
 * Umgebungsvariablen (Railway → Variables, lokal → .env über `node --env-file`).
 * In Produktion startet der Server nicht, wenn ein Pflicht-Secret fehlt oder
 * offensichtlich unsicher ist ("change-me" usw.).
 */
import crypto from 'node:crypto';

const env = process.env;
export const isProd = env.NODE_ENV === 'production';

/** Railway speichert mehrzeilige Werte oft mit literalen \n – das hier repariert das. */
export function normalizePem(raw) {
  if (!raw) return null;
  let s = String(raw).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1);
  s = s.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n').replace(/\r\n/g, '\n').trim();
  if (!s.includes('\n')) {
    const m = s.match(/^(-----BEGIN [A-Z ]+-----)(.*)(-----END [A-Z ]+-----)$/);
    if (m) {
      const lines = m[2].replace(/\s+/g, '').match(/.{1,64}/g) || [];
      s = `${m[1]}\n${lines.join('\n')}\n${m[3]}`;
    }
  }
  return s + '\n';
}

const WEAK = new Set(['', 'change-me', 'changeme', 'secret', 'test', 'dev']);
function secret(name, { minLen = 32 } = {}) {
  const v = env[name] || '';
  if (WEAK.has(v) || v.length < minLen) {
    if (isProd) throw new Error(`[config] ${name} fehlt oder ist zu schwach (min. ${minLen} Zeichen). Server startet nicht.`);
    // Nur lokal: zufälliger Wert pro Prozessstart (Sessions überleben dann keinen Neustart).
    return crypto.randomBytes(32).toString('hex');
  }
  return v;
}

let googleSa = null;
if (env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  try { googleSa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON); }
  catch { throw new Error('[config] GOOGLE_SERVICE_ACCOUNT_JSON ist kein gültiges JSON'); }
}

export const config = {
  port: Number(env.PORT || 3000),
  publicUrl: (env.PUBLIC_URL || `http://localhost:${env.PORT || 3000}`).replace(/\/$/, ''),
  databaseUrl: env.DATABASE_URL || 'postgres://localhost/stampit',
  databaseSsl: env.DATABASE_SSL ? env.DATABASE_SSL === 'true'
    : !/localhost|127\.0\.0\.1|\.railway\.internal/.test(env.DATABASE_URL || 'localhost'),
  timezone: env.APP_TZ || 'Europe/Berlin',

  /** Ein Master-Secret; alle Schlüssel (Session, QR, Apple-Auth, Verwaltungs-Links) werden daraus abgeleitet. */
  appSecret: secret('APP_SECRET'),
  /** Nur für die Plattform-Admin-API (Betriebe anlegen). */
  adminToken: secret('ADMIN_TOKEN'),

  apple: {
    passTypeId: env.APPLE_PASS_TYPE_ID || 'pass.com.janik.stampit',
    teamId: env.APPLE_TEAM_ID || '',
    signerCert: normalizePem(env.APPLE_SIGNER_CERT_PEM || env.APNS_CERT_PEM),
    signerKey: normalizePem(env.APPLE_SIGNER_KEY_PEM || env.APNS_KEY_PEM),
    signerKeyPassphrase: env.APPLE_SIGNER_KEY_PASSPHRASE || undefined,
    wwdr: normalizePem(env.APPLE_WWDR_PEM),
    apnsHost: env.APNS_HOST || 'https://api.push.apple.com',
  },

  google: {
    issuerId: env.GOOGLE_ISSUER_ID || '',
    serviceAccount: googleSa,
  },

  /** Automationen: Hauptschalter (z.B. in Staging aus). */
  automationsEnabled: env.AUTOMATIONS_ENABLED !== 'false',
};

config.apple.enabled = Boolean(config.apple.teamId && config.apple.signerCert && config.apple.signerKey && config.apple.wwdr);
config.google.enabled = Boolean(config.google.issuerId && config.google.serviceAccount);

/** Abgeleiteter Schlüssel für einen Zweck – so reicht ein einziges Secret. */
export function deriveKey(purpose) {
  return crypto.createHmac('sha256', config.appSecret).update(`stampit:${purpose}`).digest();
}
