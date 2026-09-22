"use client";

import { useRef, useState } from "react";
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

// ─── FEATURES DATA ─────────────────────────────────────────────────
const features = [
  { title: "Apple Wallet", desc: "Deine Kunden speichern die Karte deines Geschäfts in Apple Wallet.", icon: "🍎" },
  { title: "Google Wallet", desc: "Erreiche auch Kunden, die Google Wallet auf ihrem Android-Smartphone nutzen.", icon: "🤖" },
  { title: "Kunden erreichen", desc: "Informiere deine Kunden mit Wallet-Mitteilungen über Angebote deines Geschäfts.", icon: "🔔" },
  { title: "Stempel vergeben", desc: "Dein Team scannt die Karte per Smartphone oder Tablet an der Kasse.", icon: "⚡" },
  { title: "Vor Ort präsent", desc: "Erinnere Kunden in der Nähe an die Karte deines Geschäfts.", icon: "📍" },
  { title: "Nutzung auswerten", desc: "Behalte aktive Karten, vergebene Stempel und eingelöste Prämien im Blick.", icon: "📊" },
  { title: "Dein Markendesign", desc: "Gestalte deine Kundenkarte mit dem Logo und den Farben deines Geschäfts.", icon: "🎨" },
  { title: "Deine Belohnungen", desc: "Lege Prämie und Stempelanzahl passend zu deinem Sortiment fest.", icon: "🔒" },
];

