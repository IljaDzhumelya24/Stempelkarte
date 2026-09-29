"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
  const textY = useTransform(scrollYProgress, [0.2, 0.6], [100, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <section className="relative w-full py-8 px-4 md:px-8 z-30">
      <motion.div 
        ref={ref}
        style={{ scale: bgScale }}
        className="relative w-full py-48 md:py-64 bg-[#111] text-white flex flex-col items-center justify-center overflow-hidden rounded-[3rem] md:rounded-[4rem]"
      >
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        {/* Animated Concentric Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[1000, 750, 500, 250].map((size, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
              style={{ width: size, height: size }}
            />
          ))}
        </div>

        {/* Pulsing Orb */}
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[1200px] h-[700px] md:h-[1200px] bg-amber-500/15 blur-[180px] rounded-full pointer-events-none"
        />

        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 flex flex-col items-center text-center px-6">
          {/* Stagger Headline */}
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: 120 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-8xl lg:text-[9rem] font-bold tracking-tighter leading-[0.8] text-white"
            >
              Dein Geschäft.
            </motion.h2>
          </div>
          <div className="overflow-hidden mt-2">
            <motion.h2 
              initial={{ y: 120 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[9vw] md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600"
            >
              Deine Stammkunden.
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 text-xl md:text-2xl text-white/40 font-medium tracking-tight max-w-xl leading-relaxed"
          >
            Entdecke, wie du eine digitale Stempelkarte in deinem Betrieb einsetzt. Wir zeigen dir den Ablauf – von der Gestaltung bis zum Stempeln an der Kasse.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-14 flex flex-col sm:flex-row items-center gap-6"
          >
            {/* Primary CTA with Pulse Ring */}
            <div className="relative group">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 bg-amber-500 rounded-full blur-lg"
              />
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0, 0.1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 bg-amber-500 rounded-full blur-xl"
              />
              <Link href="/demo" className="relative flex bg-amber-500 text-black px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:scale-110 transition-all duration-500 shadow-[0_0_80px_rgba(245,158,11,0.4)]">
                Demo anfragen
              </Link>
            </div>
            
            <Link href="/preise" className="flex bg-white/5 backdrop-blur-md border border-white/10 text-white px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-500">
              Preis ansehen
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
