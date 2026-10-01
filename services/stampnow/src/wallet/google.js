/**
 * Google Wallet (Loyalty-API).
 * - Pro Betrieb eine LoyaltyClass (Name, Farbe, Logo, Standorte)
 * - Pro Kunde ein LoyaltyObject (Stempel, QR, Neuigkeiten)
 * - Nachrichten über addMessage mit TEXT_AND_NOTIFY → Push-Mitteilung auf Android.
 *   Google begrenzt Benachrichtigungen (ca. 3 pro Karte/24h) – unsere eigene
 *   Frequenzgrenze liegt weit darunter.
 */
import jwt from 'jsonwebtoken';
import { JWT } from 'google-auth-library';
import { config } from '../config.js';
import { cardView, validLocations } from './view.js';

const BASE = 'https://walletobjects.googleapis.com/walletobjects/v1';
let client = null;

function api() {
  if (!config.google.enabled) throw new Error('Google Wallet ist nicht konfiguriert.');
  if (!client) {
    const sa = config.google.serviceAccount;
    client = new JWT({ email: sa.client_email, key: sa.private_key,
      scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'] });
  }
  return client;
}

async function call(method, path, data) {
  try {
    const r = await api().request({ url: `${BASE}${path}`, method, data });
    return { status: r.status, data: r.data };
  } catch (e) {
    const status = e.response?.status;
    if (status) return { status, data: e.response.data };
    throw e;
  }
}

export const classId = (business) => `${config.google.issuerId}.b_${business.id.replace(/-/g, '')}`;
export const objectId = (card) => `${config.google.issuerId}.${card.public_id}`;

function logoUrl(business) {
  return business.logo_png
    ? `${config.publicUrl}/media/logo/${business.id}.png?v=${new Date(business.logo_updated_at || 0).getTime()}`
    : `${config.publicUrl}/assets/logo-default.png`;
}

function classBody(business) {
  const body = {
    id: classId(business),
    issuerName: business.name,
    programName: business.program_name,
    programLogo: { sourceUri: { uri: logoUrl(business) }, contentDescription: { defaultValue: { language: 'de', value: business.name } } },
    hexBackgroundColor: business.bg_color,
    reviewStatus: 'UNDER_REVIEW',
    countryCode: 'DE',
    multipleDevicesAndHoldersAllowedStatus: 'ONE_USER_ALL_DEVICES',
  };
  const locs = validLocations(business.locations);
  // Hinweis: Google nutzt diese Standorte laut Doku nicht mehr zuverlässig für
  // Geo-Benachrichtigungen – wir setzen sie trotzdem, schadet nicht.
  if (locs.length) body.locations = locs.map((l) => ({ latitude: l.latitude, longitude: l.longitude }));
  return body;
}

/** Klasse anlegen oder aktualisieren (bei neuem Betrieb oder geänderten Einstellungen). */
export async function upsertClass(business) {
  const body = classBody(business);
  const get = await call('GET', `/loyaltyClass/${body.id}`);
  const r = get.status === 404
    ? await call('POST', '/loyaltyClass', body)
    : await call('PUT', `/loyaltyClass/${body.id}`, body);
  if (r.status >= 300) throw new Error(`Google Class ${r.status}: ${JSON.stringify(r.data)}`);
}

function objectBody(business, card, customer) {
  const v = cardView(business, card, customer);
  return {
    id: objectId(card),
    classId: classId(business),
    state: 'ACTIVE',
    accountName: v.customerName,
    accountId: card.public_id.slice(0, 8),
    loyaltyPoints: { label: 'Stempel', balance: { string: v.stampsText } },
    barcode: { type: 'QR_CODE', value: v.qr },
    textModulesData: [
      { id: 'progress', header: v.title, body: v.dots },
      { id: 'reward', header: v.rewardPending ? 'Belohnung bereit' : 'Belohnung', body: v.rewardLine },
      ...(v.news ? [{ id: 'news', header: 'Aktuell', body: v.news }] : []),
      { id: 'howto', header: 'So funktioniert es', body: v.howTo },
    ],
    linksModuleData: { uris: [
      { id: 'manage', uri: v.manageUrl, description: 'Meine Daten & Einwilligungen' },
      { id: 'privacy', uri: v.privacyUrl, description: 'Datenschutz' },
    ] },
  };
}

/** Legt das Objekt an (falls neu) und gibt den "Zu Google Wallet hinzufügen"-Link zurück. */
export async function saveLink(business, card, customer) {
  await upsertClass(business).catch((e) => console.error('[Google class]', e.message));
  const body = objectBody(business, card, customer);
  let r = await call('POST', '/loyaltyObject', body);
  if (r.status === 409) r = await call('PUT', `/loyaltyObject/${body.id}`, body);
  if (r.status >= 300) throw new Error(`Google Object ${r.status}: ${JSON.stringify(r.data)}`);

  const sa = config.google.serviceAccount;
  const token = jwt.sign({
    iss: sa.client_email,
    aud: 'google',
    origins: [config.publicUrl],
    typ: 'savetowallet',
    payload: { loyaltyObjects: [{ id: body.id }] },
  }, sa.private_key, { algorithm: 'RS256' });
  return `https://pay.google.com/gp/v/save/${token}`;
}

/** Stempelstand/Neuigkeiten aktualisieren (Karte aktualisiert sich still). */
export async function updateObject(business, card, customer) {
  const body = objectBody(business, card, customer);
  const r = await call('PUT', `/loyaltyObject/${body.id}`, body);
  if (r.status === 404) return false; // Kunde hat die Karte nie gespeichert
  if (r.status >= 300) throw new Error(`Google update ${r.status}: ${JSON.stringify(r.data)}`);
  return true;
}

/** Nachricht mit Push-Mitteilung. */
export async function sendMessage(card, header, text) {
  const id = `m${Date.now()}`;
  const now = new Date();
  const r = await call('POST', `/loyaltyObject/${objectId(card)}/addMessage`, {
    message: {
      id, header: header.slice(0, 60), body: text.slice(0, 500),
      messageType: 'TEXT_AND_NOTIFY',
      displayInterval: { start: { date: now.toISOString() }, end: { date: new Date(+now + 14 * 864e5).toISOString() } },
    },
  });
  if (r.status === 404) return false;
  if (r.status >= 300) throw new Error(`Google message ${r.status}: ${JSON.stringify(r.data)}`);
  return true;
}

/** Karte deaktivieren (bei Löschung auf Kundenwunsch). */
export async function expireObject(card) {
  const r = await call('PATCH', `/loyaltyObject/${objectId(card)}`, { state: 'INACTIVE' });
  return r.status < 300;
}
