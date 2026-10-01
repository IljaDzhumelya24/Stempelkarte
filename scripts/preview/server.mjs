import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { business, me, settings, customers, overview, rules, staff, customerDetails } from './data.mjs';
import { privacyPage } from '../../services/stampnow/src/privacy.js';

const requireApp = createRequire(new URL('../../services/stampnow/package.json', import.meta.url));
const express = requireApp('express');
const QRCode = requireApp('qrcode');
const originalPublic = fileURLToPath(new URL('../../services/stampnow/public/', import.meta.url));
const previewPublic = fileURLToPath(new URL('./public/', import.meta.url));
const message = 'Nur Vorschau: Es werden keine Änderungen gespeichert, Nachrichten verschickt oder echten Wallet-Karten erstellt.';
const navigation = `<aside class="preview-bar" aria-label="Vorschau-Navigation"><div><strong>VORSCHAU</strong><span>Beispieldaten · Änderungen werden nicht gespeichert</span></div><nav><a href="/">Alle Ansichten</a><a href="/dashboard">Dashboard</a><a href="/scan">Scanner</a><a href="/k/cafe-nord">Karte holen</a><a href="/meine-karte/preview-card?t=preview">Meine Karte</a><a href="/login">Login</a></nav></aside>`;
function decorate(html) {
  return html.replace('</head>', '<link rel="stylesheet" href="/preview-assets/preview.css"><script defer src="/preview-assets/preview.js"></script></head>')
    .replace(/(<body[^>]*>)/, `$1${navigation}`);
}

export function createPreviewApp() {
  const app = express();
  app.disable('x-powered-by');
  // No forwarding, production auth, jobs or database connections exist in this process.
  app.use((req, res, next) => {
    res.set({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'same-origin', 'X-Content-Type-Options': 'nosniff' });
    if (!['GET', 'HEAD'].includes(req.method)) return res.status(405).set('Allow', 'GET, HEAD').json({ error: message });
    next();
  });
  app.get('/', async (req, res) => res.type('html').send(decorate(await readFile(new URL('./public/index.html', import.meta.url), 'utf8'))));
  for (const [path, file] of [['/dashboard', 'dashboard'], ['/scan', 'scan'], ['/login', 'login'], ['/anmelden', 'login'], ['/k/:slug', 'join'], ['/meine-karte/:id', 'card']]) {
    app.get(path, async (req, res) => res.type('html').send(decorate(await readFile(`${originalPublic}/${file}.html`, 'utf8'))));
  }
  app.get('/api/auth/me', (req, res) => {
    // Keep the login preview visible; all other preview pages can render without credentials.
    const referer = req.get('referer');
    const isLogin = referer && ['/login', '/anmelden'].includes(new URL(referer).pathname);
    if (isLogin) return res.status(401).json({ error: 'Vorschau ohne Anmeldung. Öffne das Dashboard über die Vorschau-Navigation.' });
    res.json(me);
  });
  app.get('/api/dash/overview', (req, res) => res.json(overview));
  app.get('/api/dash/settings', (req, res) => res.json(settings));
  app.get('/api/dash/rules', (req, res) => res.json(rules));
  app.get('/api/dash/staff', (req, res) => res.json(staff));
  app.get('/api/dash/customers', (req, res) => {
    const search = String(req.query.q || '').trim().toLowerCase();
    res.json({ total: customers.length, customers: customers.filter((c) =>
      (!req.query.segment || req.query.segment === 'all' || c.segment === req.query.segment) && `${c.name} ${c.phone}`.toLowerCase().includes(search)) });
  });
  app.get('/api/dash/customers/:id', (req, res) => {
    const customer = customers.find((c) => c.customerId === req.params.id);
    if (!customer) return res.status(404).json({ error: 'Beispielkunde nicht gefunden.' });
    res.json(customerDetails(customer));
  });
  app.get('/api/public/b/:slug', (req, res) => res.json(business));
  app.get('/api/public/card/:id', (req, res) => res.json({
    business, card: { stamps: 4, max: 10, rewardPending: false, rewardLine: 'Noch 6 Stempel bis zu deinem Kaffee aufs Haus.' },
    customer: { name: 'Lena (Beispiel)', marketingConsent: true }, wallet: { apple: true, google: true, hasApple: true, hasGoogle: false },
  }));
  app.get(['/api/dash/poster.svg', '/api/public/card/:id/qr.svg'], async (req, res) => {
    const isPoster = req.path.includes('poster');
    const content = isPoster ? `http://${req.get('host')}/k/cafe-nord` : 'STAMPNOW-PREVIEW-NOT-A-REAL-CARD';
    res.type('svg').send(await QRCode.toString(content, { type: 'svg', margin: 1 }));
  });
  app.get('/datenschutz/:slug', (req, res) => res.type('html').send(decorate(privacyPage(settings))));
  app.get(['/impressum', '/datenschutz', '/demo'], (req, res) => res.redirect(`http://localhost:3000${req.path}`));
  app.use('/api', (req, res) => res.status(405).json({ error: message }));
  app.use('/preview-assets', express.static(previewPublic, { index: false }));
  app.use('/assets', express.static(fileURLToPath(new URL('../../services/stampnow/assets/', import.meta.url))));
  app.use(express.static(originalPublic, { index: false, extensions: [] }));
  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.env.NODE_ENV === 'production') throw new Error('The fixture preview is for local development only.');
  const port = Number(process.env.STAMPNOW_PREVIEW_PORT || 4100);
  createPreviewApp().listen(port, '127.0.0.1', () => {
    console.log(`StampNow Vorschau: http://localhost:${port}/`);
    console.log('Originale App-Ansichten mit Beispieldaten. Keine Datenbank, keine gespeicherten Änderungen.');
  });
}
