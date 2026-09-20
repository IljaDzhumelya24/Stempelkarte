import { Metadata } from 'next';
import ClientUeberUnsPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Über uns | Stempelkarte',
  description: 'Wir digitalisieren lokale Geschäfte.',
};

export default function UeberUnsPage() {
  return <ClientUeberUnsPage />;
}
