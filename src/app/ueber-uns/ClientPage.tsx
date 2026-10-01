"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// ─── CHARACTER REVEAL ──────────────────────────────────────────────
function CharReveal({ text, className = "", delay = 0 }: { text: string, className?: string, delay?: number }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div className="flex flex-wrap">
        {text.split("").map((char, i) => (
          <motion.span 
            key={i} 
            initial={{ y: "110%", opacity: 0 }} 
            animate={{ y: "0%", opacity: 1 }} 
            transition={{ duration: 0.8, delay: delay + i * 0.02, ease: [0.16, 1, 0.3, 1] }} 
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

const values = [
  { title: "Simplicity", text: "Kundenbindung soll auch dann einfach bleiben, wenn an deiner Kasse viel los ist. Deshalb denken wir vom Alltag lokaler Geschäfte aus." },
  { title: "Innovation", text: "Wir bringen die Stempelkarte deines Geschäfts in die Wallet deiner Kunden – mit deiner Marke und deinen Belohnungen." },
  { title: "Fairness", text: "Keine versteckten Gebühren. Keine Knebelverträge. Ein faires Preismodell für kleine Unternehmen." }
];

export default function ClientUeberUnsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-brand-500 selection:text-white font-sans overflow-x-clip" ref={containerRef}>
      <Navigation theme="dark" />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="pt-40 lg:pt-52 pb-24 md:pb-40 px-6 max-w-[1400px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/5 border border-white/5 w-fit"
        >
          <span className="w-2 h-2 rounded-full bg-brand-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Über uns</span>
        </motion.div>
        
        <CharReveal text="Wir machen" className="text-5xl sm:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.9]" delay={0.1} />
        <CharReveal text="lokal digital." className="text-5xl sm:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600 mt-2 mb-12" delay={0.3} />
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl md:text-3xl text-white/40 font-medium max-w-3xl leading-relaxed"
        >
          Wir entwickeln digitale Stempelkarten für die Menschen, die lokale Geschäfte führen. Damit du treue Kunden belohnen kannst und dein Team im Alltag den Überblick behält.
        </motion.p>
      </section>

      {/* ─── PARALLAX IMAGE ───────────────────────────────────────── */}
      <section className="px-6 pb-40 max-w-[1400px] mx-auto">
        <div className="w-full h-[50vh] md:h-[70vh] rounded-[3rem] overflow-hidden relative bg-[#111] border border-white/5">
          <motion.div 
            style={{ y: imgY }}
            className="absolute -top-[20%] left-0 w-full h-[140%] opacity-40 bg-gradient-to-tr from-brand-500/20 via-black to-[#111]"
          />
          {/* A beautiful abstract geometric shape to replace an image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen">
            <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full border-[1px] border-brand-500/30 blur-[2px] opacity-50" />
            <div className="absolute w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] rounded-full border-[1px] border-brand-500/50 blur-[1px] opacity-70" />
          </div>
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">Gegründet 2026</span>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">Bremen, DE</span>
          </div>
        </div>
      </section>

      {/* ─── VALUES ───────────────────────────────────────────────── */}
      <section className="px-6 pb-40 max-w-[1400px] mx-auto">
        <div className="border-t border-white/10 pt-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-16">Unsere Werte.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {values.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="flex flex-col gap-6"
              >
                <div className="text-brand-500 font-bold uppercase tracking-widest text-sm">0{i + 1}</div>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{val.title}</h3>
                <p className="text-lg text-white/40 font-medium leading-relaxed">{val.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
