import { WalletCards } from 'lucide-react';

export function WalletAddButton({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white px-5 py-4 shadow-[0_16px_50px_rgba(17,24,39,0.08)]">
      <div className="grid size-10 place-items-center rounded-full bg-ink text-white">
        <WalletCards size={18} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">Hinzufügen zu</p>
        <p className="font-semibold">{label}</p>
      </div>
    </div>
  );
}
