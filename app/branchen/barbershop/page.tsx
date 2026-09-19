import { IndustryLanding, industryMetadata } from '@/components/sections/industry-page';

export const metadata = industryMetadata('Digitale Stempelkarten für Barbershops und Friseure', 'Wallet-Stempelkarten für Barbershops, Friseure und lokale Services.');

export default function BarbershopPage() {
  return <main><IndustryLanding slug="barbershop" /></main>;
}
