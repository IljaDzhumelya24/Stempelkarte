# StampNow App

Digitale Stempelkarten für lokale Betriebe: Karte im Apple/Google Wallet, Mitarbeiter scannen per Web-App,
Inhaber sehen ein Dashboard, und Automationen holen Kunden zurück.

Ersetzt das alte Python-Terminal (`stampnow.py`) und den alten `wallet-service`.

## Was drin ist

| Bereich | Wo | Was |
|---|---|---|
| Kunden-Anmeldung | `/k/<kürzel>` | Poster-QR im Laden → Name + Handynummer + Einwilligungen → Karte |
| Meine Karte | `/meine-karte/<id>?t=…` | Apple/Google Wallet hinzufügen, QR anzeigen, Angebote an/aus, Daten-Export, Löschen |
| Scanner | `/scan` | Mitarbeiter-Login, Kamera-Scan, Belohnung einlösen, Rückgängig, Kunde am Tresen anlegen, Karte erneut senden |
| Dashboard | `/dashboard` | Übersicht, Kunden mit Segmenten, Automationen + Wirkungsmessung, Einstellungen, Standorte, Team |
| Apple Web Service | `/wallet/v1/…` | Live-Updates der iPhone-Karten per Push |
| Admin-API | `/api/admin/businesses` | neuen Betrieb anlegen (mit `ADMIN_TOKEN`) |

## Sicherheit (kurz)

- **QR-Codes sind signiert** (`SI1.<128-Bit-ID>.<HMAC>`). Ausgedachte oder veränderte Codes werden abgelehnt.
- **Nur eingeloggte Mitarbeiter** können stempeln, und nur Karten **ihres** Betriebs.
- **Sperrzeit** zwischen zwei Stempeln (Standard 12 h). Nur Inhaber dürfen sie übergehen.
- Passwörter mit bcrypt, Session-Cookie HttpOnly, CSRF-Schutz, Rate-Limits, strenge CSP.
- Mitarbeiter sehen nur die maskierte Telefonnummer.
- Alle Secrets kommen aus Umgebungsvariablen. In Produktion startet der Server nicht, wenn eins fehlt oder zu schwach ist.

Bleibendes Restrisiko: Wer einen **Screenshot einer echten Karte** hat, kann ihn vorzeigen. Dagegen hilft die Sperrzeit.
Außerdem sieht das Personal Name und maskierte Nummer und kann nachfragen.

## Kundenbindung (Phase 5)

- **Segmente** nach persönlichem Rhythmus (Median der Besuchsabstände): Angemeldet, Neukunde, Stammkunde, Gefährdet (1,5–3× überfällig), Verloren (>3×).
- **Regeln:** Belohnung wartet, Fast voll, Zweiter Besuch (Neukunde), Zurückholen (Stammkunde), Letzter Versuch (standardmäßig aus).
- **Angebot „doppelter Stempel“** wird beim nächsten Scan automatisch eingelöst.
- **Schutz:** nur mit Einwilligung, höchstens 1 automatische Nachricht pro 14 Tage, jede Regel höchstens 1× pro Abwesenheit, Versand nur Mo–Sa 10–19 Uhr.
- **Kontrollgruppe** (10 %) bekommt bewusst nichts. Das Dashboard zeigt, ob Kunden mit Nachricht häufiger wiederkommen als ohne.

## Lokal starten

```bash
npm install
cp .env.example .env            # Werte eintragen (DATABASE_URL auf lokale Postgres)
node --env-file=.env scripts/seed-demo.js     # Demo-Betrieb mit 80 Beispielkunden
npm run dev                     # http://localhost:3000/login  → demo@stampnow.de / demo-passwort-123
```

Die Kamera im Browser funktioniert nur auf `localhost` oder über HTTPS.

## Tests

```bash
npm test                                                   # Unit-Tests (Segmente, Regeln, QR, Apple-Pass)
TEST_DATABASE_URL=postgres://…/stampit_test npm test       # + Ende-zu-Ende gegen Postgres (LEERT diese DB!)
```

## Struktur

```
src/
  server.js          Express-App, Routen, Sicherheit
  config.js          Umgebungsvariablen, Schlüsselableitung
  migrate.js         Datenbankschema (versioniert)
  tokens.js          signierte QR-Codes, Apple-Auth, Verwaltungslinks
  auth.js            Login, Session, Rollen, CSRF
  services.js        Stempeln, Einlösen, Kunden, DSGVO-Funktionen
  privacy.js         Datenschutzhinweise je Betrieb
  jobs.js            Automationen alle 15 Min., tägliche Löschfristen
  engine/            Segmente, Regeln, Ausführung + Wirkungsmessung
  wallet/            Apple (.pkpass + APNs), Google (Loyalty API)
  routes/            public, staff, dashboard, apple, admin
public/              Seiten + JS (ohne Build-Schritt)
docs/                Schritt-für-Schritt-Anleitung, DSGVO-Vorlagen
```

Deployment: siehe **docs/ANLEITUNG.md**.
