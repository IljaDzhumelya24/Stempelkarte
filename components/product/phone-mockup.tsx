import { WalletCard } from './wallet-card';

export function PhoneMockup({ platform = 'Apple Wallet' }: { platform?: string }) {
  return (
    <div className="mx-auto w-full max-w-[330px] rounded-[44px] border border-ink/10 bg-ink p-3 shadow-[0_36px_100px_rgba(17,24,39,0.24)]">
      <div className="overflow-hidden rounded-[34px] bg-[#f7f4ed] p-4">
        <div className="mx-auto mb-4 h-5 w-24 rounded-full bg-ink" />
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">{platform}</p>
        <WalletCard brand="MOIN KIOSK" reward="Noch 3 bis zu deinem Gratis-Getränk." stamps={7} className="min-h-[360px] rounded-[26px] p-6" />
      </div>
    </div>
  );
}
