"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WalletCard from "@/components/WalletCard";

// ─── CHARACTER REVEAL ──────────────────────────────────────────────
function CharReveal({ text, className = "", delay = 0 }: { text: string, className?: string, delay?: number }) {
  return (
    <div className={`overflow-hidden w-full flex justify-center pb-[0.15em] ${className}`}>
      <motion.div className="flex flex-wrap justify-center">
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: "110%", rotateX: 90, opacity: 0 }}
            animate={{ y: "0%", rotateX: 0, opacity: 1 }}
            transition={{ duration: 1, delay: delay + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
            style={{ transformOrigin: "bottom" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── SCROLL WORD REVEAL ────────────────────────────────────────────
function ScrollRevealText({ text, className = "" }: { text: string, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.2"] });
  const words = text.split(" ");
  return (
    <div ref={ref} className={className}>
      <p className="flex flex-wrap gap-x-[0.3em] gap-y-1">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return <ScrollWord key={i} word={word} range={[start, end]} progress={scrollYProgress} />;
        })}
      </p>
    </div>
  );
}
function ScrollWord({ word, range, progress }: { word: string, range: [number, number], progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const opacity = useTransform(progress, range, [0.08, 1]);
  return <motion.span style={{ opacity }} className="inline-block">{word}</motion.span>;
}

// ─── 3D TILT CARD ──────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { damping: 30, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { damping: 30, stiffness: 200 });
  const glareOpacity = useSpring(useTransform(y, [-0.5, 0.5], [0, 0.25]), { damping: 30, stiffness: 200 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        x.set((e.clientX - left) / width - 0.5);
        y.set((e.clientY - top) / height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div style={{ opacity: glareOpacity }} className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent pointer-events-none z-50 mix-blend-overlay" />
      {children}
    </motion.div>
  );
}

// ─── STEPS DATA ────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Karte bereitstellen",
    desc: "Platziere den QR-Code deines Geschäfts an der Kasse. Deine Kunden speichern darüber die Karte in ihrer Wallet.",
    card: { stamps: 1, total: 10, name: "CAFE NORD", reward: "Willkommen!", from: "#3b82f6", to: "#1e3a8a" },
  },
  {
    num: "02",
    title: "Stempel vergeben",
    desc: "Dein Team scannt die Kundenkarte beim Besuch und vergibt einen Stempel. So belohnst du Einkäufe direkt im Betriebsalltag.",
    card: { stamps: 6, total: 10, name: "CAFE NORD", reward: "Noch 4!", from: "#f59e0b", to: "#b45309" },
  },
  {
    num: "03",
    title: "Treue belohnen",
    desc: "Du bestimmst Prämie und Stempelanzahl. Ist die Karte voll, löst dein Team die Belohnung ein.",
    card: { stamps: 10, total: 10, name: "CAFE NORD", reward: "🎉 Gratis Kaffee!", from: "#10b981", to: "#047857" },
  },
];

// ─── EDITORIAL VERTICAL RHYTHM STEPS ─────────────────────────────────
function StepsSection() {
  const stepsData = [
    {
      num: "1",
      title: "Karte bereitstellen",
      desc: "Platziere den QR-Code deines Geschäfts an der Kasse. Deine Kunden speichern darüber die Karte direkt in ihrer Apple oder Google Wallet.",
      card: { stamps: 1, total: 10, name: "CAFE NORD", reward: "Gratis Kaffee", from: "#3b82f6", to: "#1e3a8a" },
    },
    {
      num: "2",
      title: "Stempel vergeben",
      desc: "Dein Team scannt die Kundenkarte beim Besuch per Smartphone oder Tablet und vergibt blitzschnell einen Stempel. Keine extra Hardware nötig.",
      card: { stamps: 6, total: 10, name: "CAFE NORD", reward: "Gratis Kaffee", from: "#f59e0b", to: "#b45309" },
    },
    {
      num: "3",
      title: "Treue belohnen",
      desc: "Du bestimmst die Prämie. Ist die Karte voll, löst dein Team die Belohnung per einfachem Scan ein und der Kunde erhält eine frische Karte.",
      card: { stamps: 10, total: 10, name: "CAFE NORD", reward: "Gratis Kaffee", from: "#10b981", to: "#047857" },
    },
  ];

  return (
    <section className="w-full bg-[#fcfcfc] py-24 md:py-40 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-[1000px] px-6 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 md:mb-32"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Der Ablauf</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[#111] leading-[1.05]">
            In 3 simplen Schritten.
          </h2>
        </motion.div>

        <div className="w-full flex flex-col">
          {stepsData.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row items-center gap-12 md:gap-20 py-16 md:py-24 border-t border-black/5"
            >
              
              {/* Text Side */}
              <div className="flex-1 w-full text-center md:text-left">
                <div className="text-[8rem] md:text-[12rem] font-black leading-none tracking-tighter text-black/[0.03] -ml-2 md:-ml-4 mb-4 select-none">
                  0{step.num}
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-[#111] tracking-tight mb-6 -mt-16 md:-mt-24 relative z-10">
                  {step.title}.
                </h3>
                <p className="text-lg md:text-xl text-black/50 font-medium leading-relaxed max-w-sm mx-auto md:mx-0 relative z-10">
                  {step.desc}
                </p>
              </div>

              {/* Visual Side */}
              <div className="flex-1 min-w-0 w-full flex justify-center md:justify-end">
                <div className="relative w-full max-w-[340px] md:max-w-[400px] bg-white rounded-[3rem] px-4 py-8 sm:p-8 md:p-10 flex items-center justify-center border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.03)] group">
                  
                  <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-black/[0.02] to-transparent pointer-events-none" />
                  
                  <WalletCard
                    businessName={step.card.name}
                    currentStamps={step.card.stamps}
                    totalStamps={step.card.total}
                    reward={step.card.reward}
                    colorFrom={step.card.from}
                    colorTo={step.card.to}
                    showQR={i === 0}
                    size="md"
                    className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10 transform transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105 group-hover:-translate-y-2 w-full"
                  />

                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── FEATURES DATA ─────────────────────────────────────────────────
const features = [
  { 
    title: "Apple Wallet", 
    desc: "Deine Kunden speichern die Karte deines Geschäfts nahtlos in Apple Wallet.", 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M15 12C15 12 14.5 14 12 14C9.5 14 9 12 9 12M12 8V8.01"/></svg>
  },
  { 
    title: "Google Wallet", 
    desc: "Vollständige Unterstützung für alle Kunden mit Android-Smartphones.", 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 18H12.01"/></svg>
  },
  { 
    title: "Push-Mitteilungen", 
    desc: "Informiere deine Kunden direkt auf den Sperrbildschirm über neue Angebote.", 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M18 8A6 6 0 0 0 6 8C6 11.5 4 14 4 14H20C20 14 18 11.5 18 8Z"/><path d="M13.73 21A2 2 0 0 1 10.27 21"/></svg>
  },
  { 
    title: "Ohne Hardware", 
    desc: "Dein Team scannt die Karten einfach per Smartphone oder Tablet Kamera.", 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M3 9V5A2 2 0 0 1 5 3H9M15 3H19A2 2 0 0 1 21 5V9M21 15V19A2 2 0 0 1 19 21H15M9 21H5A2 2 0 0 1 3 19V15"/><rect x="9" y="9" width="6" height="6"/></svg>
  },
  { 
    title: "Ortsbasiert", 
    desc: "Erinnere Kunden automatisch an ihre Karte, sobald sie in der Nähe sind.", 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"/><circle cx="12" cy="10" r="3"/></svg>
  },
  { 
    title: "Live Metriken", 
    desc: "Behalte aktive Karten, Scans und eingelöste Prämien in Echtzeit im Blick.", 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M18 20V10M12 20V4M6 20V14"/></svg>
  },
  { 
    title: "Eigenes Branding", 
    desc: "Gestalte die Karte komplett in deinen Farben und mit deinem Logo.", 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>
  },
  { 
    title: "Individuelle Prämien", 
    desc: "Lege genau fest, wie viele Stempel für welche Belohnung nötig sind.", 
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M12 8V12L15 15"/></svg>
  },
];

// ─── MAIN PAGE ─────────────────────────────────────────────────────
export default function ProduktPage() {
  const featRef = useRef<HTMLDivElement>(null);
  const featInView = useInView(featRef, { once: true, margin: "-10%" });
  
  const dashRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: dashScroll } = useScroll({ target: dashRef, offset: ["start end", "end start"] });
  const dashScale = useTransform(dashScroll, [0, 0.4], [0.85, 1]);
  const dashOpacity = useTransform(dashScroll, [0, 0.3], [0, 1]);

  return (
    <main className="bg-[#fcfcfc] text-[#111] min-h-screen relative selection:bg-amber-500 selection:text-black overflow-x-clip">
      <Navigation />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="w-full pt-40 lg:pt-52 pb-20 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 mb-12 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-xl border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#111]">Das Produkt</span>
        </motion.div>

        <CharReveal
          text="So funktioniert"
          className="text-[11.5vw] sm:text-[12vw] md:text-[9vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[0.8] text-[#111]"
          delay={0.1}
        />
        <CharReveal
          text="StampNow."
          className="text-[11.5vw] sm:text-[12vw] md:text-[9vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[0.8] text-transparent bg-clip-text bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 -mt-[0.1em]"
          delay={0.4}
        />

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="mt-10 text-lg md:text-xl text-black/40 font-medium max-w-xl leading-relaxed">
          So nutzt dein Team die digitale Stempelkarte – von der Ausgabe bis zur Belohnung.
        </motion.p>
      </section>

      {/* ─── SCROLL WORD REVEAL ────────────────────────────────────── */}
      <section className="w-full py-24 md:py-40 flex justify-center px-6">
        <ScrollRevealText
          text="Dein Geschäft, deine Karte, deine Regeln. Belohne regelmäßige Besuche und behalte die Nutzung im Blick – mit einem Treueangebot, das dein Team an der Kasse einsetzen kann."
          className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] text-[#111] max-w-[1100px] text-center"
        />
      </section>

      {/* ─── STICKY SCROLL PHONE + STEPS ──────────────────────────── */}
      <StepsSection />

      {/* ─── FEATURES GRID (DARK BENTO) ───────────────────────────────── */}
      <section ref={featRef} className="w-full py-32 md:py-48 bg-[#0a0a0a] text-white overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={featInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
              Alles drin. <span className="text-white/30">Ohne Kompromisse.</span>
            </h2>
            <p className="text-lg md:text-xl text-white/50 font-medium max-w-2xl leading-relaxed">
              Verabschiede dich von Stempelkarten aus Papier. Wir liefern dir alle digitalen Werkzeuge, die du für moderne Kundenbindung brauchst – out of the box.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((f, i) => {
              // Asymmetrical Bento Layout
              let colSpanClass = "md:col-span-1";
              if (i === 2 || i === 3 || i === 6 || i === 7) {
                colSpanClass = "md:col-span-2";
              }

              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={featInView ? { opacity: 1, y: 0 } : {}} 
                  transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 md:p-10 group hover:bg-white/[0.06] transition-colors duration-500 ${colSpanClass}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-8 border border-white/5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:border-transparent transition-all duration-500">
                    {f.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-3">{f.title}</h3>
                  <p className="text-white/50 font-medium leading-relaxed max-w-sm">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DASHBOARD (PREMIUM DARK MODE) ──────────────────────────── */}
      <section ref={dashRef} className="w-full py-12 px-4 md:px-8 bg-[#fcfcfc]">
        <motion.div 
          style={{ scale: dashScale, opacity: dashOpacity }} 
          className="w-full max-w-[1400px] mx-auto py-24 md:py-32 bg-[#0a0a0a] rounded-[3rem] md:rounded-[4rem] flex flex-col items-center px-6 border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.2)] relative overflow-hidden"
        >
          {/* Subtle dark mode ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

          <div className="text-center mb-16 md:mb-24 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
              Volle Kontrolle. <span className="text-white/30">In Echtzeit.</span>
            </h2>
            <p className="text-lg text-white/50 font-medium max-w-xl mx-auto leading-relaxed">
              Verstehe genau, wie dein Angebot genutzt wird. Keine Vermutungen mehr – nur harte Fakten über deine besten Kunden.
            </p>
          </div>

          <div className="w-full max-w-[1000px] flex flex-col md:flex-row gap-6 md:gap-12 relative z-10">
            
            {/* Stats Column */}
            <div className="flex-1 grid grid-cols-2 gap-4 md:gap-6">
              {[
                { val: "1.247", label: "Aktive Karten" },
                { val: "89", label: "Scans heute" },
                { val: "34", label: "Eingelöst" },
                { val: "72%", label: "Wiederkehr" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-center hover:bg-white/[0.05] transition-colors">
                  <span className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">{s.val}</span>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Chart Column */}
            <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[300px]">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Trend</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">Scans der Woche</h3>
              </div>
              <div className="w-full h-32 md:h-40 flex items-end justify-between gap-2 md:gap-3">
                {[30, 55, 40, 85, 60, 100, 75].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }} 
                    whileInView={{ height: `${h}%` }} 
                    transition={{ duration: 1.2, delay: 0.1 + i * 0.05, type: "spring", bounce: 0.3 }} 
                    viewport={{ once: true }} 
                    className={`w-full rounded-t-md ${i === 5 ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-white/10'}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="w-full py-40 md:py-56 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.85] text-[#111] max-w-[900px]">
          Bereit für <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-amber-600">moderne</span> Kundenbindung?
        </h2>
        <p className="mt-8 text-lg text-black/40 font-medium max-w-md">
          Lerne die Stempelkarte für deinen Betrieb kennen. Frage eine unverbindliche Demo an.
        </p>
        <div className="mt-14 flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto">
          <Link href="/demo" className="w-full sm:w-auto relative bg-[#111] text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest text-center hover:scale-105 transition-transform shadow-[0_15px_40px_rgba(0,0,0,0.25)] overflow-hidden group block">
            <span className="relative z-10 group-hover:text-black transition-colors duration-500">Demo anfragen</span>
            <motion.div className="absolute inset-0 bg-amber-500 origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
          </Link>
          <Link href="/preise" className="w-full sm:w-auto bg-white border border-black/10 text-[#111] px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest text-center hover:bg-black/5 hover:scale-105 transition-all duration-300 block">
            Preis ansehen
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
