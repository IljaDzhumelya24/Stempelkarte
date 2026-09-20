"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// ─── SCROLL-DRIVEN WORD REVEAL ─────────────────────────────────────
// Each word goes from 15% opacity to 100% based on scroll position
// This is THE signature Awwwards animation
function ScrollRevealText({ text, className = "" }: { text: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.3"],
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
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block transition-colors duration-300">
      {word}
    </motion.span>
  );
}

// ─── MAIN SECTION ──────────────────────────────────────────────────

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    ),
    title: "Keine App nötig",
    desc: "Deine Stempelkarte landet mit einem Klick direkt in Apple Wallet oder Google Pay.",
    stat: "0",
    statLabel: "App Downloads",
    color: "amber" as const,
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
    title: "In 5 Minuten live",
    desc: "Logo hochladen, Farben wählen, fertig. Vollautomatisch generiert und sofort einsatzbereit.",
    stat: "5",
    statLabel: "Min Setup",
    color: "blue" as const,
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
    title: "100% DSGVO konform",
    desc: "Komplett anonym über sichere Token. Maximale Kundenbindung ohne Datensammelei.",
    stat: "100%",
    statLabel: "Datenschutz",
    color: "emerald" as const,
  },
];

const colorMap = {
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
};

export default function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative w-full bg-[#fcfcfc] flex flex-col items-center z-20 overflow-hidden">
      
      {/* SCROLL-DRIVEN WORD REVEAL — THE Awwwards Signature */}
      <div className="w-full py-32 md:py-48 flex justify-center px-6">
        <ScrollRevealText 
          text="Die eleganteste Art, Kunden zu begeistern. Keine App. Kein Plastik. Nur pure Magie direkt in der nativen Wallet deiner Kunden."
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-[#111] max-w-[1200px] text-center"
        />
      </div>

      {/* Social Proof Ticker */}
      <div className="w-full border-y border-black/5 py-6 mb-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="flex justify-center items-center gap-16 flex-wrap px-8"
        >
          {["500+ Geschäfte", "50.000+ Stempel", "98% Retention", "4.9★ Bewertung"].map((item, i) => (
            <motion.span 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className="text-sm font-bold uppercase tracking-[0.2em] text-black/30 flex items-center gap-3"
            >
              <span className="w-1 h-1 rounded-full bg-amber-500" />
              {item}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Feature Cards with Scale-In + Stagger */}
      <div className="w-full max-w-[1600px] px-8 md:px-16 xl:px-32 grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12 pb-24">
        {features.map((f, i) => {
          const c = colorMap[f.color];
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -12, scale: 1.02 }}
              className={`p-10 rounded-[2.5rem] bg-white border ${c.border} shadow-[0_8px_40px_rgba(0,0,0,0.04)] flex flex-col gap-5 cursor-default transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]`}
            >
              <motion.div 
                whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.15 }}
                transition={{ duration: 0.6 }}
                className={`w-14 h-14 rounded-2xl ${c.bg} ${c.text} flex items-center justify-center`}
              >
                {f.icon}
              </motion.div>

              <div className="flex items-baseline gap-3">
                <span className="text-6xl lg:text-7xl font-bold tracking-tighter text-[#111]">{f.stat}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-black/30">{f.statLabel}</span>
              </div>

              <h3 className="text-xl font-bold text-[#111] tracking-tight">{f.title}</h3>
              <p className="text-sm font-medium text-black/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
