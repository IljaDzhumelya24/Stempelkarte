"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Gift, Palette, RotateCcw, ScanLine } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WalletCard from "@/components/WalletCard";
import DemoRequestForm from "@/components/demo/DemoRequestForm";
import { pricingPlan } from "@/lib/data";

const examples: Record<string, { name: string; reward: string }> = {
  cafe: { name: "CAFÉ NORD", reward: "Gratis-Kaffee" },
  kiosk: { name: "DEIN KIOSK", reward: "Gratis-Getränk" },
  salon: { name: "DEIN SALON", reward: "Gratis-Pflegeprodukt" },
  restaurant: { name: "DEIN RESTAURANT", reward: "Gratis-Dessert" },
  other: { name: "DEIN GESCHÄFT", reward: "Treuegeschenk" },
};

const demoSteps = [
  {
    icon: Palette,
    title: "Deine Marke auf der Karte.",
    text: "Wir zeigen dir, wie Logo, Farben und Prämie zu deinem Geschäft passen.",
  },
  {
    icon: ScanLine,
    title: "Einmal selbst stempeln.",
    text: "Erlebe den Ablauf an der Kasse – vom ersten Scan bis zur eingelösten Belohnung.",
  },
  {
    icon: Gift,
    title: "Mit einem guten Plan starten.",
    text: "Wir besprechen deine Fragen und die Einrichtung für deinen Geschäftsalltag.",
  },
];

export default function DemoPage() {
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("cafe");
  const [stamps, setStamps] = useState(7);
  const example = examples[industry] ?? examples.other;
  const complete = stamps === 10;

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fcfcfc] text-[#111] selection:bg-amber-400 selection:text-zinc-950">
      <Navigation />

      <section className="relative px-5 pb-20 pt-32 sm:px-8 sm:pt-40 lg:pb-28 lg:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[700px] overflow-hidden">
          <div className="absolute -right-48 -top-64 size-[640px] rounded-full bg-amber-100/50 blur-[110px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-y-10 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-x-14 lg:gap-y-12 xl:gap-x-20">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-black/5 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] shadow-sm sm:text-xs">
              <span className="size-2 rounded-full bg-amber-500" aria-hidden="true" />
              StampNow kennenlernen
            </p>
            <h1 className="text-[clamp(2.75rem,6.5vw,5.75rem)] font-extrabold leading-[0.97] tracking-[-0.065em]">
              Dein Geschäft.
              <span className="mt-2 block bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 bg-clip-text pb-2 text-transparent">
                Live erleben.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-zinc-500 sm:text-lg">
              So wird aus dem nächsten Besuch ein Wiedersehen. Entdecke in deiner persönlichen Demo, wie StampNow zu deinem Geschäft passt.
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-zinc-600 sm:text-sm">
              {["Unverbindlich", "Für deinen Betrieb", "Deutschlandweit"].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <Check className="size-4 text-amber-600" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:sticky lg:top-32 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <DemoRequestForm onCompanyChange={setCompany} onIndustryChange={setIndustry} />
          </div>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <div className="relative isolate rounded-[2rem] border border-black/[0.06] bg-[#f2f2ef] px-4 pb-5 pt-6 sm:rounded-[2.5rem] sm:px-7 sm:pb-7">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
                <div className="absolute inset-0 bg-grid-pattern opacity-50" />
                <div className="absolute left-1/2 top-24 size-72 -translate-x-1/2 rounded-full border-[40px] border-amber-300/25 sm:size-96" />
              </div>
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3 px-1">
                <h2 className="text-sm font-bold tracking-tight">Deine Karte. Dein Look.</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                  Vorschau
                </span>
              </div>

              <div className="mx-auto w-full max-w-[280px]">
                <WalletCard
                  businessName={company.trim() || example.name}
                  currentStamps={stamps}
                  totalStamps={10}
                  reward={example.reward}
                  colorFrom="#f59e0b"
                  colorTo="#b45309"
                  size="sm"
                  interactive={false}
                  className="w-full border border-white/30 shadow-[0_20px_45px_-15px_rgba(180,83,9,0.45)]"
                />
              </div>

              <div className="relative mx-auto mt-6 max-w-[340px] rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <p className="mb-3 text-center text-xs font-medium text-zinc-500" role="status" aria-live="polite" aria-atomic="true">
                  {complete ? "10 von 10 – deine Belohnung ist freigeschaltet!" : `${stamps} von 10 Stempeln. Probier’s aus.`}
                </p>
                <button
                  type="button"
                  onClick={() => setStamps((current) => current === 10 ? 7 : current + 1)}
                  className="group flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
                >
                  {complete ? <RotateCcw className="size-4" aria-hidden="true" /> : <ScanLine className="size-4 text-amber-400" aria-hidden="true" />}
                  {complete ? "Noch einmal testen" : "Stempel testen"}
                </button>
              </div>
              <p className="mt-4 text-center text-[11px] leading-relaxed text-zinc-500">
                Beispielkarte · Dein Geschäftsname wird aus dem Formular übernommen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="demo-content-heading" className="border-t border-black/5 bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Das erwartet dich</p>
              <h2 id="demo-content-heading" className="text-3xl font-bold tracking-[-0.045em] sm:text-5xl">
                Weniger Theorie. Mehr Ausprobieren.
              </h2>
            </div>
            <p className="max-w-xs shrink-0 text-sm leading-relaxed text-zinc-500">
              Deine Fragen, dein Geschäft und ein konkreter Blick auf den Alltag mit StampNow.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {demoSteps.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="group rounded-[1.75rem] border border-black/5 bg-[#fafaf9] p-6 transition-colors hover:border-amber-200 hover:bg-amber-50/50 sm:p-8">
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-amber-200/60 bg-amber-100/60 text-amber-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-zinc-300" aria-hidden="true">0{index + 1}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-tight">{title}</h3>
                <p className="text-sm font-medium leading-relaxed text-zinc-500">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-5 rounded-[1.75rem] bg-zinc-950 px-6 py-7 text-white sm:px-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-medium text-white/50">Wenn du danach mit StampNow starten möchtest</p>
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-2xl font-bold tracking-tight">{pricingPlan.price} €</span>
                <span className="text-sm text-white/70">{pricingPlan.period} + {pricingPlan.setupFee} € einmalige Einrichtung</span>
              </p>
            </div>
            <Link href="/preise" className="inline-flex min-h-11 shrink-0 items-center gap-3 self-start rounded-full border border-white/15 px-5 py-3 text-xs font-semibold transition-colors hover:border-amber-400 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 md:self-auto">
              Alle Leistungen ansehen <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
