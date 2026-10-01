# Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO) – VORLAGE

> Vorlage, keine Rechtsberatung. Vor der ersten Verwendung einmal prüfen lassen (Anwalt / IHK).
> [eckige Klammern] ausfüllen. Pro Betrieb zwei Exemplare, beide unterschreiben.

**Zwischen**
[Name des Betriebs], [Adresse], vertreten durch [Inhaber/in] – nachfolgend **„Verantwortlicher“**

**und**
[StampNow – Inh. Vorname Nachname], [Adresse] – nachfolgend **„Auftragsverarbeiter“**

## 1. Gegenstand und Dauer
Der Auftragsverarbeiter betreibt für den Verantwortlichen die Software „StampNow“ (digitale Stempelkarte, Kunden-Dashboard,
automatische Kundenbenachrichtigungen). Der Vertrag gilt für die Laufzeit des Hauptvertrags (Nutzungsvertrag vom [Datum]).

## 2. Art und Zweck der Verarbeitung
Speicherung und Verarbeitung von Kundendaten zur Führung eines Treueprogramms (Stempelkarte), zur Anzeige der Karte in
Apple Wallet / Google Wallet und – nur bei Einwilligung der Kunden – zum Versand von Angeboten auf die Wallet-Karte.

## 3. Art der Daten und Kreis der Betroffenen
- Betroffene: Kundinnen und Kunden des Verantwortlichen, die eine Stempelkarte nutzen; Mitarbeitende des Verantwortlichen (Login).
- Daten: Name, Mobilnummer, Besuchs-/Stempelzeitpunkte, Stempelstand, eingelöste Belohnungen, Einwilligungsstatus mit
  Zeitpunkt, technische Wallet-Kennungen (Geräte-ID, Push-Token); bei Mitarbeitenden: Name, E-Mail, Passwort-Hash, Login-Zeitpunkte.

## 4. Pflichten des Auftragsverarbeiters
1. Verarbeitung nur auf dokumentierte Weisung des Verantwortlichen. Die Einstellungen im Dashboard gelten als Weisung.
2. Vertraulichkeit: Personen mit Zugriff sind zur Verschwiegenheit verpflichtet.
3. Technische und organisatorische Maßnahmen nach Anlage 1.
4. Unterstützung bei Betroffenenrechten (Auskunft, Löschung, Widerruf). Kunden können dies zusätzlich selbst über
   „Meine Daten“ auf ihrer Karte erledigen.
5. Meldung von Datenschutzverletzungen an den Verantwortlichen unverzüglich, spätestens binnen 24 Stunden nach Kenntnis.
6. Nach Vertragsende: Löschung aller Daten des Verantwortlichen binnen 30 Tagen, auf Wunsch vorher Export (JSON/CSV).

## 5. Unterauftragsverarbeiter
Der Verantwortliche genehmigt folgende Unterauftragsverarbeiter:

| Anbieter | Zweck | Ort |
|---|---|---|
| Railway Corporation | Hosting von Server und Datenbank | Serverstandort EU; Unternehmen USA (Standardvertragsklauseln / DPA) |
| Apple Inc. | Push-Dienst für Wallet-Karten (nur Push-Token + Kartenkennung) | USA (EU-US Data Privacy Framework) |
| Google LLC / Google Ireland | Google Wallet API (Kartendaten der Kunden, die Google Wallet nutzen) | EU/USA (Data Privacy Framework) |

Über neue Unterauftragsverarbeiter wird der Verantwortliche vorab informiert. Er kann aus wichtigem Grund widersprechen.

## 6. Kontrollrechte
Der Verantwortliche kann sich nach Absprache von der Einhaltung überzeugen (Auskunft, Dokumente, Selbstauskunft).

## 7. Löschfristen
Automatische Löschung von Kundendaten nach [24] Monaten ohne Besuch (im Dashboard einstellbar). Löschung auf Kundenwunsch sofort.

---
Ort, Datum: ____________________

Verantwortlicher: ____________________   Auftragsverarbeiter: ____________________

---

## Anlage 1 – Technische und organisatorische Maßnahmen (TOM)

**Zutritt/Zugang:** Hosting in Rechenzentren des Anbieters (Railway, EU). Kein Betrieb eigener Server.
Admin-Zugänge zu Railway/GitHub mit starkem Passwort und Zwei-Faktor-Authentifizierung.

**Zugriff:** Rollen (Inhaber/Mitarbeiter). Jeder Betrieb sieht ausschließlich eigene Daten (Mandantentrennung in jeder Abfrage).
Mitarbeitende sehen nur maskierte Telefonnummern. Passwörter mit bcrypt gehasht. Sitzungen lassen sich sofort widerrufen (Deaktivieren).
Login-Versuche sind begrenzt.

**Übertragung:** Ausschließlich HTTPS/TLS. QR-Codes kryptografisch signiert (HMAC-SHA256). Kunden-Verwaltungslinks mit geheimem Token.

**Eingabekontrolle:** Jeder Stempel mit Zeitpunkt und Mitarbeiter protokolliert. Protokoll für Löschungen, Exporte,
Korrekturen und Teamänderungen.

**Verfügbarkeit:** Datenbank-Backups durch den Hoster. Healthcheck und automatischer Neustart.

**Trennung:** Test- und Demodaten getrennt von Produktivdaten.

**Datenminimierung:** Nur Name und Mobilnummer als Pflichtangaben. Werbung nur mit gesonderter Einwilligung.
Automatische Löschung nach Inaktivität. Nach Löschung bleiben nur anonyme Zählwerte.
