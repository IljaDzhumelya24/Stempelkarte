"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import WalletCard from "@/components/WalletCard";
import { branchen } from "@/lib/data";

export default function CustomizationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Spread transformations
  const spread1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const spread2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const spread4 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const spread5 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  
  const rot1 = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const rot2 = useTransform(scrollYProgress, [0, 1], [0, -6]);
  const rot4 = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const rot5 = useTransform(scrollYProgress, [0, 1], [0, 12]);

  const cards = branchen.slice(0, 5);

  return (
    <section ref={containerRef} className="py-32 md:py-64 bg-slate-950 overflow-hidden relative">
      <ScrollReveal>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-slate-50 mb-32 text-center tracking-tight leading-tight">
          Deine Marke.<br />
          Deine Karte.
        </h2>
      </ScrollReveal>

      <div className="relative h-[600px] w-full max-w-4xl mx-auto flex items-center justify-center perspective-[1200px]">
        {/* Card 1 */}
        <motion.div 
          className="absolute z-10 w-[280px] sm:w-[320px]"
          style={{ x: spread1, rotate: rot1, translateZ: -40 }}
        >
          <WalletCard
            businessName={cards[0]?.businessName || "Business"}
            currentStamps={3}
            totalStamps={10}
            reward={cards[0]?.reward || "Reward"}
            colorFrom={cards[0]?.colorFrom || "#f59e0b"}
            colorTo={cards[0]?.colorTo || "#d97706"}
          />
        </motion.div>
        
        {/* Card 2 */}
        <motion.div 
          className="absolute z-20 w-[280px] sm:w-[320px]"
          style={{ x: spread2, rotate: rot2, translateZ: -20 }}
        >
          <WalletCard
            businessName={cards[1]?.businessName || "Business"}
            currentStamps={7}
            totalStamps={10}
            reward={cards[1]?.reward || "Reward"}
            colorFrom={cards[1]?.colorFrom || "#3b82f6"}
            colorTo={cards[1]?.colorTo || "#1d4ed8"}
          />
        </motion.div>

        {/* Card 3 (Center) */}
        <motion.div 
          className="absolute z-30 w-[280px] sm:w-[320px]"
          style={{ translateZ: 0 }}
        >
          <WalletCard
            businessName={cards[2]?.businessName || "Business"}
            currentStamps={5}
            totalStamps={10}
            reward={cards[2]?.reward || "Reward"}
            colorFrom={cards[2]?.colorFrom || "#10b981"}
            colorTo={cards[2]?.colorTo || "#047857"}
          />
        </motion.div>

        {/* Card 4 */}
        <motion.div 
          className="absolute z-20 w-[280px] sm:w-[320px]"
          style={{ x: spread4, rotate: rot4, translateZ: -20 }}
        >
          <WalletCard
            businessName={cards[3]?.businessName || "Business"}
            currentStamps={2}
            totalStamps={10}
            reward={cards[3]?.reward || "Reward"}
            colorFrom={cards[3]?.colorFrom || "#ec4899"}
            colorTo={cards[3]?.colorTo || "#be185d"}
          />
        </motion.div>

        {/* Card 5 */}
        <motion.div 
          className="absolute z-10 w-[280px] sm:w-[320px]"
          style={{ x: spread5, rotate: rot5, translateZ: -40 }}
        >
          <WalletCard
            businessName={cards[4]?.businessName || "Business"}
            currentStamps={9}
            totalStamps={10}
            reward={cards[4]?.reward || "Reward"}
            colorFrom={cards[4]?.colorFrom || "#8b5cf6"}
            colorTo={cards[4]?.colorTo || "#6d28d9"}
          />
        </motion.div>
      </div>
    </section>
  );
}
