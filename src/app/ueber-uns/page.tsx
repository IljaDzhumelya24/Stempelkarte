import { Metadata } from 'next';
import ClientUeberUnsPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Über uns | Stempelkarte',
  description: 'Wir entwickeln digitale Stempelkarten für lokale Geschäfte – damit Geschäftsinhaber und ihre Teams Stammkunden gezielt belohnen können.',
};

export default function UeberUnsPage() {
  return <ClientUeberUnsPage />;
}
