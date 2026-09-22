"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WalletCard from "@/components/WalletCard";
import { useState } from "react";

export default function DemoPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <main className="bg-[#050505] text-white min-h-screen relative selection:bg-amber-500 selection:text-black overflow-x-clip font-sans">
      <Navigation theme="dark" />

      {/* ─── MASSIVE AMBIENT MESH GRADIENT BACKGROUND ──────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-amber-500/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#1a1a1a] blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="pt-40 lg:pt-48 pb-32 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        
        {/* LEFT COLUMN: HERO & GLASSMORPHISM FORM */}
        <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 flex flex-col">
          
          {/* Subtle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Demo für dein Geschäft</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6"
          >
            Dein Betrieb. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Deine Karte.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} 
            className="text-lg md:text-xl text-white/40 font-medium max-w-lg leading-relaxed mb-12"
          >
            Erzähle uns von deinem Geschäft. Wir zeigen dir, wie du deine Stempelkarte gestaltest, mit deinem Team Stempel vergibst und die Nutzung im Blick behältst.
          </motion.p>

          {/* Frosted Glass Form Container */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] p-8 md:p-12 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
          >
            <form action="javascript:void(0)" className="flex flex-col gap-6">
              
              {/* Name & Company Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-4">Dein Name</label>
                  <input 
                    type="text" id="name" required placeholder="Max Mustermann"
                    className="w-full bg-white/[0.03] border border-white/5 focus:border-amber-500/50 focus:bg-white/[0.06] rounded-2xl px-6 py-4 text-white outline-none transition-all placeholder:text-white/20 font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-4">Geschäftsname</label>
                  <input 
                    type="text" id="company" required placeholder="Mein Café"
                    className="w-full bg-white/[0.03] border border-white/5 focus:border-amber-500/50 focus:bg-white/[0.06] rounded-2xl px-6 py-4 text-white outline-none transition-all placeholder:text-white/20 font-medium"
                  />
                </div>
              </div>

              {/* Email & Branche Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-4">Geschäftliche E-Mail</label>
                  <input 
                    type="email" id="email" required placeholder="max@beispiel.de"
                    className="w-full bg-white/[0.03] border border-white/5 focus:border-amber-500/50 focus:bg-white/[0.06] rounded-2xl px-6 py-4 text-white outline-none transition-all placeholder:text-white/20 font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="branche" className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-4">Branche</label>
                  <div className="relative">
                    <select 
                      id="branche" required
                      className="w-full bg-white/[0.03] border border-white/5 focus:border-amber-500/50 focus:bg-white/[0.06] rounded-2xl px-6 py-4 text-white outline-none transition-all appearance-none font-medium [&>option]:bg-[#111]"
                    >
                      <option value="" disabled selected className="text-white/20">Bitte wählen</option>
                      <option value="kiosk">Kiosk & Späti</option>
                      <option value="cafe">Café & Bäckerei</option>
                      <option value="barbershop">Barbershop & Friseur</option>
                      <option value="other">Andere</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">▼</div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-white/40 pl-4">Nachricht (Optional)</label>
                <textarea 
                  id="message" rows={3} placeholder="Erzähl uns kurz von deinem Geschäft..."
                  className="w-full bg-white/[0.03] border border-white/5 focus:border-amber-500/50 focus:bg-white/[0.06] rounded-2xl px-6 py-4 text-white outline-none transition-all resize-none placeholder:text-white/20 font-medium"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="mt-4 w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-widest text-center transition-all duration-300 bg-amber-500 text-[#111] hover:bg-amber-400 hover:scale-[1.02] shadow-[0_0_40px_rgba(245,158,11,0.2)]"
              >
                Demo anfragen
              </button>
            </form>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: FLOATING CARD IN SPOTLIGHT */}
        <div className="flex-1 hidden lg:flex flex-col items-center justify-center relative w-full">
          <motion.div
            initial={{ opacity: 0, rotateY: 30, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, rotateY: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[420px] relative [perspective:1200px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Dramatic Spotlight */}
            <div className="absolute inset-0 bg-amber-500/20 blur-[120px] rounded-full transform scale-110" />
            <div className="absolute inset-0 bg-white/5 blur-[50px] rounded-full transform scale-90" />
            
            <motion.div
              animate={{ 
                rotateY: isHovered ? 8 : -8,
                rotateX: isHovered ? -8 : 8,
                y: isHovered ? -15 : 0
              }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            >
              <WalletCard 
                businessName="DEIN GESCHÄFT"
                currentStamps={4}
                totalStamps={10}
                reward="Gratis Artikel"
                colorFrom="#f59e0b"
                colorTo="#d97706"
                size="lg"
                showQR={true}
                className="w-full shadow-[0_60px_120px_rgba(0,0,0,0.8)] border border-white/20"
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
            className="mt-20 text-center relative z-10 bg-black/50 backdrop-blur-md py-3 px-8 rounded-full border border-white/5"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">
              Beispiel deiner Kundenkarte <span className="text-amber-500 ml-2">●</span>
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
