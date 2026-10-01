import type { Metadata } from "next";
import { connection } from "next/server";
import LegalLayout from "@/components/LegalLayout";
import CompanyAddress from "@/components/CompanyAddress";
import { getCompanyDetails } from "@/lib/company";

export const metadata: Metadata = {
  title: "Datenschutz | StampNow",
  description: "Datenschutzhinweise zur Website, zum Betriebs-Login und zur Verarbeitung von Stempelkarten-Daten.",
};

export default async function DatenschutzPage() {
  await connection();
  const company = getCompanyDetails();
  return (
    <LegalLayout title="Datenschutzerklärung." complete={company.complete}>
      <p>Diese Erklärung gilt für diese Website und das Login für Betriebe. Endkunden einer Stempelkarte finden die Hinweise des jeweiligen Betriebs unter dem Link auf ihrer Karte.</p>
      <section>
        <h2>1. Verantwortlicher</h2>
        <CompanyAddress showContact />
      </section>
      <section>
        <h2>2. Aufruf der Website</h2>
        <p>Beim Aufruf verarbeitet unser Hoster technisch notwendige Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browser), um die Seite auszuliefern und vor Angriffen zu schützen (Art. 6 Abs. 1 lit. f DSGVO). Diese Server-Logs werden nach kurzer Zeit automatisch gelöscht. Wir setzen keine Tracking- oder Werbe-Cookies und keine Analyse-Tools ein.</p>
      </section>
      <section>
        <h2>3. Login für Betriebe</h2>
        <p>Für eingeloggte Inhaber und Mitarbeitende speichern wir E-Mail, Name, einen verschlüsselten Passwort-Hash und den Zeitpunkt des letzten Logins (Art. 6 Abs. 1 lit. b DSGVO – Vertrag). Das Login verwendet ein technisch notwendiges Sitzungs-Cookie, das nach spätestens 14 Tagen abläuft.</p>
      </section>
      <section>
        <h2>4. Kontakt per E-Mail</h2>
        <p>Wenn Sie uns schreiben, verwenden wir Ihre Angaben nur zur Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO) und löschen sie, wenn sie nicht mehr benötigt werden und keine Aufbewahrungspflichten bestehen.</p>
      </section>
      <section>
        <h2>5. Stempelkarten-Daten</h2>
        <p>Daten von Endkunden (Name, Handynummer, Besuche) verarbeiten wir ausschließlich im Auftrag des jeweiligen Betriebs (Art. 28 DSGVO). Verantwortlich ist der Betrieb; seine Hinweise sind auf jeder Karte verlinkt.</p>
      </section>
      <section>
        <h2>6. Hosting</h2>
        <p>Hosting: {company.appHosting} Schriftarten werden von unserem eigenen Server geladen, nicht von Google.</p>
      </section>
      <section>
        <h2>7. Ihre Rechte</h2>
        <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) sowie auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde, z. B. der Landesbeauftragten für den Datenschutz Niedersachsen.</p>
      </section>
    </LegalLayout>
  );
}
