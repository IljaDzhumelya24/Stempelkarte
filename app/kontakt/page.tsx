import type { Metadata } from 'next';
import { ContactForm } from '@/components/sections/contact-form';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'Kontakt und Demo anfragen',
  description: 'Kostenlose Demo für digitale Stempelkarten anfragen.',
};

export default function KontaktPage() {
  return (
    <main>
      <PageHero kicker="Kontakt" title="Zeig uns dein Geschäft. Wir zeigen dir deine Karte." text="Schreib uns kurz, was du anbietest und welche Belohnung passen könnte. Das Formular ist aktuell frontend-only und zeigt einen Demo-Erfolg." />
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-4xl"><ContactForm /></div>
      </section>
    </main>
  );
}
