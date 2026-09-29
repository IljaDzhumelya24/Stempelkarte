import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Impressum | StampNow',
  description: 'Impressum der StampNow GmbH.',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111] selection:bg-amber-500 selection:text-black">
      <Navigation />
      
      <main className="pt-40 lg:pt-52 pb-32 px-6 max-w-[800px] mx-auto font-sans">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16">
          Impressum.
        </h1>
        
        <div className="space-y-12 text-lg md:text-xl text-black/60 font-medium leading-relaxed">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] mb-4">Angaben gemäß § 5 TMG</h2>
            <p>
              StampNow GmbH (i.G.)<br />
              Musterstraße 1<br />
              28195 Bremen
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] mb-4">Vertreten durch</h2>
            <p>Max Mustermann</p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] mb-4">Kontakt</h2>
            <p>
              E-Mail: <a href="mailto:hallo@stempelkarte.app" className="text-[#111] hover:text-amber-500 transition-colors">hallo@stempelkarte.app</a><br />
              Website: <a href="https://stempelkarte.app" className="text-[#111] hover:text-amber-500 transition-colors">www.stempelkarte.app</a>
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] mb-4">Registereintrag</h2>
            <p>
              Eintragung im Handelsregister.<br />
              Registergericht: Amtsgericht Bremen<br />
              Registernummer: HRB XXXXXX (wird nachgereicht)
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] mb-4">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              DE000000000
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] mb-4">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitschlichtung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[#111] hover:text-amber-500 transition-colors underline underline-offset-4">https://ec.europa.eu/consumers/odr/</a>.<br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
