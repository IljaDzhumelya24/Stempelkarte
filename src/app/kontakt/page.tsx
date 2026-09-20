import { Metadata } from 'next';
import ClientKontaktPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Kontakt | Stempelkarte',
  description: 'Nimm Kontakt mit uns auf. Wir helfen dir gerne weiter.',
};

export default function KontaktPage() {
  return <ClientKontaktPage />;
}
