/**
 * Apple PassKit Web Service (offizielles Protokoll), gemountet unter /wallet/v1.
 * iOS ruft diese Endpoints selbst auf – nie manuell.
 * Doku: https://developer.apple.com/documentation/walletpasses/adding-a-web-service-to-update-passes
 */
import { Router } from 'express';
import { config } from '../config.js';
import { many, one, q } from '../db.js';
import { verifyAppleAuth } from '../tokens.js';
import { apple, loadCardBundle } from '../wallet/index.js';

export const appleRouter = Router();

function authOk(req, serial) {
  const m = (req.get('authorization') || '').match(/^ApplePass\s+(.+)$/);
  return Boolean(m && verifyAppleAuth(serial, m[1]));
}

// Gerät registriert sich für Updates
appleRouter.post('/devices/:deviceId/registrations/:passTypeId/:serial', async (req, res) => {
  const { deviceId, passTypeId, serial } = req.params;
  if (passTypeId !== config.apple.passTypeId || !authOk(req, serial)) return res.status(401).end();
  const card = await one('SELECT id FROM cards WHERE public_id = $1', [serial]);
  if (!card) return res.status(404).end();
  const pushToken = req.body?.pushToken;
  if (!pushToken || !/^[0-9a-fA-F]{32,200}$/.test(pushToken)) return res.status(400).end();
  const r = await q(
    `INSERT INTO apple_registrations (device_id, pass_type_id, serial_number, push_token) VALUES ($1,$2,$3,$4)
     ON CONFLICT (device_id, pass_type_id, serial_number) DO UPDATE SET push_token = EXCLUDED.push_token
     RETURNING (xmax = 0) AS inserted`, [deviceId, passTypeId, serial, pushToken]);
  await q('UPDATE cards SET has_apple = true WHERE id = $1', [card.id]);
  res.status(r.rows[0].inserted ? 201 : 200).end();
});

// Welche Karten auf diesem Gerät haben sich geändert?
appleRouter.get('/devices/:deviceId/registrations/:passTypeId', async (req, res) => {
  const { deviceId, passTypeId } = req.params;
  const since = Number(req.query.passesUpdatedSince);
  const rows = await many(
    `SELECT c.public_id, c.updated_at FROM apple_registrations r JOIN cards c ON c.public_id = r.serial_number
      WHERE r.device_id = $1 AND r.pass_type_id = $2 ${Number.isFinite(since) ? 'AND c.updated_at > $3' : ''}`,
    Number.isFinite(since) ? [deviceId, passTypeId, new Date(since)] : [deviceId, passTypeId]);
  if (!rows.length) return res.status(204).end();
  res.json({
    lastUpdated: String(Math.max(...rows.map((r) => +r.updated_at))),
    serialNumbers: rows.map((r) => r.public_id),
  });
});

// Aktuelle Version der Karte
appleRouter.get('/passes/:passTypeId/:serial', async (req, res) => {
  const { serial } = req.params;
  if (!authOk(req, serial)) return res.status(401).end();
  const card = await one('SELECT id, updated_at FROM cards WHERE public_id = $1', [serial]);
  if (!card) return res.status(404).end();
  const ims = req.get('if-modified-since');
  // HTTP-Datum hat nur Sekunden-Genauigkeit
  if (ims && Math.floor(+card.updated_at / 1000) <= Math.floor(+new Date(ims) / 1000)) return res.status(304).end();
  const b = await loadCardBundle(card.id);
  res.set({ 'Content-Type': 'application/vnd.apple.pkpass', 'Last-Modified': new Date(card.updated_at).toUTCString() })
    .send(apple.buildPass(b.business, b.card, b.customer));
});

// Gerät abgemeldet (Karte gelöscht)
appleRouter.delete('/devices/:deviceId/registrations/:passTypeId/:serial', async (req, res) => {
  const { deviceId, passTypeId, serial } = req.params;
  if (!authOk(req, serial)) return res.status(401).end();
  await q('DELETE FROM apple_registrations WHERE device_id = $1 AND pass_type_id = $2 AND serial_number = $3',
    [deviceId, passTypeId, serial]);
  res.status(200).end();
});

appleRouter.post('/log', (req, res) => {
  console.log('[Apple Wallet Log]', JSON.stringify(req.body).slice(0, 2000));
  res.status(200).end();
});
