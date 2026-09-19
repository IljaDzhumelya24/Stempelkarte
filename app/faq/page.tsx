import type { Metadata } from 'next';
import { FAQList } from '@/components/sections/faq-list';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Antworten zu App, Wallet, Stempeln, Rewards, Einrichtung und mehreren Filialen.',
};

export default function FAQPage() {
  return (
    <main>
      <PageHero kicker="FAQ" title="Kurz gefragt. Klar beantwortet." text="Die wichtigsten Fragen, die lokale Händler stellen, bevor sie ihre Papierkarte ersetzen." />
      <FAQList />
    </main>
  );
}
