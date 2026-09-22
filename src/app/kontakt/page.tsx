import { Metadata } from 'next';
import ClientKontaktPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Kontakt | Stempelkarte',
  description: 'Fragen zur digitalen Stempelkarte für dein Geschäft? Sprich mit uns über Einrichtung, Tarife und den Einsatz in deinem Betrieb.',
};

export default function KontaktPage() {
  return <ClientKontaktPage />;
}
