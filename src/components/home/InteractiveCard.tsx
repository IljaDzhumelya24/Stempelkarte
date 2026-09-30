"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import WalletCard from "@/components/WalletCard";

export default function InteractiveCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <section ref={containerRef} className="relative h-[150vh] bg-[#050505] w-full overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            style={{ scale, opacity }}
            className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full border border-brand-500/20 flex items-center justify-center"
          >
            <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full border border-brand-500/30 flex items-center justify-center">
               <div className="w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full border border-brand-500/40 border-dashed animate-[spin_20s_linear_infinite]" />
            </div>
          </motion.div>
        </div>

        <motion.h2 
          style={{ opacity, WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
          className="text-[12vw] sm:text-[10vw] font-bold text-transparent absolute top-10 pointer-events-none uppercase tracking-tighter"
        >
          MAGIC
        </motion.h2>

        <motion.div 
          style={{ scale, rotate }}
          className="relative z-20"
        >
          <div className="absolute inset-0 bg-brand-500 blur-[100px] opacity-40 rounded-full scale-150 animate-pulse" />
          <WalletCard
             businessName="PREMIUM"
             currentStamps={9}
             totalStamps={10}
             reward="Echtes Erlebnis"
             colorFrom="#111111"
             colorTo="#222222"
             showQR={true}
             size="lg"
             className="shadow-[0_0_100px_rgba(48,88,255,0.3)] border border-brand-500/50 backdrop-blur-xl bg-black/50"
          />
        </motion.div>

        <motion.h2 
          style={{ opacity, WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
          className="text-[12vw] sm:text-[10vw] font-bold text-transparent absolute bottom-10 pointer-events-none uppercase tracking-tighter"
        >
          MOMENTS
        </motion.h2>

      </div>
    </section>
  );
}
