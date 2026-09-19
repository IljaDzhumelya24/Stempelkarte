import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { siteConfig } from '@/data/site-config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://stamp-demo.de'),
  title: {
    default: `${siteConfig.siteName} - Digitale Stempelkarten fuer lokale Geschaefte`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description:
    'Digitale Stempelkarten direkt in Apple Wallet und Google Wallet. Fuer Cafes, Kioske, Barbershops und lokale Geschaefte.',
  openGraph: {
    title: `${siteConfig.siteName} - Digitale Stempelkarten`,
    description: siteConfig.tagline,
    type: 'website',
    locale: 'de_DE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
