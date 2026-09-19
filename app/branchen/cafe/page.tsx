import { IndustryLanding, industryMetadata } from '@/components/sections/industry-page';

export const metadata = industryMetadata('Digitale Stempelkarten für Cafés und Bäckereien', 'Wallet-Stempelkarten für Cafes, Bäckereien und morgendliche Stammkunden.');

export default function CafePage() {
  return <main><IndustryLanding slug="cafe" /></main>;
}
