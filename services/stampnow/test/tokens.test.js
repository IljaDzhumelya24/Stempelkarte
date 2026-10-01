import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appleAuthToken, isPublicId, manageToken, newPublicId, qrPayload, verifyAppleAuth, verifyManage, verifyQr } from '../src/tokens.js';

test('QR: echt wird akzeptiert, manipuliert abgelehnt', () => {
  const id = newPublicId();
  assert.ok(isPublicId(id));
  const qr = qrPayload(id);
  assert.equal(verifyQr(qr), id);
  assert.equal(verifyQr(` ${qr}\n`), id);
  // ein Zeichen der ID ändern
  const other = (id[0] === 'A' ? 'B' : 'A') + id.slice(1);
  assert.equal(verifyQr(qr.replace(id, other)), null);
  // Signatur ändern
  assert.equal(verifyQr(qr.slice(0, -1) + (qr.endsWith('A') ? 'B' : 'A')), null);
  // alte Kartenformate / Müll
  for (const bad of ['card_1a2b3c4d', '', null, 'SI1..', `SI2.${id}.${qr.split('.')[2]}`, 'x'.repeat(5000)]) {
    assert.equal(verifyQr(bad), null);
  }
});

test('IDs sind zufällig', () => {
  const s = new Set(Array.from({ length: 1000 }, newPublicId));
  assert.equal(s.size, 1000);
});

test('Apple-Auth & Manage-Link', () => {
  const id = newPublicId();
  assert.ok(verifyAppleAuth(id, appleAuthToken(id)));
  assert.ok(!verifyAppleAuth(id, appleAuthToken(newPublicId())));
  assert.ok(verifyManage(id, manageToken(id)));
  assert.ok(!verifyManage(id, 'falsch'));
  assert.ok(!verifyManage('../etc', manageToken(id)));
});
