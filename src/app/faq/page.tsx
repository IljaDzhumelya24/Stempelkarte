import { Metadata } from 'next';
import ClientFaqPage from './ClientPage';

export const metadata: Metadata = {
  title: 'FAQ | Stempelkarte',
  description: 'Antworten für Geschäftsinhaber: Einrichtung, Stempelvergabe, Belohnungen und Verwaltung deiner digitalen Stempelkarte.',
};

export default function FaqPage() {
  return <ClientFaqPage />;
}
