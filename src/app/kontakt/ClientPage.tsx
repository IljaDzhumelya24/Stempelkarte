"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// ─── CHARACTER REVEAL ──────────────────────────────────────────────
function CharReveal({ text, className = "", delay = 0 }: { text: string, className?: string, delay?: number }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div className="flex flex-wrap">
        {text.split("").map((char, i) => (
          <motion.span 
            key={i} 
            initial={{ y: "110%", opacity: 0 }} 
            animate={{ y: "0%", opacity: 1 }} 
            transition={{ duration: 0.8, delay: delay + i * 0.02, ease: [0.16, 1, 0.3, 1] }} 
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ClientKontaktPage() {
  return (
    <main className="bg-[#fcfcfc] text-[#111] min-h-screen selection:bg-amber-500 selection:text-black font-sans overflow-x-clip relative">
      <Navigation />

      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-black/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4" />

      <div className="pt-40 lg:pt-52 pb-32 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32 relative z-10">
        
        {/* LEFT COLUMN: INFO */}
        <div className="flex-1 flex flex-col">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-black/5 border border-black/5 w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111]">Kontakt</span>
          </motion.div>

          <CharReveal text="Lass uns" className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9]" delay={0.1} />
          <CharReveal text="sprechen." className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 mb-8" delay={0.3} />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} 
            className="text-xl md:text-2xl text-black/40 font-medium max-w-md leading-relaxed mb-16"
          >
            Fragen zu Preisen, Funktionen oder individuellen Anpassungen? Wir helfen dir gerne weiter.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col gap-10"
          >
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-black/30 mb-3">E-Mail</h4>
              <a href="mailto:hallo@stempelkarte.app" className="text-3xl font-bold tracking-tight text-[#111] hover:text-amber-500 transition-colors">
                hallo@stempelkarte.app
              </a>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-black/30 mb-3">Telefon</h4>
              <a href="tel:+49123456789" className="text-3xl font-bold tracking-tight text-[#111] hover:text-amber-500 transition-colors">
                +49 (0) 123 456 789
              </a>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-black/30 mb-3">Büro</h4>
              <address className="text-xl font-medium text-[#111] not-italic leading-relaxed">
                Stempelkarte GmbH<br />
                Musterstraße 123<br />
                10115 Berlin, Deutschland
              </address>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <div className="flex-1 w-full lg:max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full bg-white rounded-[2.5rem] border border-black/5 p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.05)]"
          >
            <form action="javascript:void(0)" className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-black/40 pl-4">Name</label>
                  <input 
                    type="text" id="name" required placeholder="Dein Name"
                    className="w-full bg-black/[0.03] border border-black/5 focus:border-amber-500/50 focus:bg-white rounded-2xl px-6 py-4 text-[#111] outline-none transition-all placeholder:text-black/20 font-medium"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="text-[10px] font-bold uppercase tracking-widest text-black/40 pl-4">Unternehmen</label>
                  <input 
                    type="text" id="company" placeholder="Optional"
                    className="w-full bg-black/[0.03] border border-black/5 focus:border-amber-500/50 focus:bg-white rounded-2xl px-6 py-4 text-[#111] outline-none transition-all placeholder:text-black/20 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-black/40 pl-4">E-Mail Adresse</label>
                <input 
                  type="email" id="email" required placeholder="hallo@beispiel.de"
                  className="w-full bg-black/[0.03] border border-black/5 focus:border-amber-500/50 focus:bg-white rounded-2xl px-6 py-4 text-[#111] outline-none transition-all placeholder:text-black/20 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-black/40 pl-4">Nachricht</label>
                <textarea 
                  id="message" rows={5} required placeholder="Wie können wir dir helfen?"
                  className="w-full bg-black/[0.03] border border-black/5 focus:border-amber-500/50 focus:bg-white rounded-2xl px-6 py-4 text-[#111] outline-none transition-all resize-none placeholder:text-black/20 font-medium"
                />
              </div>

              <button 
                type="submit"
                className="mt-4 w-full py-5 rounded-2xl font-bold text-sm uppercase tracking-widest text-center transition-all duration-300 bg-[#111] text-white hover:bg-amber-500 hover:text-black hover:scale-[1.02] shadow-lg"
              >
                Nachricht Senden
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
