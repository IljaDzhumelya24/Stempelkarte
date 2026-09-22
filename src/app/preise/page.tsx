"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { pricingTiers, faqItems } from "@/lib/data";

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
      <section className="w-full pt-40 lg:pt-52 pb-16 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 mb-10 md:mb-12 px-5 py-2.5 rounded-full bg-black/5 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#111]">Transparente Tarife</span>
        </motion.div>

        <CharReveal
          text="Für deinen Betrieb."
          className="text-[11.5vw] sm:text-[12vw] md:text-[9vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[0.8] text-[#111]"
          delay={0.1}
        />
        <CharReveal
          text="Der passende Tarif."
          className="text-[11.5vw] sm:text-[12vw] md:text-[9vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-br from-zinc-400 via-zinc-600 to-zinc-800 -mt-[0.1em]"
          delay={0.4}
        />
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} 
          className="mt-10 md:mt-12 text-lg md:text-xl text-black/40 font-medium max-w-xl leading-relaxed"
        >
          Wähle den Plan, der am besten zu deinem Geschäft passt. Jederzeit kündbar, keine versteckten Gebühren.
        </motion.p>
      </section>

      {/* ─── PRICING CARDS (HEFTIG BENTO) ────────────────────────────── */}
      <section className="w-full py-16 md:py-32 px-6 max-w-[1300px] mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-0 lg:items-center">
          {pricingTiers.map((tier, i) => {
            const isHighlighted = tier.highlighted;
            
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-500 ${
                  isHighlighted 
                    ? "bg-[#050505] text-white shadow-[0_0_100px_rgba(245,158,11,0.25)] border-[2px] border-amber-500/30 lg:scale-110 lg:z-30 p-10 md:p-14" 
                    : "bg-white text-[#111] shadow-[0_20px_80px_rgba(0,0,0,0.03)] border border-black/5 p-8 md:p-10 lg:scale-95 lg:z-10 hover:-translate-y-2 hover:shadow-[0_30px_100px_rgba(0,0,0,0.06)]"
                }`}
              >
                {/* Intense Highlight Glow Effects */}
                {isHighlighted && (
                  <>
                    <div className="absolute top-0 left-1/2 w-[150%] h-[300px] bg-amber-500/20 blur-[100px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-[40%]" />
                    <div className="absolute bottom-0 right-0 w-[100%] h-[200px] bg-amber-600/10 blur-[80px] rounded-full pointer-events-none transform translate-x-1/4 translate-y-1/4" />
                    {/* Animated moving border highlight simulation */}
                    <div className="absolute inset-0 border border-amber-300/10 rounded-[2.5rem] pointer-events-none" />
                  </>
                )}

                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Badge */}
                  {isHighlighted ? (
                    <motion.div 
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 1, boxShadow: ["0 0 0 rgba(245,158,11,0)", "0 0 20px rgba(245,158,11,0.5)", "0 0 0 rgba(245,158,11,0)"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-fit mb-8 px-4 py-1.5 rounded-full bg-amber-500 border border-amber-400 text-[#111] text-[11px] font-black uppercase tracking-widest"
                    >
                      Empfohlen
                    </motion.div>
                  ) : (
                    <div className="w-fit mb-8 px-4 py-1.5 rounded-full bg-transparent border border-transparent text-transparent text-[11px] select-none">
                      Spacer
                    </div>
                  )}

                  <h3 className={`text-3xl font-black tracking-tight mb-3 ${isHighlighted ? "text-white" : "text-[#111]"}`}>
                    {tier.name}
                  </h3>
                  
                  <p className={`text-sm font-medium leading-relaxed min-h-[60px] ${isHighlighted ? "text-white/60" : "text-black/40"}`}>
                    {tier.description}
                  </p>

                  <div className="my-10 flex items-baseline gap-2">
                    <span className={`font-black tracking-tighter ${
                      isHighlighted 
                        ? "text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70" 
                        : "text-5xl md:text-6xl text-[#111]"
                    }`}>
                      {tier.price === 'Individuell' ? 'Indiv.' : `€${tier.price}`}
                    </span>
                    {tier.period && (
                      <span className={`text-xs font-bold uppercase tracking-widest ${isHighlighted ? "text-white/40" : "text-black/20"}`}>
                        /{tier.period.replace("pro ", "")}
                      </span>
                    )}
                  </div>

                  <Link
                    href="/demo"
                    className={`w-full py-5 rounded-full font-black text-xs uppercase tracking-widest text-center transition-all duration-300 ${
                      isHighlighted 
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-[#111] hover:from-amber-300 hover:to-amber-400 shadow-[0_10px_40px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_50px_rgba(245,158,11,0.6)] hover:scale-[1.03]" 
                        : "bg-[#f5f5f7] text-[#111] hover:bg-black/5"
                    }`}
                  >
                    {tier.ctaText || "Auswählen"}
                  </Link>

                  <div className={`w-full h-px my-10 ${isHighlighted ? "bg-white/10" : "bg-black/5"}`} />

                  <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${isHighlighted ? "text-amber-500" : "text-black/30"}`}>
                    Enthaltene Funktionen:
                  </h4>
                  
                  <ul className="flex flex-col gap-5">
                    {tier.features.map((feature: string, fIndex: number) => (
                      <li key={fIndex} className="flex items-start gap-4">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${isHighlighted ? "bg-amber-500/20" : "bg-black/5"}`}>
                          <svg className={`w-3.5 h-3.5 ${isHighlighted ? "text-amber-400" : "text-black/40"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className={`text-sm font-medium mt-0.5 ${isHighlighted ? "text-white/90" : "text-[#111]/70"}`}>
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

      {/* ─── FEATURE COMPARISON TABLE (PREMIUM CARD) ─────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-6 max-w-[1100px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Vergleich</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#111]">
            Alle Funktionen im Detail
          </h2>
        </motion.div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block w-full bg-white rounded-[3rem] p-10 lg:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.04)] border border-black/5 relative overflow-hidden">
          
          {/* Subtle Highlight for Pro Column */}
          <div className="absolute top-0 right-8 w-[30%] h-full bg-gradient-to-b from-amber-500/[0.07] to-transparent pointer-events-none rounded-3xl" />

          <div className="grid grid-cols-12 gap-4 border-b border-black/10 pb-6 mb-4 relative z-10">
            <div className="col-span-5 text-xs font-bold uppercase tracking-widest text-black/40 flex items-end">Funktion</div>
            <div className="col-span-3 text-sm font-bold uppercase tracking-widest text-[#111] flex items-end justify-center">Starter</div>
            <div className="col-span-4 text-sm font-black uppercase tracking-widest text-amber-600 flex items-end justify-center">Professional</div>
          </div>

          <div className="relative z-10 flex flex-col">
            {comparisonFeatures.map((feat, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 py-6 border-b border-black/[0.03] hover:bg-black/[0.02] transition-colors rounded-2xl -mx-4 px-4">
                <div className="col-span-5 flex items-center text-base font-bold text-[#111]">
                  {feat.name}
                </div>
                <div className="col-span-3 flex items-center justify-center text-sm font-medium text-black/50 text-center">
                  {typeof feat.starter === 'boolean' ? (feat.starter ? <CheckIcon /> : <span className="text-black/10 font-bold">—</span>) : feat.starter}
                </div>
                <div className="col-span-4 flex items-center justify-center text-base font-black text-[#111] text-center">
                  {typeof feat.pro === 'boolean' ? (feat.pro ? <CheckIcon /> : <span className="text-black/10 font-bold">—</span>) : feat.pro}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE TABLE (Premium Cards) */}
        <div className="flex md:hidden flex-col gap-6">
          {comparisonFeatures.map((feat, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[30px] rounded-full pointer-events-none" />
              
              <h4 className="text-lg font-black text-[#111] mb-6 relative z-10">{feat.name}</h4>
              
              <div className="flex justify-between items-center py-4 border-b border-black/5 relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-black/40">Starter</span>
                <span className="text-sm font-medium text-black/60">
                   {typeof feat.starter === 'boolean' ? (feat.starter ? <CheckIcon /> : <span className="text-black/10">—</span>) : feat.starter}
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Professional</span>
                <span className="text-sm font-black text-[#111]">
                   {typeof feat.pro === 'boolean' ? (feat.pro ? <CheckIcon /> : <span className="text-black/10">—</span>) : feat.pro}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ROI SECTION (CLEAN) ────────────────────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-6 bg-[#f5f5f7]">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#111] mb-6 leading-[1.1]">
              Was bringt das deinem Geschäft?
            </h2>
            <p className="text-lg text-black/50 font-medium leading-relaxed mb-10">
              Mit <strong className="text-[#111]">zusätzlichen Besuchen deiner Stammkunden</strong> wächst dein Umsatz. Ob sich der Tarif für dich lohnt, hängt von deiner Marge, den Prämien und den tatsächlichen Wiederbesuchen ab.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-black/40">
              <span className="w-8 h-[2px] bg-black/20" />
              Rechenbeispiel, keine Prognose
            </div>
          </div>
          <div className="w-full md:w-[420px] bg-white p-10 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-black/5 relative overflow-hidden group">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full group-hover:bg-amber-500/20 transition-colors duration-500" />
            
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
                <span className="text-3xl font-black text-amber-500 tracking-tight">+ 36 €</span>
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
            Bereit für mehr <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-400 to-zinc-600">Stammkunden?</span>
          </h2>
          <div className="mt-10 md:mt-16 relative z-10">
            <Link href="/demo" className="w-full sm:w-auto bg-amber-500 text-[#111] px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform inline-block">
              Demo anfragen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
