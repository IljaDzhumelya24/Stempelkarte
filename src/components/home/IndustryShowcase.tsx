"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const industries = [
  {
    id: "cafe",
    title: "Cafés",
    subtitle: "Mach aus Gästen Stammgäste.",
    desc: "Belohne regelmäßige Kaffeebesuche mit einer Prämie, die zu deinem Café passt. Dein Team stempelt direkt an der Theke.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1600",
    stat: "Treue",
    statLabel: "belohnen",
  },
  {
    id: "salon",
    title: "Salons",
    subtitle: "Gib Kunden einen Grund zurückzukommen.",
    desc: "Lege fest, nach wie vielen Besuchen du eine Behandlung oder ein Produkt als Dankeschön vergibst.",
    img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1600",
    stat: "Besuche",
    statLabel: "belohnen",
  },
  {
    id: "retail",
    title: "Einzelhandel",
    subtitle: "Stärke die Bindung zu deinem Laden.",
    desc: "Ob Kiosk oder Boutique: Gib deinen Kunden mit jeder Stempelkarte einen Anreiz für den nächsten Einkauf bei dir.",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600",
    stat: "Lokal",
    statLabel: "binden",
  },
  {
    id: "gastro",
    title: "Gastro",
    subtitle: "Vom Gast zum Stammgast.",
    desc: "Mache deinen Mittagstisch zur festen Anlaufstelle. Du bestimmst, nach wie vielen Besuchen es ein Dessert oder Menü als Prämie gibt.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1600",
    stat: "Stammgäste",
    statLabel: "gewinnen",
  }
];

export default function IndustryShowcase() {
  const [active, setActive] = useState(industries[0]);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="py-32 lg:py-48 w-full bg-[#f7f7f7] flex flex-col items-center overflow-hidden z-20 relative">
      <div className="w-full max-w-[1600px] px-8 md:px-16 xl:px-32 flex flex-col lg:flex-row gap-16 xl:gap-24 items-stretch min-h-[700px]">
        
        {/* Left: Interactive Typography */}
        <div className="w-full lg:w-[45%] flex flex-col">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 mb-10 lg:mb-16"
          >
            Für deinen Geschäftsalltag
          </motion.h2>
          
          <div className="flex flex-col gap-1">
            {industries.map((item, i) => {
              const isActive = active.id === item.id;
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -60 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }}
                  onMouseEnter={() => setActive(item)}
                  onClick={() => setActive(item)}
                  className="cursor-pointer flex flex-col relative py-3 group"
                >
                  {/* Active Indicator */}
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-500 rounded-full origin-top"
                    animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />

                  <motion.h3 
                    animate={{ 
                      x: isActive ? 20 : 0,
                      color: isActive ? "#111111" : "#11111115",
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.9] group-hover:text-black/25 transition-colors duration-300"
                  >
                    {item.title}.
                  </motion.h3>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden pl-6"
                      >
                        <div className="pt-6 pb-3 flex flex-col gap-3">
                          <div className="flex items-baseline gap-4">
                            <motion.span 
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2, type: "spring" }}
                              className="text-3xl font-bold text-amber-500"
                            >
                              {item.stat}
                            </motion.span>
                            <span className="text-xs font-bold uppercase tracking-widest text-black/30">{item.statLabel}</span>
                          </div>
                          <h4 className="text-lg font-bold text-[#111]">{item.subtitle}</h4>
                          <p className="text-base text-black/50 font-medium max-w-md leading-relaxed">{item.desc}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Clip-Path Reveal Image */}
        <div className="w-full lg:w-[55%] h-[500px] md:h-[600px] lg:h-auto relative rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.12)] bg-zinc-200">
           <AnimatePresence mode="wait">
             <motion.div
                key={active.id}
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0"
             >
               <motion.img
                  src={active.img}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover"
                  alt={active.title}
               />
             </motion.div>
           </AnimatePresence>
           
           {/* Bottom Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />
           
           {/* Floating Badge */}
           <AnimatePresence mode="wait">
             <motion.div 
               key={active.id + "-badge"}
               initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
               animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
               exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
               transition={{ delay: 0.4, duration: 0.6 }}
               className="absolute bottom-8 left-8 right-8 z-20"
             >
               <span className="inline-flex items-center gap-3 px-5 py-3 bg-white/15 backdrop-blur-2xl border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-[0.2em]">
                 <span className="w-2 h-2 rounded-full bg-amber-500" />
                 {active.title} • {active.stat} {active.statLabel}
               </span>
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
