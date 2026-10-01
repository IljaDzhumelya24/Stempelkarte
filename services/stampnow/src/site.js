/**
 * Öffentliche Website von StampNow: Startseite, Impressum, Datenschutzerklärung.
 * Impressumsdaten kommen aus Umgebungsvariablen (Railway), nie aus dem Code:
 *   PROCESSOR_NAME     z. B. "StampNow – Inh. Max Muster"
 *   PROCESSOR_ADDRESS  Straße, PLZ Ort  (Zeilenumbruch mit \n oder Komma)
 *   CONTACT_EMAIL      Pflicht fürs Impressum
 *   CONTACT_PHONE      optional
 * Vorlage, keine Rechtsberatung – einmal prüfen lassen (docs/ANLEITUNG.md, Schritt 9).
 */
import { Router } from 'express';

export const siteRouter = Router();

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const env = () => ({
  name: process.env.PROCESSOR_NAME || '',
  address: (process.env.PROCESSOR_ADDRESS || '').replace(/\\n/g, '\n'),
  email: process.env.CONTACT_EMAIL || '',
  phone: process.env.CONTACT_PHONE || '',
});
const lines = (s) => esc(s).split(/\n|,\s*/).filter(Boolean).join('<br>');

function shell(title, body) {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<link rel="icon" href="/assets/icon@3x.png">
<link rel="stylesheet" href="/css/app.css"></head>
<body class="site">${body}${footer()}</body></html>`;
}

function footer() {
  return `<footer class="site-foot"><div class="site-wrap row">
  <span>© ${new Date().getFullYear()} StampNow</span><span class="spacer"></span>
  <a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href="/login">Login für Betriebe</a>
</div></footer>`;
}

siteRouter.get('/', (req, res) => {
  const e = env();
  res.type('html').send(shell('StampNow – digitale Stempelkarte', `
<header class="site-hero"><div class="site-wrap">
  <div class="brandmark"><img src="/assets/icon@3x.png" alt="">StampNow</div>
  <h1>Die Stempelkarte, die nicht im Portemonnaie verschwindet.</h1>
  <p class="lead">Digitale Stempelkarten für Friseure, Barber, Kosmetikstudios, Cafés und Imbisse.
  Direkt in Apple Wallet und Google Wallet – ohne App, ohne Papier, ohne verlorene Karten.</p>
  ${e.email ? `<a class="btn gold big-inline" href="mailto:${esc(e.email)}?subject=StampNow%20Demo">Demo anfragen</a>` : ''}
</div></header>
<main class="site-wrap site-main">
  <section class="site-steps">
    <div><span class="step-n">1</span><h3>Kunde scannt das Poster</h3><p>Name und Handynummer eintragen, Karte landet mit einem Tipp im Wallet.</p></div>
    <div><span class="step-n">2</span><h3>Ihr Team stempelt</h3><p>Mitarbeiter scannen die Karte mit Handy oder Tablet. Der Stempel erscheint sofort beim Kunden.</p></div>
    <div><span class="step-n">3</span><h3>Kunden kommen wieder</h3><p>StampNow erkennt, wer überfällig ist, und schickt passende Angebote – nur mit Einwilligung.</p></div>
  </section>
  <section class="site-feat">
    <h2>Was Betriebe bekommen</h2>
    <ul>
      <li><b>Dashboard</b> mit Besuchen pro Woche, Stammkunden, gefährdeten Kunden und Wiederkehrquote.</li>
      <li><b>Automatische Rückhol-Aktionen</b> wie „doppelte Stempel“ – mit Kontrollgruppe, damit Sie sehen, ob es wirkt.</li>
      <li><b>Fälschungssicher:</b> signierte Codes, eigenes Login pro Mitarbeiter, Sperrzeit zwischen Stempeln.</li>
      <li><b>DSGVO-konform:</b> Server in der EU, Kunden verwalten und löschen ihre Daten selbst.</li>
    </ul>
  </section>
  <section class="site-contact">
    <h2>Interesse?</h2>
    <p>Wir richten StampNow in Ihrem Betrieb ein – vor Ort in Delmenhorst, Bremen und Umgebung.</p>
    ${e.email ? `<p><a href="mailto:${esc(e.email)}">${esc(e.email)}</a>${e.phone ? ` · ${esc(e.phone)}` : ''}</p>` : ''}
  </section>
</main>`));
});

siteRouter.get('/impressum', (req, res) => {
  const e = env();
  res.type('html').send(shell('Impressum – StampNow', `
<main class="doc-main">
  <p><a href="/">← StampNow</a></p>
  <h1>Impressum</h1>
  <h2>Angaben gemäß § 5 DDG</h2>
  <p>${esc(e.name) || '<span class="error">PROCESSOR_NAME fehlt</span>'}<br>${lines(e.address) || '<span class="error">PROCESSOR_ADDRESS fehlt</span>'}</p>
  <h2>Kontakt</h2>
  <p>E-Mail: ${e.email ? `<a href="mailto:${esc(e.email)}">${esc(e.email)}</a>` : '<span class="error">CONTACT_EMAIL fehlt</span>'}
  ${e.phone ? `<br>Telefon: ${esc(e.phone)}` : ''}</p>
  <h2>Umsatzsteuer</h2>
  <p>Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).</p>
  <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
  <p>${esc(e.name)}<br>${lines(e.address)}</p>
  <h2>Verbraucherstreitbeilegung</h2>
  <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
