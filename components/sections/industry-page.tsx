import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { businessTypes } from '@/data/site-config';
import { Reveal } from '@/components/motion/reveal';
import { MagneticButton } from '@/components/motion/magnetic-button';
import { WalletCard } from '@/components/product/wallet-card';

export function industryMetadata(title: string, description: string): Metadata {
  return { title, description, openGraph: { title, description } };
}

export function IndustryLanding({ slug }: { slug: 'kiosk' | 'cafe' | 'barbershop' }) {
  const item = businessTypes.find((type) => type.slug === slug)!;
  const copy = {
    kiosk: {
      title: 'Digitale Stempelkarten für Kioske.',
      text: 'Kaffee, Snacks, Feierabendgetränk: Kioske leben von kurzen Wegen und vertrauten Gesichtern. STAMP macht daraus eine einfache Wallet-Routine.',
      bullets: ['Schnell an der Kasse', 'Perfekt für Laufkundschaft', 'Reward nach wenigen Besuchen'],
      card: 'MOIN KIOSK',
    },
    cafe: {
      title: 'Mehr Wiederkommen für Cafés und Bäckereien.',
      text: 'Die Morgenroutine ist der beste Moment für Kundenbindung. Eine digitale Karte macht den nächsten Kaffee sichtbar.',
      bullets: ['Kein Papier neben der Kasse', 'Kaffee- und Gebäck-Rewards', 'Wallet-Karte in Sekunden gespeichert'],
      card: 'CAFÉ NORD',
    },
    barbershop: {
      title: 'Loyalty für Barbershops und Friseure.',
      text: 'Termine, Pflege, Services und Stammkunden gehören zusammen. STAMP belohnt Wiederkommen, ohne komplizierte Software.',
      bullets: ['Ideal für Termine und Walk-ins', 'Teamzugänge für Mitarbeiter', 'Rewards für Pflege oder Service'],
      card: 'BARBER 281',
    },
  }[slug];

  return (
    <>
      <section className="px-5 pb-20 pt-36 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.8fr]">
          <Reveal>
            <p className="section-kicker">{item.title}</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">{copy.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/62">{copy.text}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <MagneticButton href="/kontakt">Demo anfragen</MagneticButton>
              <MagneticButton href="/preise" variant="secondary">Preise ansehen</MagneticButton>
            </div>
          </Reveal>
          <Reveal>
            <WalletCard brand={copy.card} reward={item.reward} stamps={slug === 'barbershop' ? 5 : 7} accent={item.accent} />
          </Reveal>
        </div>
      </section>
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {copy.bullets.map((bullet) => (
            <Reveal className="rounded-[24px] border border-ink/10 bg-white p-6 shadow-soft" key={bullet}>
              <CheckCircle2 className="mb-8 text-blue-600" />
              <h2 className="text-2xl font-semibold">{bullet}</h2>
              <p className="mt-3 text-ink/62">Einfach genug für den Alltag, hochwertig genug für deine Marke.</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="px-5 pb-24 sm:px-8">
        <Link className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] bg-ink p-8 text-white transition hover:bg-blue-700" href="/kontakt">
          <span className="text-3xl font-semibold">Kostenlose Demo für dein Geschäft</span>
          <ArrowRight />
        </Link>
      </section>
    </>
  );
}
