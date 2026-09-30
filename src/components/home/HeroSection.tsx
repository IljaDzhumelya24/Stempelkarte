"use client";

import { useRef, useCallback, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Gift, RotateCcw, Stamp } from "lucide-react";
import WalletCard from "@/components/WalletCard";

const particles = Array.from({ length: 40 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 61 + 13) % 100}%`,
  y: -50 - ((i * 17) % 50),
  x: ((i * 29) % 30) - 15,
  scale: 1 + ((i * 7) % 10) / 10,
  duration: 4 + ((i * 13) % 8),
  delay: (i * 11) % 6,
}));

// ─── CHARACTER REVEAL ──────────────────────────────────────────────
function CharReveal({ text, className = "", delay = 0 }: { text: string, className?: string, delay?: number }) {
  const reducedMotion = useReducedMotion();
  
  let charCount = 0;

  return (
    <div className={`overflow-hidden w-full flex justify-center pb-[0.15em] ${className}`}>
      <motion.div className="flex flex-wrap justify-center gap-x-[0.25em]">
        {text.split(" ").map((word, wordIdx) => (
          <span key={wordIdx} className="inline-flex whitespace-nowrap">
            {word.split("").map((char, i) => {
              const currentDelay = delay + charCount * 0.035;
              charCount++;
              return (
                <motion.span
                  key={i}
                  initial={reducedMotion ? false : { y: "110%", rotateX: 90, opacity: 0 }}
                  animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: currentDelay, ease: [0.16, 1, 0.3, 1] }}
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

// ─── FLOATING PARTICLES ────────────────────────────────────────────
function Particles() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden motion-safe:md:block" aria-hidden="true">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${i % 3 === 0 ? 'w-1.5 h-1.5 bg-brand-500/20' : 'w-1 h-1 bg-black/[0.06]'}`}
          style={{ left: particle.left, top: particle.top }}
          animate={reducedMotion ? { opacity: 0 } : {
            y: [0, particle.y, 0],
            x: [0, particle.x, 0],
            opacity: [0, 0.8, 0],
            scale: [0, particle.scale, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── TICKER ────────────────────────────────────────────────────────
function Ticker() {
  const reducedMotion = useReducedMotion();
  const items = ["Für lokale Geschäfte", "Digitale Stempelkarten", "Dein Logo", "Deine Belohnungen", "Kundenbindung", "Stempel vergeben", "Besuche auswerten", "Stammkunden gewinnen"];
  return (
    <div className="w-full overflow-hidden border-t border-black/5 bg-white/30 backdrop-blur-sm">
      <motion.div animate={reducedMotion ? { x: 0 } : { x: [0, -2000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex gap-16 py-4 whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/10 flex items-center gap-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500/40" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── MAIN HERO ─────────────────────────────────────────────────────
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [stamps, setStamps] = useState(7);
  const [redeemed, setRedeemed] = useState(false);
  const complete = stamps === 10;

  const resetDemo = () => {
    setStamps(7);
    setRedeemed(false);
  };

  const tryStamp = () => {
    if (complete) {
      setStamps(0);
      setRedeemed(true);
    } else {
      setStamps((value) => Math.min(value + 1, 10));
      setRedeemed(false);
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Cinematic scroll transforms
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const scaleTitle = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const opacityTitle = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // 3D Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { damping: 20, stiffness: 100, mass: 0.8 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { damping: 20, stiffness: 100, mass: 0.8 });
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]), { damping: 25, stiffness: 120 });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]), { damping: 25, stiffness: 120 });
  const shadowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [40, -40]), { damping: 30, stiffness: 150 });
  const shadowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [40, -40]), { damping: 30, stiffness: 150 });
  const glare = useTransform(
    [glareX, glareY],
    ([horizontal, vertical]) => `radial-gradient(ellipse 60% 40% at ${horizontal} ${vertical}, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)`
  );

  const handleMouseMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  }, [mouseX, mouseY, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-canvas flex flex-col items-center justify-start overflow-hidden"
    >
      <Particles />

      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={prefersReducedMotion ? { opacity: 0.15 } : { scale: [1, 1.5, 1], x: [0, 150, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 left-[20%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-brand-500/15 rounded-full blur-[100px] md:blur-[150px]"
        />
        <motion.div
          animate={prefersReducedMotion ? { opacity: 0.08 } : { scale: [1, 1.3, 1], x: [0, -100, 0], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-[30%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand-300/15 rounded-full blur-[90px] md:blur-[130px]"
        />
      </div>

      {/* ─── THE TITLE ─────────────────────────────────────────────── */}
      <motion.div
        style={prefersReducedMotion ? undefined : { y: yTitle, scale: scaleTitle, opacity: opacityTitle }}
        className="relative z-10 flex flex-col items-center text-center w-full pt-32 md:pt-36 lg:pt-44 px-4"
      >
        <h1 className="sr-only">Dein Geschäft. Mehr Stammkunden.</h1>
        <div aria-hidden="true" className="w-full">
        <CharReveal
          text="Dein Geschäft."
          className="text-[13vw] sm:text-[12vw] md:text-[11vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[0.9] text-[#111]"
          delay={0.1}
        />
        <CharReveal
          text="Mehr Stammkunden."
          className="text-[10vw] sm:text-[9vw] md:text-[8vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[1] text-transparent bg-clip-text bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 mt-1 md:-mt-[0.1em]"
          delay={0.55}
        />
        </div>
      </motion.div>

      {/* ─── THE IPHONE ────────────────────────────────────────────── */}
      <motion.div
        className="relative z-20 w-full flex flex-col items-center mt-10 md:-mt-4 lg:-mt-16 px-5 pb-16 md:pb-36 [perspective:1800px]"
      >
        <motion.div
          onPointerMove={handleMouseMove}
          onPointerLeave={handleMouseLeave}
          onPointerCancel={handleMouseLeave}
          style={{ rotateX: prefersReducedMotion ? 0 : rotateX, rotateY: prefersReducedMotion ? 0 : rotateY }}
          className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[380px]"
        >
          {/* Dynamic Ground Shadow */}
          <motion.div
            style={{ x: shadowX, y: shadowY }}
            className="absolute top-[90%] left-1/2 -translate-x-1/2 w-[70%] md:w-[55%] h-24 md:h-40 bg-black/25 blur-[50px] md:blur-[70px] rounded-[100%]"
          />

          {/* PHONE ENTRY ANIMATION */}
          <motion.div
            initial={false}
            animate={{ y: prefersReducedMotion ? 0 : [40, 0] }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Space Black Titanium Outer Frame */}
            <div className="relative p-[2px] sm:p-[3px] md:p-[4px] rounded-[2.8rem] sm:rounded-[3.5rem] md:rounded-[4.5rem] bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-950 shadow-[0_40px_80px_rgba(0,0,0,0.4),0_20px_40px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.3)] md:shadow-[0_80px_160px_rgba(0,0,0,0.5),0_30px_60px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.3)]">
              {/* Inner Titanium Top Highlight (subtle on dark) */}
              <div className="absolute inset-[1px] rounded-[2.75rem] sm:rounded-[3.45rem] md:rounded-[4.45rem] bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none z-10" />
              {/* Inner Titanium Bottom Edge */}
              <div className="absolute inset-[1px] rounded-[2.75rem] sm:rounded-[3.45rem] md:rounded-[4.45rem] bg-gradient-to-t from-white/5 via-transparent to-transparent pointer-events-none z-10" />
              
              {/* Side Buttons */}
              <div className="absolute -left-[2px] md:-left-[3px] top-[20%] w-[2px] md:w-[4px] h-5 md:h-7 bg-gradient-to-b from-zinc-500 to-zinc-800 rounded-l-full shadow-[-1px_0_2px_rgba(0,0,0,0.4)] md:shadow-[-2px_0_4px_rgba(0,0,0,0.4)]" />
              <div className="absolute -left-[2px] md:-left-[3px] top-[30%] w-[2px] md:w-[4px] h-10 md:h-16 bg-gradient-to-b from-zinc-500 to-zinc-800 rounded-l-full shadow-[-1px_0_2px_rgba(0,0,0,0.4)] md:shadow-[-2px_0_4px_rgba(0,0,0,0.4)]" />
              <div className="absolute -left-[2px] md:-left-[3px] top-[42%] w-[2px] md:w-[4px] h-10 md:h-16 bg-gradient-to-b from-zinc-500 to-zinc-800 rounded-l-full shadow-[-1px_0_2px_rgba(0,0,0,0.4)] md:shadow-[-2px_0_4px_rgba(0,0,0,0.4)]" />
              <div className="absolute -right-[2px] md:-right-[3px] top-[30%] w-[2px] md:w-[4px] h-14 md:h-20 bg-gradient-to-b from-zinc-500 to-zinc-800 rounded-r-full shadow-[1px_0_2px_rgba(0,0,0,0.4)] md:shadow-[2px_0_4px_rgba(0,0,0,0.4)]" />

              {/* The Screen Assembly */}
              <div
                className="relative isolate flex w-full aspect-[9/19.5] rounded-[2.8rem] sm:rounded-[3.3rem] md:rounded-[4.2rem] bg-black overflow-hidden [transform:translateZ(0)]"
              >
                {/* INTERACTIVE GLASS GLARE */}
                <motion.div
                  className="absolute inset-0 pointer-events-none z-[60]"
                  style={{
                    background: glare,
                  }}
                />

                {/* Screen Edge Light Bleed */}
                <div className="absolute inset-0 rounded-[2.8rem] sm:rounded-[3.3rem] md:rounded-[4.2rem] shadow-[inset_0_0_15px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] md:shadow-[inset_0_0_30px_rgba(255,255,255,0.06),inset_0_2px_0_rgba(255,255,255,0.1)] pointer-events-none z-50" />

                {/* Dynamic Island */}
                <div className="absolute top-[8px] md:top-[12px] left-1/2 -translate-x-1/2 w-[90px] md:w-[126px] h-[24px] md:h-[34px] bg-black rounded-full z-40 flex items-center justify-between px-3 md:px-4 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
                  <div className="w-[6px] md:w-[10px] h-[6px] md:h-[10px] rounded-full bg-[#1a1a2e] border border-white/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.08)]" />
                  <div className="w-[6px] md:w-[10px] h-[6px] md:h-[10px] rounded-full bg-[#0a0a1a] border border-white/5" />
                </div>

                {/* ─── SCREEN CONTENT ─────────────────────────────── */}
                <div className="relative w-full h-full bg-surface flex flex-col items-center">
                  
                  {/* Status Bar */}
                  <div className="w-full flex justify-between items-center px-6 md:px-8 pt-[12px] md:pt-[14px] text-[10px] md:text-[12px] font-semibold text-black relative z-30">
                    <span>9:41</span>
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                      <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.34V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                    </div>
                  </div>

                  {/* Wallet Header */}
                  <div className="w-full px-5 pt-8 pb-3 flex justify-between items-end relative z-20">
                    <h2 className="text-[#111] text-[28px] md:text-[34px] font-bold tracking-tight">Wallet</h2>
                    <button type="button" onClick={resetDemo} aria-label="Demo zurücksetzen" title="Demo zurücksetzen" className="size-9 rounded-full bg-black/5 flex items-center justify-center text-[#111] hover:bg-black/10">
                      <RotateCcw size={15} aria-hidden="true" />
                    </button>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 w-full flex flex-col items-center relative px-4">
                    {/* Background Cards Stack */}
                    <div aria-hidden="true" className="w-full h-8 md:h-12 relative z-10 shrink-0">
                      <div className="absolute inset-x-0 top-0 h-28 rounded-[1.25rem] bg-gradient-to-br from-[#1d1d1f] to-zinc-800 shadow-xl border border-white/5" />
                      <div className="absolute inset-x-0 top-4 h-28 rounded-[1.25rem] bg-gradient-to-br from-zinc-100 to-zinc-200 border border-black/5 shadow-xl" />
                    </div>

                    {/* THE STEMPELKARTE DROP */}
                    <motion.div
                      initial={false}
                      animate={{ y: prefersReducedMotion ? 0 : [-24, 0] }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full z-30 mt-4 md:mt-8"
                    >
                      <WalletCard
                        businessName="CAFE NORD"
                        currentStamps={7}
                        totalStamps={10}
                        reward="Gratis Kaffee"
                        colorFrom="#3058ff"
                        colorTo="#203ab5"
                        showQR={true}
                        size="fluid"
                        interactive={false}
                        className="shadow-[0_20px_60px_rgba(48,88,255,0.4)] border border-white/30"
                      />
                    </motion.div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-[4px] md:bottom-[6px] left-1/2 -translate-x-1/2 w-[100px] md:w-[140px] h-[4px] md:h-[5px] bg-black/20 rounded-full z-40" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Ticker */}
      <div className="relative w-full z-30">
        <Ticker />
      </div>
    </section>
  );
}