</main>`));
});

siteRouter.get('/datenschutz', (req, res) => {
  const e = env();
  res.type('html').send(shell('Datenschutz – StampNow', `
<main class="doc-main">
  <p><a href="/">← StampNow</a></p>
  <h1>Datenschutzerklärung</h1>
  <p class="muted">Diese Erklärung gilt für diese Website und das Login für Betriebe.
  Endkunden einer Stempelkarte finden die Hinweise des jeweiligen Betriebs unter dem Link auf ihrer Karte.</p>

  <h2>1. Verantwortlicher</h2>
  <p>${esc(e.name)}<br>${lines(e.address)}<br>E-Mail: ${esc(e.email)}</p>

  <h2>2. Aufruf der Website</h2>
  <p>Beim Aufruf verarbeitet unser Hoster technisch notwendige Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browser),
  um die Seite auszuliefern und vor Angriffen zu schützen (Art. 6 Abs. 1 lit. f DSGVO). Diese Server-Logs werden
  nach kurzer Zeit automatisch gelöscht. Wir setzen keine Tracking- oder Werbe-Cookies und keine Analyse-Tools ein.</p>

  <h2>3. Login für Betriebe</h2>
  <p>Für eingeloggte Inhaber und Mitarbeitende speichern wir E-Mail, Name, einen verschlüsselten Passwort-Hash und den
  Zeitpunkt des letzten Logins (Art. 6 Abs. 1 lit. b DSGVO – Vertrag). Das Login verwendet ein technisch notwendiges
  Sitzungs-Cookie, das nach spätestens 14 Tagen abläuft.</p>

  <h2>4. Kontakt per E-Mail</h2>
  <p>Wenn Sie uns schreiben, verwenden wir Ihre Angaben nur zur Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO)
  und löschen sie, wenn sie nicht mehr benötigt werden und keine Aufbewahrungspflichten bestehen.</p>

  <h2>5. Stempelkarten-Daten</h2>
  <p>Daten von Endkunden (Name, Handynummer, Besuche) verarbeiten wir ausschließlich im Auftrag des jeweiligen Betriebs
  (Art. 28 DSGVO). Verantwortlich ist der Betrieb; seine Hinweise sind auf jeder Karte verlinkt.</p>

  <h2>6. Hosting</h2>
  <p>Hosting: Railway Corporation, Serverstandort EU (Amsterdam). Railway ist ein US-Unternehmen; die Übermittlung ist
  über Standardvertragsklauseln abgesichert. Schriftarten werden von unserem eigenen Server geladen, nicht von Google.</p>

  <h2>7. Ihre Rechte</h2>
  <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch
  (Art. 15–21 DSGVO) sowie auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde, z. B. der Landesbeauftragten für den
  Datenschutz Niedersachsen.</p>
</main>`));
});
