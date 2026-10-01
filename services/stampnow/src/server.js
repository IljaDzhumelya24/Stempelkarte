/**
 * StampNow App-Server
 *   /                 → Login
 *   /scan             → Mitarbeiter: QR scannen (Handy/Tablet)
 *   /dashboard        → Inhaber: Übersicht, Kunden, Aktionen, Einstellungen
 *   /k/:slug          → Kunde: Karte holen (Poster-QR im Laden)
 *   /meine-karte/:id  → Kunde: Wallet hinzufügen, Einwilligung, Export, Löschen
 *   /wallet/v1/...    → Apple PassKit Web Service
 */
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'node:url';
import { config, isProd } from './config.js';
import { csrfGuard } from './auth.js';
import { AppError } from './services.js';
import { publicRouter } from './routes/public.js';
import { staffRouter } from './routes/staff.js';
import { dashRouter } from './routes/dashboard.js';
import { appleRouter } from './routes/apple.js';
import { adminRouter } from './routes/admin.js';
import { startJobs } from './jobs.js';
import { siteRouter } from './site.js';

const PUBLIC_DIR = fileURLToPath(new URL('../public/', import.meta.url));
const ASSETS_DIR = fileURLToPath(new URL('../assets/', import.meta.url));

export function createApp() {
  const app = express();
  app.set('trust proxy', 1); // Railway sitzt vor uns (für Rate-Limits & Secure-Cookies)
  app.disable('x-powered-by');

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        fontSrc: ["'self'"],
        mediaSrc: ["'self'", 'blob:'],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
  }));
  app.use((req, res, next) => {
    res.set('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
    next();
  });

  // Apple Wallet: eigener Body-Parser, keine CSRF-Prüfung (iOS schickt keinen Header)
  app.use('/wallet/v1', express.json({ limit: '100kb' }), appleRouter);

  app.use(cookieParser());
  app.use(express.json({ limit: '100kb' }));
  app.use('/api', csrfGuard);

  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use('/api/admin', adminRouter);
  app.use('/api/dash', dashRouter);
  app.use('/api', staffRouter);
  app.use(siteRouter); // Startseite, Impressum, Datenschutz
  app.use(publicRouter);

  // Seiten
  const page = (file) => (req, res) => res.sendFile(file, { root: PUBLIC_DIR });
  app.get('/login', page('login.html'));
  app.get('/scan', page('scan.html'));
  app.get('/dashboard', page('dashboard.html'));
  app.get('/k/:slug', page('join.html'));
  app.get('/meine-karte/:publicId', page('card.html'));

  app.use('/assets', express.static(ASSETS_DIR, { maxAge: '7d' }));
  app.use(express.static(PUBLIC_DIR, { index: false, maxAge: isProd ? '1h' : 0 }));

  app.use('/api', (req, res) => res.status(404).json({ error: 'Nicht gefunden.' }));

  // Fehlerbehandlung: bekannte Fehler → verständliche Meldung, Rest → 500 ohne Details
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof AppError) return res.status(err.status).json({ error: err.message, code: err.code, ...err.extra });
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Datei/Anfrage zu groß.' });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Ungültige Anfrage.' });
    console.error(err);
    res.status(500).json({ error: 'Interner Fehler. Bitte erneut versuchen.' });
  });
  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`StampNow läuft auf ${config.publicUrl} (Port ${config.port})`);
    console.log(`  Apple Wallet: ${config.apple.enabled ? 'aktiv' : 'NICHT konfiguriert'}`);
    console.log(`  Google Wallet: ${config.google.enabled ? 'aktiv' : 'NICHT konfiguriert'}`);
  });
  if (process.env.JOBS_ENABLED !== 'false') startJobs();
}
