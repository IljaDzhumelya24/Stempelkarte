import { Metadata } from 'next';
import ClientFaqPage from './ClientPage';

export const metadata: Metadata = {
  title: 'FAQ | Stempelkarte',
  description: 'Alle Fragen und Antworten zur digitalen Stempelkarte.',
};

export default function FaqPage() {
  return <ClientFaqPage />;
}
