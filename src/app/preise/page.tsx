"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { pricingTiers, faqItems } from "@/lib/data";

// ─── SVG ICONS ───────────────────────────────────────────────────
const CheckIcon = () => (
  <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg className="w-5 h-5 text-black/10 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ─── FEATURE TABLE DATA ──────────────────────────────────────────
const comparisonFeatures = [
  { name: "Aktive Kunden", starter: "Bis zu 200", pro: "Unbegrenzt" },
  { name: "Standorte", starter: "1 Standort", pro: "Unbegrenzt" },
  { name: "Stempelkarten-Designs", starter: "1 Design", pro: "Bis zu 5 Designs" },
  { name: "Apple & Google Wallet", starter: true, pro: true },
  { name: "QR-Code Scanner für Kasse", starter: true, pro: true },
  { name: "Echtzeit-Dashboard", starter: true, pro: true },
  { name: "Eigenes Branding", starter: true, pro: true },
  { name: "Push-Benachrichtigungen", starter: false, pro: true },
  { name: "Support", starter: "E-Mail", pro: "Priorität (Telefon & E-Mail)" },
];

export default function PreisePage() {
  const faqs = faqItems.slice(0, 4);

  return (
    <main className="bg-[#fcfcfc] text-[#111] min-h-screen relative selection:bg-amber-500 selection:text-black overflow-x-clip">
      <Navigation />

      {/* ─── PURE CINEMATIC HERO ───────────────────────────────────── */}
      <section className="w-full pt-40 lg:pt-48 pb-16 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full bg-black/5 backdrop-blur-xl border border-black/5"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#111]">Transparente Tarife</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-[#111] mb-6"
        >
          Einfache Preise.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-400 via-zinc-600 to-zinc-800">Keine Überraschungen.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} 
          className="mt-6 text-lg md:text-xl text-black/40 font-medium max-w-xl leading-relaxed"
        >
          Wähle den Plan, der am besten zu deinem Geschäft passt. Jederzeit kündbar, keine versteckten Gebühren.
        </motion.p>
      </section>

      {/* ─── PRICING CARDS (WIDE HORIZONTAL LAYOUT) ────────────────────────── */}
      <section className="w-full py-12 md:py-20 px-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-10">
          {pricingTiers.map((tier, i) => {
            const isHighlighted = tier.highlighted;
            
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col md:flex-row w-full p-8 md:p-12 lg:p-16 rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                  isHighlighted 
                    ? "bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#050505] text-white shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-amber-500/20" 
                    : "bg-white text-[#111] shadow-[0_20px_80px_rgba(0,0,0,0.04)] border border-black/5"
                }`}
              >
                {/* Highlight Glow Effect */}
                {isHighlighted && (
                  <div className="absolute top-1/2 left-1/2 w-full h-[150%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
                )}

                {/* LEFT SIDE: Info & Price */}
                <div className={`relative z-10 w-full md:w-[45%] flex flex-col md:pr-12 lg:pr-16 md:border-r ${isHighlighted ? "border-white/10" : "border-black/5"}`}>
                  {/* Badge */}
                  {isHighlighted && (
                    <div className="w-fit mb-6 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                      Empfohlen
                    </div>
                  )}

                  <h3 className={`text-4xl lg:text-5xl font-bold tracking-tighter mb-4 ${isHighlighted ? "text-white" : "text-[#111]"}`}>
                    {tier.name}
                  </h3>
                  
                  <p className={`text-base font-medium leading-relaxed mb-8 ${isHighlighted ? "text-white/50" : "text-black/40"}`}>
                    {tier.description}
                  </p>

                  <div className="mb-10 flex items-baseline gap-2 mt-auto">
                    <span className={`text-6xl lg:text-7xl font-bold tracking-tighter ${isHighlighted ? "text-white" : "text-[#111]"}`}>€{tier.price}</span>
                    <span className={`text-sm font-bold uppercase tracking-widest ${isHighlighted ? "text-white/30" : "text-black/20"}`}>
                      /{tier.period.replace("pro ", "")}
                    </span>
                  </div>

                  <Link
                    href="/demo"
                    className={`w-full py-5 rounded-full font-bold text-sm uppercase tracking-widest text-center transition-all duration-300 hover:scale-[1.02] ${
                      isHighlighted 
                        ? "bg-amber-500 text-[#111] hover:bg-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.2)]" 
                        : "bg-[#111] text-white hover:bg-black/90 shadow-xl"
                    }`}
                  >
                    {tier.ctaText || "Auswählen"}
                  </Link>
                </div>

                {/* RIGHT SIDE: Features */}
                <div className="relative z-10 w-full md:w-[55%] mt-12 md:mt-0 md:pl-12 lg:pl-16 flex flex-col justify-center">
                  <h4 className={`text-sm font-bold uppercase tracking-widest mb-8 ${isHighlighted ? "text-white/40" : "text-black/30"}`}>
                    Alles in {tier.name} enthalten:
                  </h4>
                  
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 lg:gap-y-8">
                    {tier.features.map((feature: string, fIndex: number) => (
                      <li key={fIndex} className="flex items-start gap-4">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${isHighlighted ? "bg-amber-500/10" : "bg-black/5"}`}>
                          <svg className={`w-4 h-4 ${isHighlighted ? "text-amber-500" : "text-black/40"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className={`text-base font-medium mt-0.5 ${isHighlighted ? "text-white/90" : "text-[#111]/80"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── FEATURE COMPARISON TABLE ─────────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-6 max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#111] mb-4">Vergleich im Detail</h2>
          <p className="text-black/40 font-medium text-lg">Alle Funktionen in der direkten Übersicht.</p>
        </motion.div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-6 px-4 text-sm font-bold uppercase tracking-widest text-black/40 w-1/2">Funktion</th>
                <th className="py-6 px-4 text-sm font-bold uppercase tracking-widest text-[#111] w-1/4">Starter</th>
                <th className="py-6 px-4 text-sm font-bold uppercase tracking-widest text-amber-600 w-1/4">Professional</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feat, i) => (
                <tr key={i} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                  <td className="py-6 px-4 text-base md:text-lg font-medium text-[#111]">{feat.name}</td>
                  <td className="py-6 px-4 text-base md:text-lg font-medium text-black/60">
                    {typeof feat.starter === 'boolean' ? (feat.starter ? <CheckIcon /> : <CrossIcon />) : feat.starter}
                  </td>
                  <td className="py-6 px-4 text-base md:text-lg font-bold text-[#111]">
                    {typeof feat.pro === 'boolean' ? (feat.pro ? <CheckIcon /> : <CrossIcon />) : feat.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE TABLE (Stacked Cards) */}
        <div className="flex md:hidden flex-col gap-4">
          {comparisonFeatures.map((feat, i) => (
            <div key={i} className="bg-black/[0.02] border border-black/5 rounded-2xl p-5 flex flex-col">
              <h4 className="text-lg font-bold tracking-tight text-[#111] mb-4">{feat.name}</h4>
              
              <div className="flex justify-between items-center py-3 border-b border-black/5">
                <span className="text-xs font-bold uppercase tracking-widest text-black/40">Starter</span>
                <span className="text-sm font-medium text-black/60 text-right flex justify-end">
                   {typeof feat.starter === 'boolean' ? (feat.starter ? <CheckIcon /> : <CrossIcon />) : feat.starter}
                </span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Professional</span>
                <span className="text-sm font-bold text-[#111] text-right flex justify-end">
                   {typeof feat.pro === 'boolean' ? (feat.pro ? <CheckIcon /> : <CrossIcon />) : feat.pro}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ROI SECTION ──────────────────────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-6 bg-amber-500/10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#111] mb-6">
              Macht sich von selbst bezahlt.
            </h2>
            <p className="text-lg md:text-xl text-black/60 font-medium leading-relaxed mb-8">
              Mit nur <strong className="text-[#111]">2-3 zusätzlichen Stammkunden</strong> im Monat, die durch die digitale Stempelkarte öfter wiederkommen, hast du die Kosten für das Starter-Paket bereits wieder reingeholt. Jeder weitere Kunde ist reiner Gewinn für dein Geschäft.
            </p>
            <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-amber-600">
              <span className="w-8 h-[2px] bg-amber-600" />
              Kein Risiko. Jederzeit kündbar.
            </div>
          </div>
          <div className="w-full md:w-[400px] bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-black/5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[40px] rounded-full" />
            <h3 className="text-xl font-bold tracking-tight mb-8">Beispiel-Rechnung</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center pb-4 border-b border-black/5">
                <span className="text-black/50 font-medium">Zusätzliche Kunden</span>
                <span className="font-bold">+ 3</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-black/5">
                <span className="text-black/50 font-medium">Umsatz pro Kunde</span>
                <span className="font-bold">Ø 12 €</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-amber-600 font-bold uppercase tracking-wider text-sm">Zusatzumsatz</span>
                <span className="text-2xl font-bold text-amber-600">+ 36 €</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ──────────────────────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-6 max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#111] mb-4">Häufige Fragen</h2>
          <Link href="/faq" className="text-amber-600 font-bold hover:underline">Alle FAQs ansehen →</Link>
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
      <section className="w-full py-8 px-4 md:px-8 bg-[#f5f5f7]">
        <div className="w-full py-32 md:py-48 bg-[#111] text-white rounded-[3rem] md:rounded-[4rem] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.85] relative z-10 max-w-[900px]">
            Bereit für dein <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-400 to-zinc-600">Geschäft?</span>
          </h2>
          <div className="mt-10 md:mt-16 relative z-10">
            <Link href="/demo" className="w-full sm:w-auto bg-amber-500 text-[#111] px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform inline-block">
              Demo Anfragen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
