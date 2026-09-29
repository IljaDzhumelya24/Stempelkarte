import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Datenschutz | StampNow',
  description: 'Datenschutzerklärung der StampNow GmbH.',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111] selection:bg-amber-500 selection:text-black">
      <Navigation />
      
      <main className="pt-40 lg:pt-52 pb-32 px-6 max-w-[800px] mx-auto font-sans">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16">
          Datenschutz.
        </h1>
        
        <div className="space-y-16 text-lg md:text-xl text-black/60 font-medium leading-relaxed">
          <section>
            <h2 className="text-3xl text-[#111] font-bold tracking-tight mb-6">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-xl text-[#111] font-bold tracking-tight mb-4 mt-8">Allgemeine Hinweise</h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
            <h3 className="text-xl text-[#111] font-bold tracking-tight mb-4 mt-8">Datenerfassung auf dieser Website</h3>
            <p className="mb-2"><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
            <p className="mb-4">Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen.</p>
          </section>

          <section>
            <h2 className="text-3xl text-[#111] font-bold tracking-tight mb-6">2. Hosting</h2>
            <p className="mb-4">Wir hosten die Inhalte unserer Website bei folgenden Anbietern:</p>
            <h3 className="text-xl text-[#111] font-bold tracking-tight mb-4 mt-8">Vercel</h3>
            <p className="mb-4">Anbieter ist Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Wenn Sie unsere Website besuchen, erfasst Vercel verschiedene Logfiles inklusive Ihrer IP-Adressen.</p>
          </section>

          <section>
            <h2 className="text-3xl text-[#111] font-bold tracking-tight mb-6">3. Apple Wallet & Google Wallet Integration</h2>
            <p className="mb-4">
              Für die Bereitstellung der digitalen Stempelkarte nutzen wir die Schnittstellen von Apple (Apple Wallet) und Google (Google Wallet).
            </p>
            <p className="mb-4">
              Wenn Sie eine Stempelkarte zu Ihrem Wallet hinzufügen, werden die dafür notwendigen Daten (wie die Pass-ID, Punkte/Stempel-Anzahl, Name des Geschäfts) auf den Servern von Apple bzw. Google verarbeitet. Bitte beachten Sie hierzu die Datenschutzbestimmungen der jeweiligen Anbieter.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-[#111] font-bold tracking-tight mb-6">4. Ihre Rechte</h2>
            <p className="mb-4">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
            </p>
            <p className="mb-4">
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-[#111] font-bold tracking-tight mb-6">5. Kontakt</h2>
            <p className="mb-4">
              Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten sowie Widerruf erteilter Einwilligungen wenden Sie sich bitte an:
            </p>
            <p className="mt-4">
              StampNow GmbH (i.G.)<br />
              Musterstraße 1<br />
              28195 Bremen<br />
              E-Mail: <a href="mailto:hallo@stempelkarte.app" className="text-[#111] hover:text-amber-500 transition-colors">hallo@stempelkarte.app</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