// ─── STICKY SCROLL PHONE SECTION ──────────────────────────────────
function StickyStepsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [currentStep, setCurrentStep] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.3) setCurrentStep(0);
    else if (latest < 0.65) setCurrentStep(1);
    else setCurrentStep(2);
  });

  const card = steps[currentStep].card;

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-[#050505]">
      <div className="sticky top-0 h-[100dvh] flex items-center overflow-hidden">
        
        {/* Massive Background Numbers */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <AnimatePresence>
            <motion.span
              key={currentStep}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute text-[40vw] font-black text-white/[0.015] tracking-tighter"
            >
              {steps[currentStep].num}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-24 relative z-10">
          
          {/* LEFT: Step Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left justify-center mt-10 lg:mt-0">
            {/* Grid container perfectly stacks text blocks without hardcoded heights */}
            <div className="grid w-full">
              <AnimatePresence>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="col-start-1 row-start-1 flex flex-col items-center lg:items-start w-full"
                >
                  <span className="flex items-center gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-amber-500 mb-3 md:mb-6">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Schritt {steps[currentStep].num}
                  </span>
                  <h3 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.1] md:leading-[1] mb-3 md:mb-6">
                    {steps[currentStep].title}.
                  </h3>
                  <p className="text-sm sm:text-lg md:text-xl text-white/50 font-medium leading-relaxed max-w-md">
                    {steps[currentStep].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 sm:gap-3 mt-6 lg:mt-10 relative z-20">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 sm:w-12 bg-amber-500' : 'w-3 sm:w-4 bg-white/10'}`} />
              ))}
            </div>
          </div>

          {/* RIGHT: The Phone */}
          {/* We wrap the phone in a fixed-height container on mobile to prevent the flex layout from exploding its height */}
          <div className="w-full lg:w-1/2 relative h-[420px] sm:h-[500px] lg:h-auto flex justify-center lg:items-center mt-6 lg:mt-0">
            <div className="absolute top-0 lg:relative lg:top-auto origin-top transform scale-[0.65] sm:scale-[0.75] md:scale-[0.85] lg:scale-100">
              
              {/* Ambient Phone Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-amber-500/15 blur-[100px] rounded-full pointer-events-none z-0" />
              
              {/* Ground Shadow */}
              <div className="absolute top-[95%] left-1/2 -translate-x-1/2 w-[70%] h-24 md:h-32 bg-black blur-[50px] rounded-[100%] z-0" />
              
              {/* Space Black Frame */}
              <div className="relative p-[2px] sm:p-[3px] md:p-[4px] rounded-[2.8rem] sm:rounded-[3.3rem] md:rounded-[4rem] bg-gradient-to-b from-zinc-700 via-zinc-800 to-black shadow-[0_40px_80px_rgba(0,0,0,0.5)] md:shadow-[0_60px_120px_rgba(0,0,0,0.6)] z-10">
                <div className="absolute inset-[1px] rounded-[2.75rem] sm:rounded-[3.25rem] md:rounded-[3.95rem] bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none z-10" />
                
                {/* Buttons */}
                <div className="absolute -left-[2px] md:-left-[3px] top-[20%] w-[2px] md:w-[4px] h-5 md:h-7 bg-gradient-to-b from-zinc-600 to-black rounded-l-full" />
                <div className="absolute -left-[2px] md:-left-[3px] top-[30%] w-[2px] md:w-[4px] h-10 md:h-14 bg-gradient-to-b from-zinc-600 to-black rounded-l-full" />
                <div className="absolute -left-[2px] md:-left-[3px] top-[42%] w-[2px] md:w-[4px] h-10 md:h-14 bg-gradient-to-b from-zinc-600 to-black rounded-l-full" />
                <div className="absolute -right-[2px] md:-right-[3px] top-[30%] w-[2px] md:w-[4px] h-14 md:h-18 bg-gradient-to-b from-zinc-600 to-black rounded-r-full" />

                <div className="relative w-[300px] md:w-[380px] aspect-[9/19.5] rounded-[2.6rem] md:rounded-[3.8rem] bg-black overflow-hidden flex flex-col items-center">
                  {/* Dynamic Island */}
                  <div className="absolute top-[8px] md:top-[11px] left-1/2 -translate-x-1/2 w-[90px] md:w-[120px] h-[24px] md:h-[32px] bg-black rounded-full z-40 flex items-center justify-between px-3 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
                    <div className="w-[6px] md:w-[9px] h-[6px] md:h-[9px] rounded-full bg-[#1a1a2e] border border-white/10" />
                    <div className="w-[6px] md:w-[9px] h-[6px] md:h-[9px] rounded-full bg-[#0a0a1a]" />
                  </div>

                  {/* Dark Mode Screen */}
                  <div className="absolute inset-0 bg-black overflow-hidden flex flex-col items-center border border-white/[0.03]">
                    
                    {/* Glass Glare */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none z-50" />

                    <div className="w-full flex justify-between items-center px-6 md:px-9 pt-[10px] md:pt-[15px] text-[10px] md:text-[12px] font-semibold text-white z-30 relative">
                      <span>9:41</span>
                      <div className="flex items-center gap-1 md:gap-1.5 opacity-90">
                        <svg className="w-[14px] md:w-4 h-[14px] md:h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                        <svg className="w-[14px] md:w-4 h-[14px] md:h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.34V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                      </div>
                    </div>
                    <div className="w-full px-5 md:px-6 pt-8 md:pt-10 pb-3 md:pb-4 flex justify-between items-end z-20 relative">
                      <h2 className="text-white text-[24px] md:text-[30px] font-bold tracking-tight">Wallet</h2>
                      <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-white/10 flex items-center justify-center"><span className="text-white text-base md:text-lg font-medium">+</span></div>
                    </div>
                    
                    {/* Background Cards (Dark Mode) */}
                    <div className="mt-2 space-y-[-120px] md:space-y-[-140px] z-10 relative w-[260px] md:w-[320px]">
                      <div className="w-full h-44 md:h-48 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-xl border border-white/10" />
                      <div className="w-full h-44 md:h-48 rounded-2xl bg-gradient-to-br from-zinc-900 to-black shadow-xl border border-white/5" />
                    </div>
                    
                    {/* Animated Card Switch */}
                    <div className="absolute top-[160px] md:top-[200px] left-1/2 -translate-x-1/2 w-full flex justify-center z-30">
                      <div className="relative w-full flex justify-center">
                        <AnimatePresence>
                          <motion.div
                            key={currentStep}
                            initial={{ y: 60, scale: 0.9, filter: "blur(10px)", opacity: 0 }}
                            animate={{ y: 0, scale: 1, filter: "blur(0px)", opacity: 1 }}
                            exit={{ y: -60, scale: 1.05, filter: "blur(10px)", opacity: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-0 w-full flex justify-center"
                          >
                            {/* Mobile Card (sm) */}
                            <div className="block md:hidden">
                              <WalletCard
                                businessName={card.name}
                                currentStamps={card.stamps}
                                totalStamps={card.total}
                                reward={card.reward}
                                colorFrom={card.from}
                                colorTo={card.to}
                                showQR={currentStep === 0}
                                size="sm"
                                className="shadow-[0_20px_50px_rgba(245,158,11,0.2)] border border-white/10"
                              />
                            </div>
                            {/* Desktop Card (md) */}
                            <div className="hidden md:block">
                              <WalletCard
                                businessName={card.name}
                                currentStamps={card.stamps}
                                totalStamps={card.total}
                                reward={card.reward}
                                colorFrom={card.from}
                                colorTo={card.to}
                                showQR={currentStep === 0}
                                size="md"
                                className="shadow-[0_30px_70px_rgba(245,158,11,0.3)] border border-white/10"
                              />
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-[4px] md:bottom-[5px] left-1/2 -translate-x-1/2 w-[100px] md:w-[120px] h-[4px] bg-white/20 rounded-full z-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
          text="Stempelkarte."
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
      <StickyStepsSection />

      {/* ─── FEATURES GRID ────────────────────────────────────────── */}
      <section ref={featRef} className="w-full py-32 bg-[#fcfcfc] [perspective:2000px]">
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={featInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-bold tracking-tighter text-[#111] mb-6">
            Alles drin. <span className="text-black/20">Ohne Kompromisse.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={featInView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="text-lg text-black/40 font-medium mb-20 max-w-lg">
            Die Werkzeuge für dein Treueangebot.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 60, scale: 0.9 }} animate={featInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.05 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}>
                <TiltCard className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 cursor-default hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-shadow duration-500 h-full">
                  <span className="text-4xl" style={{ transform: "translateZ(30px)" }}>{f.icon}</span>
                  <h3 className="text-lg font-bold text-[#111] tracking-tight" style={{ transform: "translateZ(20px)" }}>{f.title}</h3>
                  <p className="text-sm text-black/40 font-medium leading-relaxed" style={{ transform: "translateZ(10px)" }}>{f.desc}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DASHBOARD (SCALE-IN) ─────────────────────────────────── */}
      <section ref={dashRef} className="w-full py-8 px-4 md:px-8">
        <motion.div style={{ scale: dashScale, opacity: dashOpacity }} className="w-full py-32 md:py-40 bg-[#111] text-white rounded-[3rem] md:rounded-[4rem] overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Volle Kontrolle. <br /><span className="text-white/25">In Echtzeit.</span>
            </h2>
            <p className="text-lg text-white/35 font-medium mb-20 max-w-lg">
              Sieh im Dashboard, wie dein Treueangebot genutzt wird: aktive Karten, vergebene Stempel und eingelöste Belohnungen.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { val: "1.247", label: "Aktive Karten" },
                { val: "89", label: "Scans heute" },
                { val: "34", label: "Eingelöst" },
                { val: "72%", label: "Wiederkehr" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-white/5 border border-white/5 rounded-2xl p-6">
                  <span className="text-3xl md:text-4xl font-bold tracking-tighter text-white">{s.val}</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mt-2">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="w-full h-48 bg-white/[0.02] border border-white/5 rounded-2xl flex items-end px-4 md:px-6 pb-4 md:pb-6 gap-2 md:gap-3">
              {[30, 55, 40, 85, 60, 95, 75].map((h, i) => (
                <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} transition={{ duration: 1.2, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }} className={`flex-1 rounded-t-sm md:rounded-t-lg ${i === 5 ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/8'}`} />
              ))}
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
            Tarife ansehen
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
