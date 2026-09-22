"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import WalletCard from "@/components/WalletCard";

// Ultra-Premium Tilt Card for Wide Layouts
const BentoCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { damping: 40, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { damping: 40, stiffness: 200 });
  const glareOpacity = useSpring(useTransform(y, [-0.5, 0.5], [0, 0.3]), { damping: 40, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set((e.clientX - left) / width - 0.5);
    y.set((e.clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative rounded-[2.5rem] border border-black/5 shadow-[0_15px_50px_rgba(0,0,0,0.06)] overflow-hidden group ${className}`}
    >
      <motion.div 
        style={{ opacity: glareOpacity }}
        className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent pointer-events-none z-50 mix-blend-overlay"
      />
      {children}
    </motion.div>
  );
};

export default function DashboardSection() {
  return (
    <section className="relative w-full py-32 bg-[#fcfcfc] flex flex-col items-center px-6 lg:px-12 z-20">
      
      <div className="text-center max-w-3xl mb-20">
        <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-[#111] leading-[0.9]">
          Deine Kundenbindung. <br/>
          <span className="text-black/30">Zentral verwaltet.</span>
        </h2>
      </div>

      {/* ULTRAWIDE GRID: max-w-[1600px] */}
      <div className="w-full max-w-[1600px] grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 [perspective:2000px]">
        
        {/* CARD 1: Analytics (Span 2) - MASSIVE WIDE CHART */}
        <BentoCard className="col-span-1 md:col-span-2 h-[450px] bg-zinc-50 flex flex-col justify-between">
          <div className="p-10 relative z-10" style={{ transform: "translateZ(40px)" }}>
            <h3 className="text-3xl lg:text-4xl font-bold text-[#111] tracking-tight">Besuche im Blick</h3>
            <p className="text-base lg:text-lg font-medium text-black/50 mt-2 max-w-md">
              Sieh, wie oft deine Karten genutzt und Belohnungen eingelöst werden. Nutze die Übersicht für deine nächsten Aktionen.
            </p>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-[60%] overflow-hidden pointer-events-none" style={{ transform: "translateZ(20px)" }}>
             {/* Stunning Edge-to-Edge Glowing Vector Area Chart */}
             <svg className="w-full h-full text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" preserveAspectRatio="none" viewBox="0 0 1000 200">
               <defs>
                 <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                   <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                 </linearGradient>
               </defs>
               <motion.path 
                 initial={{ pathLength: 0, opacity: 0 }}
                 whileInView={{ pathLength: 1, opacity: 1 }}
                 transition={{ duration: 2, ease: "easeInOut" }}
                 d="M0,150 C150,150 250,50 450,120 C650,190 750,20 1000,60" 
                 fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" 
               />
               <motion.path 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 transition={{ duration: 1, delay: 1 }}
                 d="M0,150 C150,150 250,50 450,120 C650,190 750,20 1000,60 L1000,200 L0,200 Z" 
                 fill="url(#chart-grad)" 
               />
               <motion.circle 
                 initial={{ scale: 0, opacity: 0 }}
                 whileInView={{ scale: 1, opacity: 1 }}
                 transition={{ duration: 0.5, delay: 2, type: "spring" }}
                 cx="1000" cy="60" r="10" fill="white" stroke="currentColor" strokeWidth="4" 
               />
             </svg>
          </div>
        </BentoCard>

        {/* CARD 2: Push Notifications */}
        <BentoCard className="col-span-1 h-[450px] flex flex-col bg-gradient-to-br from-[#111] via-zinc-900 to-black text-white">
          <div className="p-10 relative z-20" style={{ transform: "translateZ(40px)" }}>
            <h3 className="text-3xl font-bold tracking-tight">Kunden erreichen</h3>
            <p className="text-base font-medium text-white/50 mt-2">Mache deine Kunden mit Wallet-Mitteilungen auf Angebote deines Geschäfts aufmerksam.</p>
          </div>
          
          <div className="absolute inset-x-0 bottom-0 top-32 flex justify-center items-center pointer-events-none">
             {/* Huge Floating Notification Mockup */}
             <div className="w-[85%] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.6)]" style={{ transform: "translateZ(60px)" }}>
                <div className="flex gap-4 items-center mb-4">
                   <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                      <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                   </div>
                   <div>
                      <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Apple Wallet</p>
                      <p className="text-[11px] text-white/40 font-medium">Vor 2 Min</p>
                   </div>
                </div>
                <p className="text-white font-bold text-xl">Happy Hour! 🍻</p>
                <p className="text-white/70 text-sm mt-1 font-medium">Dein Gratis-Kaffee ist abholbereit.</p>
             </div>
          </div>
        </BentoCard>

        {/* CARD 3: Location */}
        <BentoCard className="col-span-1 h-[450px] bg-white relative overflow-hidden">
          <div className="p-10 relative z-10" style={{ transform: "translateZ(30px)" }}>
            <h3 className="text-3xl font-bold text-[#111] tracking-tight">Vor Ort präsent</h3>
            <p className="text-base font-medium text-black/50 mt-2">Erinnere Kunden in der Nähe an die Karte deines Geschäfts.</p>
          </div>
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '30px 30px' }} />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-20" style={{ transform: "translateZ(20px)" }}>
             <div className="w-64 h-64 rounded-full border border-blue-500/20 absolute group-hover:scale-125 transition-transform duration-1000 ease-out" />
             <div className="w-40 h-40 rounded-full border border-blue-500/40 absolute group-hover:scale-110 transition-transform duration-700 ease-out" />
             <div className="w-6 h-6 bg-blue-500 rounded-full absolute shadow-[0_0_30px_rgba(59,130,246,1)]" />
             <div className="w-48 h-48 bg-blue-500/10 rounded-full absolute blur-[30px]" />
          </div>
        </BentoCard>

        {/* CARD 4: NFC */}
        <BentoCard className="col-span-1 h-[450px] bg-amber-400 relative">
          <div className="p-10 relative z-10" style={{ transform: "translateZ(30px)" }}>
            <h3 className="text-3xl font-bold text-[#111] tracking-tight">An der Kasse</h3>
            <p className="text-base font-medium text-black/70 mt-2">Dein Team scannt die Kundenkarte und vergibt den nächsten Stempel.</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-20" style={{ transform: "translateZ(40px)" }}>
             <svg className="w-48 h-48 text-black/20 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M12 2v20M17 5S14 8 12 8s-5-3-5-3M17 19s-3-3-5-3-5 3-5 3M19 12a7 7 0 00-14 0" />
             </svg>
          </div>
        </BentoCard>

        {/* CARD 5: Customization */}
        <BentoCard className="col-span-1 h-[450px] overflow-hidden bg-zinc-900 text-white relative">
          <div className="p-10 relative z-20" style={{ transform: "translateZ(50px)" }}>
            <h3 className="text-3xl font-bold tracking-tight">Deine Marke</h3>
            <p className="text-base font-medium text-white/50 mt-2">Gestalte die Karte mit deinem Logo und den Farben deines Geschäfts.</p>
          </div>
          {/* Overlapping Cards */}
          <div className="absolute -bottom-10 -right-20 w-[140%] pointer-events-none flex" style={{ transform: "translateZ(30px)" }}>
            <div className="rotate-[-15deg] group-hover:rotate-[-20deg] group-hover:-translate-x-10 transition-all duration-700 ease-out shadow-2xl">
              <WalletCard businessName="CAFE NORD" currentStamps={3} totalStamps={10} reward="Belohnung" colorFrom="#3b82f6" colorTo="#1e3a8a" showQR={false} size="sm" className="opacity-80 scale-90" />
            </div>
            <div className="absolute top-10 left-10 rotate-[-5deg] group-hover:rotate-[0deg] group-hover:-translate-y-6 transition-all duration-700 ease-out shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
              <WalletCard businessName="DEIN LOGO" currentStamps={7} totalStamps={10} reward="Gratis Kaffee" colorFrom="#f59e0b" colorTo="#b45309" showQR={false} size="sm" />
            </div>
          </div>
        </BentoCard>

      </div>
    </section>
  );
}
