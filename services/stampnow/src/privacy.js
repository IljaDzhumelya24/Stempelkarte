/**
 * Datenschutzhinweise pro Betrieb (Art. 13 DSGVO), automatisch mit den Daten des Betriebs befüllt.
 * WICHTIG: Das ist eine sorgfältig erstellte Vorlage, keine Rechtsberatung.
 * Vor dem Live-Gang einmal von einem Anwalt / Datenschutz-Generator prüfen lassen
 * (siehe docs/ANLEITUNG.md, Schritt 9).
 */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function privacyPage(b) {
  const processor = esc(process.env.PROCESSOR_NAME || 'StampNow (Betreiber siehe Impressum stampnow.de)');
  const processorAddr = esc(process.env.PROCESSOR_ADDRESS || '');
  const hosting = esc(process.env.HOSTING_INFO || 'Railway Corporation (Serverstandort EU)');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Datenschutz – ${esc(b.program_name)} ${esc(b.name)}</title>
<link rel="stylesheet" href="/css/app.css"></head>
<body class="doc"><main class="doc-main">
<h1>Datenschutzhinweise zur digitalen Stempelkarte</h1>
<p class="muted">${esc(b.name)} · Stand: ${new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</p>

<h2>1. Verantwortlicher</h2>
<p>${esc(b.name)}<br>${esc(b.address).replace(/\n/g, '<br>')}<br>
${b.contact_email ? `E-Mail: ${esc(b.contact_email)}<br>` : ''}${b.contact_phone ? `Telefon: ${esc(b.contact_phone)}` : ''}</p>

<h2>2. Welche Daten wir verarbeiten</h2>
<ul>
<li>Name und Handynummer (bei der Anmeldung angegeben)</li>
<li>Stempelstand, Zeitpunkte deiner Besuche (Stempel), eingelöste Belohnungen</li>
<li>Ob du Angebote/Neuigkeiten erhalten möchtest (Einwilligung) und wann du sie erteilt hast</li>
<li>Technische Daten zur Wallet-Karte (Geräte-Kennung und Push-Token deines Wallets, damit sich die Karte aktualisiert)</li>
</ul>

<h2>3. Zwecke und Rechtsgrundlagen</h2>
<ul>
<li><b>Stempelkarte führen</b> (Stempel sammeln, Belohnung einlösen, Karte aktuell halten):
Art. 6 Abs. 1 lit. b DSGVO – Teilnahme am Treueprogramm.</li>
<li><b>Angebote und Erinnerungen</b> auf deine Wallet-Karte (z.&nbsp;B. „doppelte Stempel“, „Belohnung wartet“) –
nur wenn du eingewilligt hast: Art. 6 Abs. 1 lit. a DSGVO. Dafür werten wir deine Besuchsabstände aus,
um passende Zeitpunkte zu wählen. Die Einwilligung kannst du jederzeit widerrufen (siehe Punkt 7).</li>
<li><b>Anonyme Statistik</b> für ${esc(b.name)} (z.&nbsp;B. Besuche pro Woche): Art. 6 Abs. 1 lit. f DSGVO –
berechtigtes Interesse an der Auswertung des Programms. Nach Löschung deiner Karte bleiben nur anonyme Zählwerte.</li>
</ul>

<h2>4. Empfänger</h2>
<ul>
<li><b>${processor}</b>${processorAddr ? `, ${processorAddr}` : ''} betreibt die Software im Auftrag von ${esc(b.name)}
(Auftragsverarbeitung nach Art. 28 DSGVO).</li>
<li>Hosting: ${hosting}.</li>
<li>Wenn <b>du selbst</b> die Karte zu Apple Wallet oder Google Wallet hinzufügst, werden die Kartendaten
(Name, Stempelstand, Neuigkeiten) an Apple bzw. Google übertragen, damit die Karte angezeigt und aktualisiert wird.
Diese Anbieter können Daten auch in den USA verarbeiten; die Übermittlung stützt sich auf das
EU-US Data Privacy Framework bzw. Standardvertragsklauseln.</li>
</ul>

<h2>5. Speicherdauer</h2>
<p>Deine Daten werden gelöscht, wenn du die Karte löschst, spätestens aber automatisch
${b.retention_months} Monate nach deinem letzten Besuch.</p>

<h2>6. Deine Rechte</h2>
<p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie das Recht, dich bei einer
Datenschutz-Aufsichtsbehörde zu beschweren.</p>

<h2>7. Selbst verwalten</h2>
<p>Über den Link <b>„Meine Daten &amp; Einwilligungen“</b> auf der Rückseite deiner Wallet-Karte kannst du jederzeit
deine Daten herunterladen, Angebote ab- oder anbestellen und die Karte vollständig löschen.
Oder wende dich direkt an ${esc(b.name)}.</p>

<h2>8. Keine automatisierte Entscheidung</h2>
<p>Es findet keine automatisierte Entscheidung mit rechtlicher Wirkung statt (Art. 22 DSGVO).
Die Auswertung der Besuchsabstände bestimmt lediglich, wann dir ein Angebot angezeigt wird.</p>
</main></body></html>`;
}
