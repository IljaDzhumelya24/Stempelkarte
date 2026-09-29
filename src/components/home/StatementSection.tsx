"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Wallet, Palette, BarChart3, Zap } from "lucide-react";

// ─── SCROLL-DRIVEN WORD REVEAL ─────────────────────────────────────
function ScrollRevealText({ text, className = "" }: { text: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.4"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={className}>
      <p className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-1">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />;
        })}
      </p>
    </div>
  );
}

function Word({ word, range, progress }: { word: string, range: [number, number], progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block transition-colors duration-300 text-white">
      {word}
    </motion.span>
  );
}

// ─── MAIN SECTION ──────────────────────────────────────────────────

export default function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative w-full bg-zinc-950 flex flex-col items-center z-20 overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem]">
      
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] md:w-[60%] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* SCROLL-DRIVEN WORD REVEAL */}
      <div className="w-full pt-32 pb-20 md:pt-48 md:pb-32 flex justify-center px-6 relative z-10">
        <ScrollRevealText 
          text="Vergiss das Papier. Die Zukunft der Kundenbindung lebt direkt in den Smartphones deiner Gäste."
          className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] max-w-[1000px] text-center"
        />
      </div>

      {/* BENTO GRID */}
      <div className="w-full max-w-[1200px] px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 pb-32 md:pb-48 relative z-10">
        
        {/* Bento Item 1: Large Wide */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-2 relative group overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/5 p-8 md:p-12 flex flex-col justify-between min-h-[300px] md:min-h-[360px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-8 text-amber-400">
              <Wallet size={28} strokeWidth={1.5} />
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Direkt in der Wallet.</h3>
            <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-md leading-relaxed">
              Deine Kunden fügen die Stempelkarte mit einem Klick zur nativen Apple oder Google Wallet hinzu.
            </p>
          </div>
        </motion.div>

        {/* Bento Item 2: Square */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-1 relative group overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/5 p-8 md:p-10 flex flex-col justify-between min-h-[300px] md:min-h-[360px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-8 text-blue-400">
              <Palette size={24} strokeWidth={1.5} />
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">100% Dein Branding.</h3>
            <p className="text-base text-zinc-400 font-medium leading-relaxed">
              Dein Logo, deine Farben, deine Prämien. Deine Marke im Vordergrund.
            </p>
          </div>
        </motion.div>

        {/* Bento Item 3: Square */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-1 relative group overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/5 p-8 md:p-10 flex flex-col justify-between min-h-[300px] md:min-h-[360px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mb-8 text-emerald-400">
              <BarChart3 size={24} strokeWidth={1.5} />
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">Smarte Daten.</h3>
            <p className="text-base text-zinc-400 font-medium leading-relaxed">
              Erkenne in Echtzeit, wer deine treuesten Kunden sind und was funktioniert.
            </p>
          </div>
        </motion.div>

        {/* Bento Item 4: Large Wide */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-2 relative group overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/5 p-8 md:p-12 flex flex-col justify-between min-h-[300px] md:min-h-[360px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-8 text-violet-400">
              <Zap size={28} strokeWidth={1.5} />
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">In 5 Minuten live.</h3>
            <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-md leading-relaxed">
              Keine wochenlange Entwicklung. Registrieren, Karte designen und noch heute den ersten Stempel vergeben.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
