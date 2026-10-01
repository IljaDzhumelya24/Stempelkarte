/**
 * Öffentliche Routen für Endkunden: Anmeldung über das Poster im Laden,
 * "Meine Karte" (Wallet hinzufügen, Einwilligung, Export, Löschen), Datenschutz.
 * Kein Login – Zugriff auf eine Karte nur mit geheimem Link-Token.
 */
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import QRCode from 'qrcode';
import { config } from '../config.js';
import { one, q } from '../db.js';
import { verifyManage } from '../tokens.js';
import {
  AppError, createCustomerAndCard, deleteCustomer, exportCustomerData, setMarketingConsent,
} from '../services.js';
import { apple, google } from '../wallet/index.js';
import { cardView, manageUrl } from '../wallet/view.js';
import { privacyPage } from '../privacy.js';

export const publicRouter = Router();

const signupLimit = rateLimit({ windowMs: 15 * 60e3, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { error: 'Zu viele Versuche. Bitte in ein paar Minuten erneut.' } });
const cardLimit = rateLimit({ windowMs: 60e3, limit: 60, standardHeaders: 'draft-7', legacyHeaders: false });

const publicBusiness = (b) => ({
  slug: b.slug, name: b.name, programName: b.program_name, rewardText: b.reward_text, maxStamps: b.max_stamps,
  bgColor: b.bg_color, fgColor: b.fg_color, accentColor: b.accent_color, address: b.address,
  logoUrl: b.logo_png ? `/media/logo/${b.id}.png?v=${new Date(b.logo_updated_at || 0).getTime()}` : null,
});

publicRouter.get('/api/public/b/:slug', async (req, res) => {
  const b = await one('SELECT * FROM businesses WHERE slug = $1', [req.params.slug]);
  if (!b) return res.status(404).json({ error: 'Betrieb nicht gefunden.' });
  res.json({ ...publicBusiness(b), apple: config.apple.enabled, google: config.google.enabled });
});

publicRouter.post('/api/public/b/:slug/signup', signupLimit, async (req, res) => {
  const b = await one('SELECT * FROM businesses WHERE slug = $1', [req.params.slug]);
  if (!b) return res.status(404).json({ error: 'Betrieb nicht gefunden.' });
  const { name, phone, privacyAccepted, marketingConsent } = req.body || {};
  if (privacyAccepted !== true) throw new AppError('privacy', 'Bitte die Datenschutzhinweise bestätigen.');
  const { card } = await createCustomerAndCard(b, {
    name, phone, marketingConsent: marketingConsent === true, source: 'signup_form',
  });
  res.status(201).json({ manageUrl: manageUrl(card.public_id) });
});

// --- Karte über geheimen Link ------------------------------------------
async function cardFromLink(req) {
  const { publicId } = req.params;
  if (!verifyManage(publicId, req.query.t)) throw new AppError('bad_link', 'Dieser Link ist ungültig.', 404);
  const card = await one('SELECT * FROM cards WHERE public_id = $1', [publicId]);
  if (!card) throw new AppError('gone', 'Diese Karte wurde gelöscht.', 404);
  const [business, customer] = await Promise.all([
    one('SELECT * FROM businesses WHERE id = $1', [card.business_id]),
    one('SELECT * FROM customers WHERE id = $1', [card.customer_id]),
  ]);
  return { card, business, customer };
}

publicRouter.get('/api/public/card/:publicId', cardLimit, async (req, res) => {
  const { card, business, customer } = await cardFromLink(req);
  const v = cardView(business, card, customer);
  res.json({
    business: publicBusiness(business),
    card: { stamps: v.stamps, max: v.max, rewardPending: v.rewardPending, news: v.news, rewardLine: v.rewardLine },
    customer: { name: customer.name, marketingConsent: customer.marketing_consent },
    wallet: { apple: config.apple.enabled, google: config.google.enabled, hasApple: card.has_apple, hasGoogle: card.has_google },
  });
});

publicRouter.get('/api/public/card/:publicId/qr.svg', cardLimit, async (req, res) => {
  const { card, business, customer } = await cardFromLink(req);
  const svg = await QRCode.toString(cardView(business, card, customer).qr, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' });
  res.type('image/svg+xml').set('Cache-Control', 'no-store').send(svg);
});

publicRouter.get('/api/public/card/:publicId/apple.pkpass', cardLimit, async (req, res) => {
  const { card, business, customer } = await cardFromLink(req);
  const buf = apple.buildPass(business, card, customer);
  await q('UPDATE cards SET has_apple = true WHERE id = $1', [card.id]);
  res.set({
    'Content-Type': 'application/vnd.apple.pkpass',
    'Content-Disposition': `attachment; filename="${business.slug}-stempelkarte.pkpass"`,
    'Cache-Control': 'no-store',
  }).send(buf);
});

publicRouter.get('/api/public/card/:publicId/google', cardLimit, async (req, res) => {
  const { card, business, customer } = await cardFromLink(req);
  const link = await google.saveLink(business, card, customer);
  await q('UPDATE cards SET has_google = true WHERE id = $1', [card.id]);
  res.redirect(302, link);
});

publicRouter.post('/api/public/card/:publicId/consent', cardLimit, async (req, res) => {
  const { customer } = await cardFromLink(req);
  await setMarketingConsent(customer.id, req.body?.marketingConsent === true, 'self_service');
  res.json({ ok: true });
});

publicRouter.get('/api/public/card/:publicId/export', cardLimit, async (req, res) => {
  const { business, customer } = await cardFromLink(req);
  const data = await exportCustomerData(business.id, customer.id);
  res.set('Content-Disposition', 'attachment; filename="meine-daten.json"').json(data);
});

publicRouter.post('/api/public/card/:publicId/delete', cardLimit, async (req, res) => {
  const { business, customer } = await cardFromLink(req);
  if (req.body?.confirm !== 'LÖSCHEN') throw new AppError('confirm', 'Bitte zur Bestätigung LÖSCHEN eingeben.');
  await deleteCustomer(business.id, customer.id, { reason: 'self_service' });
  res.json({ ok: true });
});

// --- Datenschutz & Medien ----------------------------------------------
publicRouter.get('/datenschutz/:slug', async (req, res) => {
  const b = await one('SELECT * FROM businesses WHERE slug = $1', [req.params.slug]);
  if (!b) return res.status(404).send('Nicht gefunden');
  res.type('html').send(privacyPage(b));
});

publicRouter.get('/media/logo/:id.png', async (req, res) => {
  if (!/^[0-9a-f-]{36}$/.test(req.params.id)) return res.status(404).end();
  const b = await one('SELECT logo_png FROM businesses WHERE id = $1', [req.params.id]);
  if (!b?.logo_png) return res.status(404).end();
  res.type('png').set('Cache-Control', 'public, max-age=86400').send(b.logo_png);
});
