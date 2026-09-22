"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import WalletCard from "@/components/WalletCard";

export default function StorytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate horizontal translation based on scroll progress
  // 4 items = we need to shift by -75% of the inner width
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={containerRef} className="h-[400vh] bg-[#050505] relative">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* Huge Background Typography matching horizontal scroll */}
        <motion.div 
          style={{ x }}
          className="absolute top-1/2 -translate-y-1/2 left-0 flex px-8 pointer-events-none opacity-5 z-0"
        >
          <h2 className="text-[30vw] font-bold whitespace-nowrap text-white leading-none tracking-tighter">
            WORKFLOW WORKFLOW WORKFLOW WORKFLOW
          </h2>
        </motion.div>

        {/* Horizontal Scrolling Track */}
        <motion.div 
          style={{ x }}
          className="flex h-full w-[400vw] items-center relative z-10"
        >
          {/* Step 1 */}
          <div className="w-[100vw] flex flex-col items-center justify-center px-4">
            <div className="glass-panel p-16 rounded-[3rem] relative group">
              <div className="absolute -inset-4 bg-amber-500/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="text-[12rem] md:text-[16rem] font-light text-white/10 leading-none absolute -top-16 -left-8 pointer-events-none">1</div>
              <h3 className="text-4xl md:text-6xl font-medium text-white mb-6 tracking-tight relative z-10">Scan.</h3>
              <p className="text-xl text-zinc-400 font-light max-w-sm relative z-10">
                Stelle deinen QR-Code an der Kasse bereit und lade deine Kunden ein, die Karte deines Geschäfts zu nutzen.
              </p>
              
              <div className="mt-12 p-8 border border-white/10 rounded-2xl bg-black/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                <div className="w-full aspect-square border-2 border-dashed border-amber-500/50 rounded-xl flex items-center justify-center relative">
                   <div className="w-1/2 h-[2px] bg-amber-500 absolute top-1/2 -translate-y-1/2 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_20px_#f59e0b]" />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="w-[100vw] flex flex-col items-center justify-center px-4">
            <div className="glass-panel p-16 rounded-[3rem] relative group">
              <div className="text-[12rem] md:text-[16rem] font-light text-white/10 leading-none absolute -top-16 -left-8 pointer-events-none">2</div>
              <h3 className="text-4xl md:text-6xl font-medium text-white mb-6 tracking-tight relative z-10">Save.</h3>
              <p className="text-xl text-zinc-400 font-light max-w-sm relative z-10">
                Deine Kunden speichern die Karte in ihrer Wallet. Deine Marke bleibt nach dem Besuch bei ihnen.
              </p>
              
              <div className="mt-12 relative w-full flex justify-center">
                <WalletCard businessName="CAFE NORD" currentStamps={0} totalStamps={10} reward="Gratis Kaffee" colorFrom="#1f2937" colorTo="#111827" size="md" className="scale-90 shadow-2xl" />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="w-[100vw] flex flex-col items-center justify-center px-4">
            <div className="glass-panel p-16 rounded-[3rem] relative group">
              <div className="absolute -inset-4 bg-amber-500/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="text-[12rem] md:text-[16rem] font-light text-white/10 leading-none absolute -top-16 -left-8 pointer-events-none">3</div>
              <h3 className="text-4xl md:text-6xl font-medium text-white mb-6 tracking-tight relative z-10">Collect.</h3>
              <p className="text-xl text-zinc-400 font-light max-w-sm relative z-10">
                Dein Team scannt die Kundenkarte und vergibt den Stempel für den Einkauf. Der neue Stand erscheint auf der Karte.
              </p>
              
              <div className="mt-12 relative w-full flex justify-center">
                <WalletCard businessName="CAFE NORD" currentStamps={7} totalStamps={10} reward="Gratis Kaffee" colorFrom="#f59e0b" colorTo="#b45309" size="md" className="scale-100 shadow-[0_0_50px_rgba(245,158,11,0.2)]" />
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="w-[100vw] flex flex-col items-center justify-center px-4">
            <div className="glass-panel p-16 rounded-[3rem] relative group border-amber-500/30">
              <div className="text-[12rem] md:text-[16rem] font-light text-amber-500/10 leading-none absolute -top-16 -left-8 pointer-events-none">4</div>
              <h3 className="text-4xl md:text-6xl font-medium text-transparent bg-clip-text text-gradient-amber mb-6 tracking-tight relative z-10">Reward.</h3>
              <p className="text-xl text-zinc-400 font-light max-w-sm relative z-10">
                Ist die Karte voll, löst dein Team die Prämie ein. Du entscheidest, welche Belohnung zu deinem Geschäft passt.
              </p>
              
              <div className="mt-12 relative w-full flex justify-center">
                <WalletCard businessName="CAFE NORD" currentStamps={10} totalStamps={10} reward="Gratis Kaffee" colorFrom="#111111" colorTo="#000000" size="md" className="scale-110 shadow-2xl border border-amber-500/50" />
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
