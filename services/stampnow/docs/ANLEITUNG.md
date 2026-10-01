# StampNow: Was du selbst erledigen musst (Schritt für Schritt)

Die folgenden Schritte kann ich nicht für dich übernehmen: Sie brauchen deine Accounts, dein Geld oder deine Unterschrift.
Die Reihenfolge ist wichtig. Plane für 1–7 etwa 2 Stunden ein. Schritt 8 (Google-Freigabe) dauert ein paar Tage Wartezeit,
also **starte ihn heute**.

---

## 1. Altes Admin-Token entwerten (5 Min.)

Das alte Token stand im Klartext in `stampnow.py`. Ich habe es dort entfernt, aber es existiert noch in Railway.

1. Railway öffnen → altes Projekt → Service **stampnow** → **Variables**.
2. `ADMIN_TOKEN` auf einen neuen Wert setzen. Den Wert erzeugst du so (PowerShell, Node ist bei dir installiert):
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Speichern. Railway startet den Dienst neu, und das alte Token ist wertlos.

Prüfe außerdem auf GitHub, ob das Repo `stampnow/stampnow` auf **Private** steht
(Repo → Settings → ganz unten „Danger Zone“ → „Change visibility“).

## 2. Neues Repo für die App (10 Min.)

```powershell
cd C:\Users\2Craft\Documents\StampNow\stampit-app
git init
git add .
git status          # PRÜFEN: keine .pem, .p12, service-account.json, .env in der Liste!
git commit -m "StampNow App v0.2"
```
Auf GitHub ein neues **privates** Repo `stampit-app` anlegen, dann:
```powershell
git remote add origin https://github.com/stampnow/stampit-app.git
git branch -M main
git push -u origin main
```

## 3. Railway einrichten, Server in der EU (15 Min.)

1. Railway → **New Project** → **Deploy from GitHub repo** → `stampit-app`.
2. Im Projekt: **+ New** → **Database** → **PostgreSQL**.
3. **Region auf EU stellen**, sowohl beim App-Service als auch bei Postgres:
   Service → **Settings** → **Region** → *EU West (Amsterdam)*.
   Das ist für die DSGVO wichtig. Eine alte Postgres, die in den USA läuft, nicht weiterverwenden,
   dort sind ohnehin nur Testdaten.
4. App-Service → **Variables** → **Add Reference** → `DATABASE_URL` von der Postgres übernehmen.
5. Railway hat einen Auftragsverarbeitungsvertrag (DPA). Den abschließen bzw. akzeptieren
   (Railway-Website → Legal → DPA). Das ist Pflicht, weil Kundendaten dort liegen.
6. Backups: In der Postgres unter **Backups** prüfen, ob automatische Backups aktiv sind (je nach Tarif).

## 4. Umgebungsvariablen setzen (20 Min.)

App-Service → **Variables** → **Raw Editor**. Werte eintragen:

| Variable | Wert |
|---|---|
| `NODE_ENV` | `production` |
| `PUBLIC_URL` | `https://app.stampnow.de` |
| `APP_SECRET` | neuer Zufallswert (Befehl aus Schritt 1). **Nie wieder ändern**, sonst werden alle Kunden-QR-Codes ungültig. Zusätzlich im Passwortmanager sichern. |
| `ADMIN_TOKEN` | noch ein neuer Zufallswert (nicht derselbe!) |
| `APPLE_TEAM_ID` | `AQL23BUY65` |
| `APPLE_PASS_TYPE_ID` | `pass.com.janik.stampit` |
| `APPLE_SIGNER_CERT_PEM` | kompletter Inhalt von `certs\signerCert.pem` |
| `APPLE_SIGNER_KEY_PEM` | kompletter Inhalt von `certs\signerKey.pem` |
| `APPLE_WWDR_PEM` | kompletter Inhalt von `certs\wwdr.pem` |
| `GOOGLE_ISSUER_ID` | `3388000000023172086` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | kompletter Inhalt von `service-account.json` |
| `PROCESSOR_NAME` | dein Name + Gewerbename, z. B. „StampNow – Inh. [dein Name]“ |
| `PROCESSOR_ADDRESS` | deine Geschäftsadresse |

Inhalte bequem in die Zwischenablage kopieren (PowerShell):
```powershell
Get-Content C:\Users\2Craft\Documents\StampNow\certs\signerCert.pem -Raw | Set-Clipboard
```
Zeilenumbrüche sind egal, der Server repariert sie. Nach dem Speichern baut Railway neu.
Im **Deploy-Log** muss stehen: `Apple Wallet: aktiv` und `Google Wallet: aktiv`.

## 5. Domain verbinden (10 Min. + Wartezeit)

1. Railway → App-Service → **Settings** → **Networking** → **Custom Domain** → `app.stampnow.de`.
2. Railway zeigt einen CNAME-Wert. Bei united-domains: Domain `stampnow.de` → **DNS** → neuer Eintrag
   Typ **CNAME**, Name `app`, Ziel = der Wert von Railway.
3. Warten, bis Railway „Active“ und ein grünes Zertifikat zeigt (5 Min. bis einige Stunden).
4. Test: `https://app.stampnow.de/health` zeigt `{"ok":true}`.

> Apple-Live-Updates funktionieren **nur über HTTPS**. Solange die Domain nicht aktiv ist, zeigen iPhone-Karten keine neuen Stempel.

## 6. Ersten Betrieb anlegen (5 Min.)

