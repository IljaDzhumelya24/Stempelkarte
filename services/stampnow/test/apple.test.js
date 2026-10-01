/**
 * Baut eine echte .pkpass mit einem selbstsignierten Test-Zertifikat und prüft den Inhalt.
 * (Apple akzeptiert die Signatur natürlich nur mit deinem echten Zertifikat.)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'stampit-apple-'));
let haveOpenssl = true;
try {
  execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', join(dir, 'k.pem'),
    '-out', join(dir, 'c.pem'), '-days', '1', '-subj', '/CN=Test Pass'], { stdio: 'ignore' });
} catch { haveOpenssl = false; }

test('pkpass enthält Stempel, signierten QR, Standorte und Web-Service', { skip: !haveOpenssl && 'openssl fehlt' }, async () => {
  const cert = readFileSync(join(dir, 'c.pem'), 'utf8');
  process.env.APPLE_TEAM_ID = 'TEAM123456';
  process.env.APPLE_SIGNER_CERT_PEM = cert.replace(/\n/g, '\\n'); // wie Railway es speichert
  process.env.APPLE_SIGNER_KEY_PEM = readFileSync(join(dir, 'k.pem'), 'utf8');
  process.env.APPLE_WWDR_PEM = cert;
  process.env.PUBLIC_URL = 'https://app.stampnow.de';

  const { buildPass } = await import('../src/wallet/apple.js');
  const { verifyQr } = await import('../src/tokens.js');
  const business = {
    id: '00000000-0000-0000-0000-000000000001', slug: 'salon-bella', name: 'Salon Bella', program_name: 'Stempelkarte',
    reward_text: 'Gratis Schnitt', max_stamps: 10, bg_color: '#1f2a44', fg_color: '#ffffff', accent_color: '#c9a35b',
    address: 'Lange Str. 1', logo_png: null,
    locations: [{ latitude: 53.05, longitude: 8.63, relevantText: 'Salon Bella ist um die Ecke' }],
  };
  const card = { public_id: 'AbCdEfGhIjKlMnOpQrStUv', stamps: 4, reward_pending: false, news_text: 'Doppelte Stempel bis Freitag' };
  const buf = buildPass(business, card, { name: 'Lena Meyer' });
  assert.ok(buf.length > 1000);

  const file = join(dir, 't.pkpass');
  writeFileSync(file, buf);
  const pass = JSON.parse(execFileSync('unzip', ['-p', file, 'pass.json']).toString());
  const list = execFileSync('unzip', ['-l', file]).toString();
  assert.match(list, /signature/);
  assert.match(list, /manifest\.json/);
  assert.equal(pass.serialNumber, card.public_id);
  assert.equal(pass.webServiceURL, 'https://app.stampnow.de/wallet');
  assert.ok(pass.authenticationToken.length >= 16);
  assert.equal(pass.storeCard.headerFields[0].value, '4 / 10');
  assert.equal(pass.storeCard.primaryFields[0].value, '●●●●○○○○○○');
  assert.equal(pass.storeCard.backFields.find((f) => f.key === 'news').value, 'Doppelte Stempel bis Freitag');
  assert.equal(verifyQr(pass.barcodes[0].message), card.public_id);
  assert.equal(pass.locations[0].relevantText, 'Salon Bella ist um die Ecke');
  assert.equal(pass.sharingProhibited, true);
});
