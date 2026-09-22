"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

function Counter({ from, to }: { from: number; to: number }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString("de-DE"));

  useEffect(() => {
    const controls = animate(count, to, { duration: 2.5, ease: "easeOut", delay: 0.2 });
    return controls.stop;
  }, [count, to]);

  return <motion.span>{rounded}</motion.span>;
}

export default function DashboardSection() {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [colors.length]);

  return (
    <section className="relative w-full py-24 md:py-40 bg-[#f2f2f7] text-[#111] flex flex-col items-center px-5 md:px-10 overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem] z-20">
      
      {/* Dynamic Background Mesh */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none" />

      {/* Title */}
      <div className="text-center max-w-4xl mb-20 md:mb-32 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8"
        >
          Dein Geschäft.<br/>
          <span className="text-black/30">Deine Regeln.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-black/50 font-medium max-w-2xl mx-auto px-4"
        >
          Keine Zettelwirtschaft. Kein teures NFC-Terminal. Alles, was du für moderne Kundenbindung brauchst, direkt in deinem Dashboard.
        </motion.p>
      </div>

      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 relative z-10">
        
        {/* CARD 1: ANALYTICS (col-span-8) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-8 bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all border border-black/5 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 overflow-hidden relative group"
        >
           {/* Abstract Animated Chart */}
           <div className="absolute bottom-0 right-10 w-[60%] h-[70%] opacity-40 flex items-end justify-between gap-2 md:gap-4 pointer-events-none">
              {[40, 70, 45, 90, 65, 110, 85].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: h + "%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                  className="w-full bg-black/5 rounded-t-xl"
                />
              ))}
           </div>
           
           <div className="relative z-10 h-full flex flex-col justify-between min-h-[300px]">
              <div className="mb-16">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Live Insights</p>
                <div className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-none mb-3">
                  <Counter from={0} to={8492} />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold">+124 diese Woche</span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Daten in Echtzeit.</h3>
                <p className="text-black/50 text-lg max-w-md leading-relaxed">Verstehe endlich, wer deine besten Kunden sind, wann sie kommen und welche Prämien am besten funktionieren.</p>
              </div>
           </div>
        </motion.div>

        {/* CARD 2: QR SCAN (col-span-4) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-4 bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all border border-black/5 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 overflow-hidden relative flex flex-col justify-between min-h-[360px] group"
        >
           <div className="absolute top-10 right-10 w-32 md:w-40 h-32 md:h-40 opacity-10 group-hover:opacity-20 transition-opacity duration-500 text-black pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
                <path d="M3 9V5a2 2 0 0 1 2-2h4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M9 21H5a2 2 0 0 1-2-2v-4" />
                <rect x="7" y="7" width="4" height="4" fill="currentColor" />
                <rect x="13" y="13" width="4" height="4" fill="currentColor" />
                <rect x="13" y="7" width="4" height="4" fill="currentColor" />
                <rect x="7" y="13" width="4" height="4" fill="currentColor" />
              </svg>
              {/* Animated Laser */}
              <motion.div 
                animate={{ y: [0, 160, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-[2px] bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]"
              />
           </div>
           
           <div className="mt-auto relative z-10 pt-32">
             <h3 className="text-3xl font-bold mb-4 tracking-tight">Kamera an. Fertig.</h3>
             <p className="text-black/50 text-base md:text-lg leading-relaxed">Dein Team scannt den QR-Code des Kunden einfach per Handykamera. Der Stempel ist vergeben.</p>
           </div>
        </motion.div>

        {/* CARD 3: CUSTOMIZATION (col-span-12) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-12 bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all border border-black/5 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 md:gap-20 overflow-hidden relative"
        >
           
           <div className="flex-1 relative z-10 w-full">
             <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Branding</p>
             <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter leading-[1.05]">Perfekt auf deine Marke abgestimmt.</h3>
             <p className="text-black/50 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
               Passe Farben, Logo und Prämien mit wenigen Klicks an. Deine Kunden sehen keine Fremdwerbung, sondern zu 100% dein Geschäft.
             </p>
             <div className="flex gap-3 md:gap-4">
               {colors.map((c, i) => (
                 <button 
                   key={i} 
                   onClick={() => setColorIndex(i)}
                   aria-label={`Farbe ${i}`}
                   className={`w-10 md:w-12 h-10 md:h-12 rounded-full border-2 transition-all duration-300 ${colorIndex === i ? 'border-[#111] scale-110 shadow-[0_4px_15px_rgba(0,0,0,0.1)]' : 'border-transparent scale-100 hover:scale-105'}`}
                   style={{ backgroundColor: c }}
                 />
               ))}
             </div>
           </div>

           <div className="flex-1 w-full flex justify-center md:justify-end relative">
             <motion.div 
               animate={{ backgroundColor: colors[colorIndex] }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="w-full max-w-[320px] aspect-[4/5] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col border border-black/5"
             >
                {/* Minimal Card UI inside - This stays white because it sits on a solid colored background */}
                <div className="w-16 h-16 rounded-2xl bg-white/20 mb-6 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div className="w-3/4 h-6 bg-white/50 rounded-full mb-3" />
                <div className="w-1/2 h-4 bg-white/30 rounded-full mb-10" />
                
                {/* Stamps Grid */}
                <div className="grid grid-cols-4 gap-3 mt-auto">
                   {[...Array(8)].map((_, i) => (
                     <div key={i} className="aspect-square rounded-full border-2 border-white/40 flex items-center justify-center">
                        {i < 3 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} className="w-3/5 h-3/5 rounded-full bg-white" />}
                     </div>
                   ))}
                </div>
             </motion.div>
           </div>
        </motion.div>

      </div>
    </section>
  );
}