Für den Vertrieb am besten zuerst deinen **Demo-Betrieb** (PowerShell):
```powershell
$h = @{ Authorization = "Bearer DEIN_ADMIN_TOKEN"; "X-StampIt" = "1" }
$body = @{ name = "Salon Bella"; slug = "salon-bella"; ownerEmail = "inhaberin@example.de"; ownerName = "Bella" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri https://app.stampnow.de/api/admin/businesses -Headers $h -ContentType "application/json" -Body $body
```
Die Antwort enthält das **Einmal-Passwort** des Inhabers und den Kunden-Link. Die Inhaberin ändert das Passwort nach
dem ersten Login unter **Team → Mein Passwort**.

Demo-Daten für Verkaufsgespräche (80 Beispielkunden, volle Charts) gibt es mit der Railway-CLI:
`railway run node scripts/seed-demo.js --force` → Login `demo@stampnow.de` / `demo-passwort-123`.
**Danach sofort das Demo-Passwort im Dashboard ändern.**

## 7. Echter Gerätetest vor dem ersten Kunden (30 Min.)

Mit einem iPhone **und** einem Android-Handy (Google-Konto muss Testkonto sein, siehe 8):

- [ ] Poster-QR scannen → eintragen → Karte ins Wallet
- [ ] Mit zweitem Handy/Tablet unter `/scan` als Mitarbeiter einloggen → Karte scannen → Stempel erscheint **ohne Zutun** im Wallet (iPhone: bis ~1 Min.)
- [ ] Zweiter Scan → „Schon gestempelt“
- [ ] Dashboard → Kunde → „Nachricht auf die Karte“ → Mitteilung erscheint auf dem Sperrbildschirm
- [ ] Karte voll stempeln (im Dashboard Stempel auf 9 setzen) → scannen → Belohnung einlösen
- [ ] Standort eintragen, mit dem iPhone hingehen → Karte erscheint auf dem Sperrbildschirm (nicht garantiert, iOS entscheidet)
- [ ] „Meine Daten“ → Karte löschen → Karte verschwindet aus dem Dashboard

Alte Testkarten (aus dem Python-Terminal) vom iPhone löschen. Sie zeigen auf den alten Server.

## 8. Google Wallet freischalten (heute starten, dauert Tage)

Solange dein Issuer im **Demo-Modus** ist, können nur eingetragene Testkonten Karten speichern.

1. <https://pay.google.com/business/console> → dein Issuer.
2. **Google Wallet API** → **Test-Konten**: deine Gmail + die deines Testhandys eintragen (für Schritt 7).
3. **Publishing access anfordern** („Request publishing access“). Google will Firmendaten (dein Gewerbe),
   eine Beschreibung und Screenshots einer Karte. Die Screenshots machst du nach Schritt 7.
4. Bis zur Freigabe: Android-Kunden nutzen die Webseiten-Karte mit QR-Code (funktioniert ohne Google).

## 9. Rechtliches vor dem ersten zahlenden Salon

Ich bin kein Anwalt. Die Vorlagen sind sorgfältig erstellt, ersetzen aber keine Prüfung.

1. **Impressum** auf stampnow.de (Pflicht, du bist gewerblich tätig).
2. **Datenschutzhinweise** (werden je Betrieb automatisch unter `/datenschutz/<kürzel>` erzeugt) einmal prüfen lassen:
   Anwalt, IHK-Beratung (für Mitglieder oft kostenlos) oder ein Generator wie eRecht24.
3. **AV-Vertrag** mit jedem Salon unterschreiben lassen → Vorlage `docs/dsgvo/AVV-Vorlage.md`.
4. **Verarbeitungsverzeichnis** für dich ausfüllen → `docs/dsgvo/Verarbeitungsverzeichnis.md`.
5. Dem Salon sagen: Die Werbe-Einwilligung am Tresen **ausdrücklich fragen**, nicht einfach abhaken.

## 10. Alte Dateien aufräumen

- Den alten Railway-Service `stampnow` löschen, sobald die neue App läuft.
- `stampnow.py` und die `.mjs`-Scripts sind Altbestand und werden nicht mehr gebraucht.
- `certs\` und `service-account.json` **nicht löschen**, aber nur lokal und im Passwortmanager aufbewahren.
  Sie gehören nie in Git.

---

## Bekannte Grenzen dieses Stands

- **Telefonnummern werden nicht per SMS bestätigt.** Wer eine fremde Nummer einträgt, bekommt trotzdem keine fremde Karte
  (doppelte Nummer = Hinweis ans Team), aber Tippfehler sind möglich. SMS-Bestätigung wäre der nächste Schritt (kostet pro SMS).
- **Screenshots echter Karten** funktionieren weiterhin. Das begrenzt nur die Sperrzeit.
- **Google-Standorte:** Google nutzt Standorte kaum noch für Benachrichtigungen. Standort-Hinweise sind praktisch ein iPhone-Feature.
- **Apple-Karten** lassen sich nicht aus der Ferne vom iPhone löschen. Nach einer Löschung zeigt die Karte keine Updates mehr.
- **Nur eine Server-Instanz** betreiben (steht so in `railway.json`), sonst doppelte Hintergrundjobs.
  Ein Datenbank-Lock verhindert Doppelversand zwar, aber skaliere erst, wenn nötig.
- **Abrechnung** (Monatsabo für Salons) ist nicht gebaut. Für die ersten Kunden reicht eine Rechnung/Lastschrift von Hand.
- Das **Dashboard ist ein Prototyp**: funktional und getestet, aber mit dem ersten echten Inhaber zusammen weiterentwickeln.
