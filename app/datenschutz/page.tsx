import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Platzhalter für die Datenschutzerklärung von STAMP.',
};

export default function DatenschutzPage() {
  return (
    <main>
      <PageHero kicker="Rechtliches" title="Datenschutzerklärung." text="Platzhalterseite. Vor Veröffentlichung muss dieser Text rechtlich geprüft und durch eine vollständige Datenschutzerklärung ersetzt werden." />
    </main>
  );
}
