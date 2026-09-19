import { BadgeCheck, QrCode, ScanLine, Smartphone, WalletCards } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { PhoneMockup } from '@/components/product/phone-mockup';
import { QRCodeCard } from '@/components/product/qr-code-card';

const flow = [
  { title: 'QR-Code im Geschäft', text: 'Ein Aufsteller an der Kasse genügt.', Icon: QrCode },
  { title: 'Wallet-Karte speichern', text: 'Ohne Download, ohne Passwort.', Icon: WalletCards },
  { title: 'Persönliche Karte scannen', text: 'Der Kunde zeigt die Karte beim Einkauf.', Icon: Smartphone },
  { title: 'Stempel bestätigen', text: 'Mitarbeiter vergeben den Stempel in Sekunden.', Icon: ScanLine },
  { title: 'Reward freischalten', text: 'Die Belohnung wird sichtbar und einlösbar.', Icon: BadgeCheck },
];

export function ProductFlow() {
  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.95fr_1.05fr]">
        <div className="grid gap-4">
          {flow.map(({ title, text, Icon }, index) => (
            <Reveal className="flex gap-5 rounded-[24px] border border-ink/10 bg-white p-5 shadow-soft" key={title}>
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700"><Icon size={20} /></div>
              <div>
                <p className="font-mono text-xs text-ink/42">0{index + 1}</p>
                <h3 className="mt-1 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/62">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="relative">
          <div className="absolute -left-6 top-14 hidden rounded-3xl border border-ink/10 bg-white p-5 shadow-soft sm:block">
            <QRCodeCard />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Scan am Tresen</p>
          </div>
          <PhoneMockup />
        </Reveal>
      </div>
    </section>
  );
}
