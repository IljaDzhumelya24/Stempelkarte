import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { ProductFlow } from '@/components/sections/product-flow';
import { MerchantDashboard } from '@/components/product/merchant-dashboard';
import { WalletCard } from '@/components/product/wallet-card';

export const metadata: Metadata = {
  title: 'Produkt und Funktionsweise',
  description: 'So funktionieren digitale Stempelkarten mit QR-Code, Apple Wallet, Google Wallet und Händleransicht.',
};

export default function ProduktPage() {
  return (
    <main>
      <PageHero
        kicker="Produkt"
        title="Eine Stempelkarte, die sich wie Bezahlen anfühlt."
        text="Scannen, speichern, wiederkommen. STAMP bringt Kundenbindung in die Wallets deiner Kunden und in den Alltag deines Teams."
      >
        <WalletCard brand="MOIN KIOSK" reward="Noch 3 bis zu deinem Gratis-Getränk." stamps={7} />
      </PageHero>
      <ProductFlow />
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <MerchantDashboard />
        </div>
      </section>
    </main>
  );
}
