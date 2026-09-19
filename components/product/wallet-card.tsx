import type { WalletCardProps } from '@/lib/types';
import { QRCodeCard } from './qr-code-card';
import { StampProgress } from './stamp-progress';

export function WalletCard({ brand, reward, stamps, total = 10, accent = '#2458ff', className = '' }: WalletCardProps) {
  return (
    <article
      className={`relative min-h-[420px] overflow-hidden rounded-[32px] p-7 text-white shadow-[0_28px_90px_rgba(17,24,39,0.24)] ${className}`}
      style={{ background: `radial-gradient(circle at 20% 0%, rgba(255,255,255,.38), transparent 28%), linear-gradient(145deg, ${accent}, #101827 76%)` }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/50" />
      <div className="flex items-center justify-between">
        <div className="grid size-11 place-items-center rounded-full bg-white/16 text-sm font-black backdrop-blur">S</div>
        <span className="rounded-full border border-white/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/80">Live Wallet</span>
      </div>
      <div className="mt-14">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/62">Digitale Stempelkarte</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight">{brand}</h3>
      </div>
      <div className="mt-9">
        <div className="mb-4 flex items-end justify-between">
          <span className="text-5xl font-semibold tracking-tight">{stamps}</span>
          <span className="pb-2 text-white/70">/ {total} Stempel</span>
        </div>
        <StampProgress stamps={stamps} total={total} />
      </div>
      <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-5">
        <p className="max-w-[14rem] text-sm leading-6 text-white/82">{reward}</p>
        <QRCodeCard dark />
      </div>
    </article>
  );
}
