"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WalletCard from "@/components/WalletCard";
import { branchen } from "@/lib/data";

// ─── CHARACTER REVEAL ──────────────────────────────────────────────
function CharReveal({ text, className = "", delay = 0 }: { text: string, className?: string, delay?: number }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div className="flex flex-wrap justify-center">
        {text.split("").map((char, i) => (
          <motion.span key={i} initial={{ y: "110%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} transition={{ duration: 0.8, delay: delay + i * 0.02, ease: [0.16, 1, 0.3, 1] }} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────
export default function BranchenPage() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <main className="bg-[#fcfcfc] text-[#111] min-h-screen relative selection:bg-amber-500 selection:text-black overflow-x-clip">
      <Navigation />

      {/* ─── PURE CINEMATIC HERO ───────────────────────────────────── */}
      <section className="w-full pt-40 lg:pt-52 pb-24 md:pb-32 flex flex-col items-center text-center px-6 border-b border-black/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 mb-10 px-5 py-2.5 rounded-full bg-black/5 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
        >
          <span className="w-2 h-2 rounded-full bg-zinc-800" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#111]">Anwendungsfälle</span>
        </motion.div>

        <CharReveal text="Branchen." className="text-[11.5vw] sm:text-[12vw] md:text-[9vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[0.8] text-[#111]" delay={0.1} />
        <CharReveal text="Dein Geschäft." className="text-[11.5vw] sm:text-[12vw] md:text-[9vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-br from-zinc-400 via-zinc-600 to-zinc-800 -mt-[0.1em]" delay={0.4} />
        
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="mt-10 text-lg md:text-xl text-black/40 font-medium max-w-xl leading-relaxed">
          Egal ob Café, Kiosk oder Friseur. Die digitale Stempelkarte passt sich deinem Business nahtlos an.
        </motion.p>
      </section>

      {/* ─── INTERACTIVE EDITORIAL LIST ─────────────────────────────── */}
      <section className="w-full py-0 relative">
        <div className="w-full flex flex-col lg:flex-row max-w-[1600px] mx-auto">
          
          {/* LEFT: Massive Typography List */}
          <div className="w-full lg:w-3/5 flex flex-col border-r border-black/5">
            {branchen.map((branche, i) => (
              <Link
                key={branche.slug}
                href={`/branchen/${branche.slug}`}
                onMouseEnter={() => setActiveIndex(i)}
                className="group border-b border-black/5 px-6 sm:px-10 md:px-16 py-16 md:py-24 flex flex-col relative overflow-hidden transition-colors duration-500 lg:hover:bg-[#111]"
              >
                <div className="relative z-10 flex flex-col">
                  {/* Number & Title */}
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-6 md:mb-8">
                    <span className="text-sm md:text-xl font-bold tracking-tighter text-black/20 lg:group-hover:text-amber-500 transition-colors duration-500">
                      0{i + 1}
                    </span>
                    <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-[#111] lg:group-hover:text-white transition-colors duration-500">
                      {branche.name}
                    </h2>
                  </div>
                  
                  {/* Description */}
                  <p className="text-base md:text-xl text-black/40 lg:group-hover:text-white/60 font-medium max-w-lg leading-relaxed transition-colors duration-500 md:ml-[4.5rem]">
                    {branche.description}
                  </p>
                  
                  {/* Mobile-only WalletCard (Inline) */}
                  <div className="mt-12 lg:hidden flex justify-center w-full">
                    <WalletCard
                      businessName={branche.businessName}
                      currentStamps={branche.currentStamps}
                      totalStamps={branche.totalStamps}
                      reward={branche.reward}
                      colorFrom={branche.colorFrom}
                      colorTo={branche.colorTo}
                      size="sm"
                      showQR={true}
                      className="shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-black/5"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* RIGHT: Floating Card Viewer (Sticky Desktop Only) */}
          <div className="hidden lg:flex w-2/5 sticky top-0 h-screen items-center justify-center bg-[#f5f5f7] overflow-hidden [perspective:1200px]">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, y: -40, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <WalletCard
                    businessName={branchen[activeIndex].businessName}
                    currentStamps={branchen[activeIndex].currentStamps}
                    totalStamps={branchen[activeIndex].totalStamps}
                    reward={branchen[activeIndex].reward}
                    colorFrom={branchen[activeIndex].colorFrom}
                    colorTo={branchen[activeIndex].colorTo}
                    size="lg"
                    showQR={true}
                    className="w-[380px] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-black/5"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="w-full py-8 px-4 md:px-8 bg-[#f5f5f7]">
        <div className="w-full py-40 md:py-56 bg-black text-white rounded-[3rem] md:rounded-[4rem] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.85] relative z-10 max-w-[900px]">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-400 to-zinc-600">Start?</span>
          </h2>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 relative z-10 w-full sm:w-auto">
            <Link href="/demo" className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest text-center hover:scale-105 transition-transform inline-block">
              Demo Anfragen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
