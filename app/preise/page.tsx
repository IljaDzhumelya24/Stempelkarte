import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { PricingTable } from '@/components/sections/pricing';

export const metadata: Metadata = {
  title: 'Preise',
  description: 'Demo-Preise für digitale Stempelkarten: Starter, Business und Pro.',
};

export default function PreisePage() {
  return (
    <main>
      <PageHero kicker="Preise" title="Klar kalkulierbar. Ohne großes Systemprojekt." text="Drei einfache Tarife als Platzhalter für die Demo. Business ist für die meisten lokalen Geschäfte der passende Start." />
      <PricingTable />
    </main>
  );
}
