import { IndustryLanding, industryMetadata } from '@/components/sections/industry-page';

export const metadata = industryMetadata('Digitale Stempelkarten für Kioske', 'Wallet-Stempelkarten für Kioske, Snacks, Getränke und Stammkunden.');

export default function KioskPage() {
  return <main><IndustryLanding slug="kiosk" /></main>;
}
