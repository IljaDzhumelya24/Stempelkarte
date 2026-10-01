# StampNow-Anwendung aus der ZIP

Die bestehende Next.js-Website bleibt die öffentliche Website. Die vollständige Anwendung aus `stampit-app-main.zip` liegt in `services/stampnow`. Ihre Serverlogik, Datenbankabfragen, Migrationen, Wallet-Anbindungen und Browser-Skripte wurden unverändert übernommen. Angepasst sind HTML und CSS für das blaue StampNow-Design.

## Seiten und Verbindung

`/anmelden` und `/login` öffnen die bestehende Anmeldung. `/dashboard`, `/scan`, `/k/:slug` und `/meine-karte/:publicId` öffnen die jeweiligen Originalseiten mit dem neuen Design. Vor `npm run dev` und `npm run build` kopiert das Vorbereitungsskript die statischen App-Dateien nach `public/stampnow-app` (generiert, nicht eingecheckt).

Die App verwendet weiterhin ihre originalen relativen API-Adressen, Sitzungscookies und CSRF-Header. `STAMPNOW_BACKEND_URL` verbindet die Website über Next.js-Rewrites mit dem Express-Server. Beispiel für lokale Entwicklung: `http://127.0.0.1:4001`. Für Vercel muss dies die HTTPS-Adresse des tatsächlich betriebenen App-Servers sein. Die Einstellung wird beim Website-Build gelesen; nach Änderungen neu bauen/deployen.

Weitergeleitet werden `/api/*`, `/wallet/v1/*`, `/media/logo/*`, `/datenschutz/:slug` und `/health`. Die allgemeinen Seiten `/datenschutz` und `/impressum` stammen aus Next.js. Ohne Backend-Adresse antwortet die API bewusst mit HTTP 503; es gibt keinen simulierten Login und keine Testkonten in der Website.

## Bestehenden Betrieb anschließen

Der Express-Server benötigt eine PostgreSQL-Datenbank und seine vorhandenen Umgebungsvariablen (siehe `services/stampnow/.env.example`). Die reine Vercel-Website ersetzt diesen Server mit seinen Hintergrundaufgaben nicht.

- Bereits vorhandene Datenbank, `APP_SECRET`, `ADMIN_TOKEN` und Wallet-Zugangsdaten beibehalten. Insbesondere würde ein anderes `APP_SECRET` vorhandene Kartenlinks und Sitzungen ungültig machen.
- `PUBLIC_URL` am App-Server auf die öffentliche Website-Adresse setzen, damit Karten- und Wallet-Links dieselbe Domain verwenden.
- Betreiberangaben `PROCESSOR_NAME`, `PROCESSOR_ADDRESS`, `CONTACT_EMAIL` und optional `CONTACT_PHONE` in Website und App-Server identisch hinterlegen. `HOSTING_INFO` enthält den nachgereichten Hosting-Text der Datenschutzerklärung zu Railway, EU (Amsterdam) und Standardvertragsklauseln.
- Die nachgereichten Betreiberangaben (StampNow – Inh. Joel Noah Janik, Dwoberger Dorfschaftsweg 6, 27753 Delmenhorst, joel@janik-invest.de) sind als Website-Standardwerte und in beiden `.env.example`-Dateien hinterlegt. Die ZIP enthält weiterhin keine nutzbare Server- oder Datenbankkonfiguration.

## Lokal prüfen

1. `npm ci` und `npm run app:install` installieren die getrennten Abhängigkeiten.
2. Die vorhandene App-Konfiguration in `services/stampnow/.env` bereitstellen. Für einen lokalen Funktionstest ausschließlich eine Entwicklungsdatenbank verwenden.
3. In `.env.local` die Backend-Adresse auf `http://127.0.0.1:4001` setzen.
4. `npm run app:dev` startet den App-Server ohne Hintergrundjobs oder automatische Migrationen. `npm run dev` startet die Website in einem zweiten Terminal.

Die originalen Start- und Migrationsskripte der App sind weiterhin vorhanden. Die Integration selbst führt keine Migration, keinen Seed und keine Änderung an Bestandsdaten aus.

## Prüfungen

- `npm run test:integration`: Bytevergleich der unveränderten Funktionsdateien, DOM-Anbindungen, Routen, Sicherheitsheader und Zugriffsschutz des Originalservers.
- `npm run app:test`: originale Tests der ZIP. Der vollständige Ablauf braucht `TEST_DATABASE_URL`; der Apple-Pass-Test braucht OpenSSL und unzip.
- **Der originale Datenbanktest löscht das gesamte `public`-Schema von `TEST_DATABASE_URL`. Ausschließlich eine eigens dafür angelegte, wegwerfbare Testdatenbank verwenden.**
- `npm run lint` und `npm run build`: Prüfung der Next.js-Integration.

Der Hash der ZIP und die ursprünglichen Dateihashes sind in `services/stampnow/upstream-manifest.json` dokumentiert. Änderungen an Logikdateien lassen die Integrationsprüfung fehlschlagen.

Geprüfter Stand der Integration: Produktionsbuild erfolgreich, ESLint ohne Fehler (11 bereits vorhandene Warnungen), sechs Integrationsprüfungen erfolgreich und 17 originale Tests erfolgreich. Der Datenbank-Gesamtablauf wurde mangels separater Testdatenbank übersprungen. Seiten, statische Dateien und die nicht konfigurierte API wurden außerdem über HTTP am lokalen Produktionsserver geprüft. Eine visuelle Browserprüfung war in dieser Sitzung nicht verfügbar.

`npm audit` meldet in den unverändert importierten Abhängigkeiten zwei betroffene Pakete: `joi` (hoch) und dessen Verbraucher `passkit-generator` (niedrig). Es wurde kein automatisches, potenziell inkompatibles Downgrade der Wallet-Bibliothek durchgeführt.
