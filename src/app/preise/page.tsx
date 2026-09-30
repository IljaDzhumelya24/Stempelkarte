"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { pricingPlan, faqItems } from "@/lib/data";

// ─── CHARACTER REVEAL ──────────────────────────────────────────────
function CharReveal({ text, className = "", delay = 0 }: { text: string, className?: string, delay?: number }) {
  const words = text.split(" ");
  let globalIndex = 0;
  return (
    <div className={`overflow-hidden w-full flex justify-center pb-[0.15em] ${className}`}>
      <motion.div className="flex flex-wrap justify-center gap-x-[0.2em] md:gap-[0.25em]">
        {words.map((word, wI) => (
          <span key={wI} className="whitespace-nowrap flex">
            {word.split("").map((char, cI) => {
              const delayTime = delay + globalIndex * 0.035;
              globalIndex++;
              return (
                <motion.span
                  key={cI}
                  initial={{ y: "110%", rotateX: 90, opacity: 0 }}
                  animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: delayTime, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                  style={{ transformOrigin: "bottom" }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── SVG ICONS ───────────────────────────────────────────────────
const CheckIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ─── FEATURE TABLE DATA ──────────────────────────────────────────
const comparisonFeatures = [
  {
    name: "Karte aufbewahren",
    paper: "Als Papierkarte im Portemonnaie",
    stampNow: "Digital in Apple Wallet oder Google Wallet",
  },
  {
    name: "Stempel vergeben",
    paper: "Per Hand auf die Karte stempeln",
    stampNow: "Kundenkarte scannen und digital stempeln",
  },
  {
    name: "Nutzung im Blick",
    paper: "Besuche und Einlösungen separat erfassen",
    stampNow: "Aktive Karten, Stempel und Einlösungen im Dashboard",
  },
  {
    name: "Eigenes Design",
    paper: "Logo und Farben auf gedruckten Karten",
    stampNow: "Logo, Farben und Prämie auf deiner digitalen Karte",
  },
  {
    name: "Neue Karten bereitstellen",
    paper: "Karten drucken und im Geschäft auslegen",
    stampNow: "Kunden speichern ihre Karte über deinen QR-Code",
  },
];

export default function PreisePage() {
  const faqs = faqItems.slice(0, 4);

  return (
    <main className="bg-canvas text-[#111] min-h-screen relative selection:bg-brand-500 selection:text-white overflow-x-clip">
      <Navigation />

      {/* ─── PURE CINEMATIC HERO ───────────────────────────────────── */}
      <section className="w-full pt-40 lg:pt-52 pb-16 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 mb-10 md:mb-12 px-5 py-2.5 rounded-full bg-black/5 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
        >
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#111]">Ein Angebot. Klarer Preis.</span>
        </motion.div>

        <CharReveal
          text="Für deinen Betrieb."
          className="text-[11.5vw] sm:text-[12vw] md:text-[9vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[0.8] text-[#111]"
          delay={0.1}
        />
        <CharReveal
          text="Einfach StampNow."
          className="text-[11.5vw] sm:text-[12vw] md:text-[9vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-br from-zinc-400 via-zinc-600 to-zinc-800 -mt-[0.1em]"
          delay={0.4}
        />
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} 
          className="mt-10 md:mt-12 text-lg md:text-xl text-black/40 font-medium max-w-xl leading-relaxed"
        >
          Deine digitale Kundenbindung für {pricingPlan.price} € {pricingPlan.period} plus {pricingPlan.setupFee} € einmalige Einrichtung.
        </motion.p>
      </section>

      {/* Single offer */}
      <section aria-labelledby="offer-heading" className="w-full pt-8 pb-16 md:pt-12 md:pb-24 px-6 max-w-[1100px] mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden bg-[#111] text-white border border-brand-500/20 shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2">
            <div className="p-6 sm:p-10 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400 mb-5">Deine digitale Kundenbindung</p>
              <h2 id="offer-heading" className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                {pricingPlan.name}
              </h2>
              <p className="text-base font-medium leading-relaxed text-white/65">
                {pricingPlan.description}
              </p>

              <div className="my-9">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-5xl sm:text-6xl font-black tracking-tighter whitespace-nowrap">{pricingPlan.price} €</span>
                  <span className="text-sm font-medium text-white/60">{pricingPlan.period}</span>
                </div>
                <p className="mt-3 text-base leading-relaxed text-white/75">
                  plus <strong className="text-white">{pricingPlan.setupFee} €</strong> einmalige Einrichtung
                </p>
              </div>

              <Link
                href="/demo"
                className="brand-button inline-block w-full py-5 rounded-full bg-brand-500 text-white font-black text-xs uppercase tracking-widest text-center transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400"
              >
                {pricingPlan.ctaText}
              </Link>
            </div>

            <div className="p-6 sm:p-10 lg:p-14 border-t md:border-t-0 md:border-l border-white/10 bg-white/[0.03] flex flex-col justify-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-7">
                Das ist enthalten
              </h3>
              <ul className="flex flex-col gap-5">
                {pricingPlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 bg-brand-500/15">
                      <CheckIcon />
                    </span>
                    <span className="text-base font-medium leading-relaxed text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Paper cards and StampNow */}
      <section className="w-full py-16 md:py-24 px-6 max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Papierkarte & StampNow</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#111]">
            Was digital einfacher wird
          </h2>
          <p className="mt-5 text-base md:text-lg text-black/50 font-medium leading-relaxed max-w-2xl mx-auto">
            Das Prinzip bleibt: Besuche sammeln und Treue belohnen. StampNow bringt deine Karte aufs Smartphone und die Nutzung in dein Dashboard.
          </p>
        </motion.div>

        <div className="hidden md:block w-full bg-white rounded-[3rem] p-8 lg:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.04)] border border-black/5">
          <table className="w-full table-fixed text-left">
            <caption className="sr-only">Papier-Stempelkarten und StampNow im Vergleich</caption>
            <thead>
              <tr className="border-b border-black/10">
                <th scope="col" className="w-[28%] pb-6 pr-6 text-xs font-bold uppercase tracking-widest text-black/40">Im Alltag</th>
                <th scope="col" className="w-[34%] pb-6 px-5 text-sm font-bold text-[#111]">Papierkarte</th>
                <th scope="col" className="w-[38%] pb-6 px-5 text-sm font-black text-brand-600">StampNow</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature) => (
                <tr key={feature.name} className="border-b border-black/5 last:border-0">
                  <th scope="row" className="py-6 pr-6 align-top text-base font-bold text-[#111]">{feature.name}</th>
                  <td className="py-6 px-5 align-top text-sm font-medium leading-relaxed text-black/50">{feature.paper}</td>
                  <td className="py-6 px-5 align-top text-sm font-bold leading-relaxed text-[#111] bg-brand-500/[0.04]">{feature.stampNow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex md:hidden flex-col gap-6">
          {comparisonFeatures.map((feature) => (
            <div key={feature.name} className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-black/5">
              <h3 className="text-lg font-black text-[#111] mb-5">{feature.name}</h3>
              <dl>
                <div className="pb-4 border-b border-black/5">
                  <dt className="text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Papierkarte</dt>
                  <dd className="text-sm font-medium text-black/60 leading-relaxed">{feature.paper}</dd>
                </div>
                <div className="pt-4">
                  <dt className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">StampNow</dt>
                  <dd className="text-sm font-bold text-[#111] leading-relaxed">{feature.stampNow}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>
      {/* ─── ROI SECTION (CLEAN) ────────────────────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-6 bg-surface">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#111] mb-6 leading-[1.1]">
              Was bringt das deinem Geschäft?
            </h2>
            <p className="text-lg text-black/50 font-medium leading-relaxed mb-10">
              Mit <strong className="text-[#111]">zusätzlichen Besuchen deiner Stammkunden</strong> wächst dein Umsatz. Ob sich StampNow für dich lohnt, hängt von deiner Marge, den Prämien und den tatsächlichen Wiederbesuchen ab.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-black/40">
              <span className="w-8 h-[2px] bg-black/20" />
              Rechenbeispiel, keine Prognose
            </div>
          </div>
          <div className="w-full md:w-[420px] bg-white p-10 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-black/5 relative overflow-hidden group">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[40px] rounded-full group-hover:bg-brand-500/20 transition-colors duration-500" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center pb-5 border-b border-black/5">
                <span className="text-black/50 font-medium">Zusätzliche Kunden</span>
                <span className="font-bold text-lg">+ 3</span>
              </div>
              <div className="flex justify-between items-center pb-5 border-b border-black/5">
                <span className="text-black/50 font-medium">Umsatz pro Kunde</span>
                <span className="font-bold text-lg">Ø 12 €</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[#111] font-bold text-base">Zusatzumsatz</span>
                <span className="text-3xl font-black text-brand-500 tracking-tight">+ 36 €</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ──────────────────────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-6 max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#111] mb-4">Häufige Fragen</h2>
          <Link href="/faq" className="text-brand-600 font-bold hover:underline">Alle FAQs ansehen →</Link>
        </div>
        
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-black/5"
            >
              <h3 className="text-xl font-bold tracking-tight mb-3">{faq.question}</h3>
              <p className="text-black/60 font-medium leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="w-full py-8 px-4 md:px-8 bg-surface">
        <div className="w-full py-32 md:py-48 bg-[#111] text-white rounded-[3rem] md:rounded-[4rem] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.85] relative z-10 max-w-[900px]">
            Bereit für mehr <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-400 to-zinc-600">Stammkunden?</span>
          </h2>
          <div className="mt-10 md:mt-16 relative z-10">
            <Link href="/demo" className="brand-button w-full sm:w-auto bg-brand-500 text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform inline-block">
              Demo anfragen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
