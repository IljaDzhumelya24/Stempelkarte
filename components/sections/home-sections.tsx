'use client';

import { ArrowRight, BadgeCheck, Coffee, QrCode, ScanLine, Sparkles, Store, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { businessTypes, features } from '@/data/site-config';
import { AnimatedText, Reveal, Stagger } from '@/components/motion/reveal';
import { MagneticButton } from '@/components/motion/magnetic-button';
import { Marquee } from '@/components/motion/marquee';
import { MerchantDashboard } from '@/components/product/merchant-dashboard';
import { PhoneMockup } from '@/components/product/phone-mockup';
import { WalletAddButton } from '@/components/product/wallet-add-button';
import { WalletCard } from '@/components/product/wallet-card';

const steps = [
  { number: '01', title: 'QR-Code scannen', text: 'Der Kunde scannt den Code direkt an der Theke.', Icon: QrCode },
  { number: '02', title: 'Karte speichern', text: 'Die Stempelkarte landet in Apple Wallet oder Google Wallet.', Icon: WalletCards },
  { number: '03', title: 'Stempel sammeln', text: 'Jeder Einkauf wird in Sekunden bestätigt.', Icon: ScanLine },
  { number: '04', title: 'Belohnung erhalten', text: 'Nach dem Ziel wird der Reward automatisch freigeschaltet.', Icon: BadgeCheck },
];

export function HomePage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.25], [0, -70]);

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-8 lg:min-h-screen lg:pt-44">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_14%,rgba(36,88,255,.18),transparent_26%),linear-gradient(180deg,#fbf8f1,#f7f4ed)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.22] [background-image:linear-gradient(rgba(17,24,39,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,.08)_1px,transparent_1px)] [background-size:46px_46px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Die Stempelkarte, die niemand mehr verliert.</p>
            <h1 className="max-w-5xl text-[clamp(3.7rem,9vw,7.4rem)] font-semibold leading-[0.88] tracking-tight">
              <AnimatedText text="Aus Laufkundschaft werden Stammkunden." />
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-ink/66 sm:text-xl">
              Digitale Stempelkarten direkt in Apple Wallet und Google Wallet. Für Cafés, Kioske, Barbershops und alle, die ihre Kunden wiedersehen wollen.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <MagneticButton href="/kontakt">Kostenlose Demo</MagneticButton>
              <MagneticButton href="/produkt" variant="secondary">So funktioniert&apos;s</MagneticButton>
            </div>
          </div>
          <motion.div className="relative mx-auto w-full max-w-[560px]" style={{ y }}>
            <motion.div initial={{ opacity: 0, rotate: -8, y: 40 }} animate={{ opacity: 1, rotate: -6, y: 0 }} transition={{ duration: 0.8 }} className="absolute -left-2 top-10 hidden w-[70%] sm:block">
              <WalletCard brand="CAFÉ NORD" reward="Noch 2 Stempel bis zum Kaffee aufs Haus." stamps={8} accent="#8b5cf6" />
            </motion.div>
            <motion.div initial={{ opacity: 0, rotate: 7, y: 60 }} animate={{ opacity: 1, rotate: 3, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }} className="relative ml-auto w-[88%]">
              <WalletCard brand="MOIN KIOSK" reward="Noch 3 bis zu deinem Gratis-Getränk." stamps={7} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Marquee items={['Kiosk', 'Café', 'Barbershop', 'Bäckerei', 'Restaurant', 'Friseur', 'Einzelhandel']} />

      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.72fr_1fr]">
          <div className="top-28 self-start lg:sticky">
            <Reveal>
              <p className="section-kicker">So funktioniert es</p>
              <h2 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Scannen. Speichern. Wiederkommen.</h2>
            </Reveal>
          </div>
          <div className="grid gap-5">
            {steps.map(({ number, title, text, Icon }) => (
              <Reveal className="grid gap-6 rounded-[28px] border border-ink/10 bg-white p-6 shadow-soft md:grid-cols-[160px_1fr] md:p-8" key={number}>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-blue-600">{number}</span>
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{title}</h3>
                  <p className="mt-2 text-ink/62">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <p className="section-kicker">Wallet first</p>
            <h2 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">Keine App. Einfach Wallet.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/62">Deine Kunden müssen keine neue App installieren und kein Passwort vergessen. Die Karte landet dort, wo sie sowieso schon Tickets und Karten aufbewahren.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <WalletAddButton label="Apple Wallet" />
              <WalletAddButton label="Google Wallet" />
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            <PhoneMockup platform="Apple Wallet" />
            <div className="mt-12"><PhoneMockup platform="Google Wallet" /></div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10 max-w-3xl">
            <p className="section-kicker">Händleransicht</p>
            <h2 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Ein Stempel dauert Sekunden.</h2>
          </Reveal>
          <MerchantDashboard />
        </div>
      </section>

      <section className="bg-ink px-5 py-24 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-200">Individuelles Design</p>
            <h2 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">Deine Marke. Deine Karte.</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['MOIN KIOSK', '#2458ff', 7],
              ['CAFÉ NORD', '#8b5cf6', 8],
              ['BARBER 281', '#111827', 5],
              ['BÄCKEREI WEST', '#0e9f6e', 9],
            ].map(([brand, accent, stamps]) => (
              <motion.div whileHover={{ y: -8, rotateX: 3, rotateY: -3 }} key={brand as string}>
                <WalletCard brand={brand as string} accent={accent as string} stamps={stamps as number} reward="Belohnung fast erreicht." className="min-h-[360px]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">Branchen</p>
              <h2 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Gebaut für lokale Routinen.</h2>
            </div>
            <Link className="inline-flex items-center gap-2 font-semibold text-blue-700" href="/branchen">Alle Branchen <ArrowRight size={18} /></Link>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {businessTypes.slice(0, 6).map((type) => (
              <Link className="group min-h-64 rounded-[28px] border border-ink/10 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-blue-400/50" href={`/branchen/${type.slug}`} key={type.slug}>
                <Store className="text-blue-600" />
                <h3 className="mt-10 text-2xl font-semibold">{type.title}</h3>
                <p className="mt-3 text-ink/62">{type.description}</p>
                <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">Mehr erfahren <ArrowRight size={16} /></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-10 max-w-3xl">
            <p className="section-kicker">Vorteile</p>
            <h2 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Nicht mehr Papier verwalten. Beziehung aufbauen.</h2>
          </Reveal>
          <Stagger className="grid gap-4 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Reveal className={`rounded-[28px] border border-ink/10 bg-white p-6 shadow-soft ${index === 0 || index === 6 ? 'lg:col-span-2 lg:min-h-64' : ''}`} key={feature.title}>
                <Sparkles className="mb-8 text-blue-600" size={22} />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/62">{feature.text}</p>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,.35),transparent_24%),linear-gradient(135deg,#2458ff,#7c3aed_55%,#101827)] px-6 py-16 text-white sm:px-12 lg:py-24">
          <div className="max-w-3xl">
            <Coffee className="mb-8" />
            <h2 className="text-5xl font-semibold tracking-tight sm:text-7xl">Bereit für deine letzte Papier-Stempelkarte?</h2>
            <p className="mt-6 text-lg leading-8 text-white/72">Starte mit einer Demo, die sich wie dein echtes Geschäft anfühlt.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <MagneticButton href="/demo" variant="dark">Demo starten</MagneticButton>
              <MagneticButton href="/kontakt" variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/16">Gespräch vereinbaren</MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
