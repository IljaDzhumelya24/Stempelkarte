/**
 * Apple Wallet: .pkpass wird bei jedem Abruf frisch auf dem Server gebaut
 * (kein Hochladen von Dateien mehr aus einer Desktop-App).
 * Updates: Stempel/Nachricht → APNs-Push (leerer Payload) → iPhone holt
 * GET /wallet/v1/passes/... → bekommt die neue Karte. Die Felder mit
 * `changeMessage` erzeugen dabei eine Mitteilung auf dem Sperrbildschirm.
 */
import http2 from 'node:http2';
import { readFileSync } from 'node:fs';
import { PKPass } from 'passkit-generator';
import { config } from '../config.js';
import { appleAuthToken } from '../tokens.js';
import { cardView, hexToRgb, validLocations } from './view.js';

const ASSETS = new URL('../../assets/', import.meta.url);
const ICONS = Object.fromEntries(['icon.png', 'icon@2x.png', 'icon@3x.png']
  .map((n) => [n, readFileSync(new URL(n, ASSETS))]));

export const webServiceUrl = () => `${config.publicUrl}/wallet`;

export function buildPass(business, card, customer) {
  if (!config.apple.enabled) throw new Error('Apple Wallet ist nicht konfiguriert.');
  const v = cardView(business, card, customer);

  const files = { ...ICONS };
  if (business.logo_png) {
    files['logo.png'] = business.logo_png;
    files['logo@2x.png'] = business.logo_png;
  }

  const props = {
    formatVersion: 1,
    passTypeIdentifier: config.apple.passTypeId,
    teamIdentifier: config.apple.teamId,
    serialNumber: card.public_id,
    organizationName: business.name,
    description: `${business.program_name} – ${business.name}`,
    logoText: business.logo_png ? undefined : business.name,
    backgroundColor: hexToRgb(business.bg_color),
    foregroundColor: hexToRgb(business.fg_color),
    labelColor: hexToRgb(business.accent_color),
    sharingProhibited: true,
  };
  // Live-Updates nur über HTTPS (Apple-Vorgabe)
  if (config.publicUrl.startsWith('https://')) {
    props.webServiceURL = webServiceUrl();
    props.authenticationToken = appleAuthToken(card.public_id);
  }

  const pass = new PKPass(files, {
    wwdr: config.apple.wwdr,
    signerCert: config.apple.signerCert,
    signerKey: config.apple.signerKey,
    signerKeyPassphrase: config.apple.signerKeyPassphrase,
  }, props);

  pass.type = 'storeCard';
  pass.headerFields.push({ key: 'count', label: 'STEMPEL', value: v.stampsText, changeMessage: 'Neuer Stempelstand: %@' });
  pass.primaryFields.push({ key: 'dots', label: v.title, value: v.dots });
  pass.secondaryFields.push({ key: 'name', label: 'Name', value: v.customerName });
  pass.auxiliaryFields.push({
    key: 'reward', label: v.rewardPending ? 'Belohnung bereit' : 'Belohnung',
    value: v.rewardText, changeMessage: v.rewardPending ? 'Deine Belohnung wartet: %@' : undefined,
  });

  pass.backFields.push(
    // Neuigkeiten/Aktionen: Änderung dieses Felds löst die Mitteilung aus
    { key: 'news', label: 'Aktuell', value: v.news || '–', changeMessage: '%@' },
    { key: 'howto', label: 'So funktioniert es', value: v.howTo },
  );
  if (v.address) pass.backFields.push({ key: 'address', label: business.name, value: v.address });
  pass.backFields.push(
    { key: 'manage', label: 'Meine Daten & Einwilligungen', value: v.manageUrl,
      attributedValue: `<a href="${v.manageUrl}">Verwalten oder Karte löschen</a>` },
    { key: 'privacy', label: 'Datenschutz', value: v.privacyUrl,
      attributedValue: `<a href="${v.privacyUrl}">Datenschutzhinweise</a>` },
  );

  pass.setBarcodes({ format: 'PKBarcodeFormatQR', message: v.qr, messageEncoding: 'iso-8859-1' });

  // Phase 6: Standorte → iOS zeigt die Karte in der Nähe auf dem Sperrbildschirm an
  const locs = validLocations(business.locations);
  if (locs.length) {
    pass.setLocations(...locs.map((l) => ({
      latitude: l.latitude, longitude: l.longitude,
      relevantText: l.relevantText || `${business.name} ist in der Nähe – ${v.stampsText} Stempel`,
    })));
  }

  return pass.getAsBuffer();
}

/** Schickt einen leeren Push an alle Geräte; iOS holt sich danach die neue Karte. */
export async function pushUpdate(pushTokens) {
  if (!config.apple.enabled || pushTokens.length === 0) return { sent: 0, failed: 0, invalid: [] };
  const client = http2.connect(config.apple.apnsHost, {
    cert: config.apple.signerCert,
    key: config.apple.signerKey,
    passphrase: config.apple.signerKeyPassphrase,
  });
  const result = { sent: 0, failed: 0, invalid: [] };
  try {
    await new Promise((resolve, reject) => {
      client.once('connect', resolve);
      client.once('error', reject);
    });
    await Promise.all(pushTokens.map((token) => new Promise((resolve) => {
      const req = client.request({
        ':method': 'POST',
        ':path': `/3/device/${token}`,
        'apns-topic': config.apple.passTypeId,
        'apns-push-type': 'background',
        'apns-priority': '5',
        'content-type': 'application/json',
      });
      let status = 0;
      req.on('response', (h) => { status = h[':status']; });
      req.on('data', () => {});
      req.on('end', () => {
        if (status >= 200 && status < 300) result.sent++;
        else { result.failed++; if (status === 410 || status === 400) result.invalid.push(token); }
        resolve();
      });
      req.on('error', () => { result.failed++; resolve(); });
      req.setTimeout(10_000, () => { req.close(); });
      req.end('{}');
    })));
  } catch (e) {
    console.error('[APNs]', e.message);
    result.failed = pushTokens.length;
  } finally {
    client.close();
  }
  return result;
}
