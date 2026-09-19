import type { Metadata } from 'next';
import { HomePage } from '@/components/sections/home-sections';

export const metadata: Metadata = {
  title: 'Digitale Stempelkarten fuer lokale Geschaefte',
  description: 'Aus Laufkundschaft werden Stammkunden. Digitale Stempelkarten fuer Wallet, Kiosk, Cafe und Barbershop.',
};

export default function Home() {
  return (
    <main>
      <HomePage />
    </main>
  );
}
