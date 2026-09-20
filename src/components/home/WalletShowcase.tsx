"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import WalletCard from "@/components/WalletCard";

export default function WalletShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Animation values for the dropping card
  const cardY = useTransform(scrollYProgress, [0.2, 0.5], [-1200, 0]);
  const cardScale = useTransform(scrollYProgress, [0.4, 0.5], [1.5, 0.9]);
  const cardRotate = useTransform(scrollYProgress, [0.2, 0.5], [15, 0]);
  
  // Animation for the "Added to Wallet" modal
  const modalY = useTransform(scrollYProgress, [0.5, 0.6], [100, 0]);
  const modalOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

  return (
    <section ref={containerRef} className="h-[250vh] bg-[#050505] relative w-full border-t border-white/5">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Massive Background Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
           <motion.h2 
             style={{ y: useTransform(scrollYProgress, [0, 1], [200, -200]) }}
             className="text-[15vw] font-bold text-white/5 leading-[0.8] tracking-tighter text-center"
           >
             APPLE<br />WALLET
           </motion.h2>
        </div>

        {/* The iPhone Mockup */}
        <div className="relative z-20 w-[320px] md:w-[360px] h-[650px] md:h-[720px] rounded-[3.5rem] border-[14px] border-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.1),_0_40px_80px_rgba(0,0,0,0.8)] bg-black overflow-hidden flex flex-col items-center pt-12">
          
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a1a] rounded-b-3xl z-50 flex items-center justify-between px-3">
             <div className="w-2 h-2 rounded-full bg-black" />
             <div className="w-2 h-2 rounded-full bg-blue-900/40" />
          </div>

          {/* Wallet App Header */}
          <div className="w-full px-6 mb-8 flex justify-between items-center relative z-10">
            <h3 className="text-white text-3xl font-semibold">Wallet</h3>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white text-xl leading-none font-light">+</span>
            </div>
          </div>

          {/* Fake existing cards stack */}
          <div className="w-full px-4 relative z-10 space-y-[-120px]">
            <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl border border-white/10" />
            <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 shadow-xl border border-white/10" />
          </div>

          {/* The dropping WalletCard */}
          <motion.div
            style={{ y: cardY, scale: cardScale, rotate: cardRotate }}
            className="absolute top-32 left-0 w-full flex justify-center z-30"
          >
            <WalletCard
              businessName="CAFE NORD"
              currentStamps={0}
              totalStamps={10}
              reward="Gratis Kaffee"
              colorFrom="#f59e0b"
              colorTo="#b45309"
              size="md"
              className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-amber-500/30"
            />
          </motion.div>

          {/* Added to Wallet Confirmation Modal */}
          <motion.div
            style={{ y: modalY, opacity: modalOpacity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[85%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-2xl z-40"
          >
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Zu Wallet hinzugefügt</p>
              <p className="text-white/60 text-xs">Bereit zur Nutzung.</p>
            </div>
          </motion.div>

        </div>
        
      </div>
    </section>
  );
}
