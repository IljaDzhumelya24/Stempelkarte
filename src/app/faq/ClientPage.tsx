"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { faqItems } from "@/lib/data";
import type { FAQItem } from "@/lib/types";

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

// ─── FAQ ITEM COMPONENT ──────────────────────────────────────────
function FaqAccordionItem({ item, isOpen, onClick }: { item: FAQItem, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-black/5 overflow-hidden">
      <button 
        onClick={onClick}
        className="w-full py-8 flex justify-between items-center text-left group"
      >
        <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-[#111] group-hover:text-amber-500 transition-colors pr-8">
          {item.question}
        </h3>
        <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-black/5 group-hover:bg-amber-500/10 transition-colors">
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-4 h-[2px] bg-[#111] absolute"
          />
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 90, opacity: isOpen ? 0 : 1 }}
            className="w-4 h-[2px] bg-[#111] absolute"
          />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="pb-8 text-lg md:text-xl text-black/40 font-medium leading-relaxed max-w-4xl">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ClientFaqPage() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <main className="bg-[#fcfcfc] text-[#111] min-h-screen selection:bg-amber-500 selection:text-black">
      <Navigation />
      
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="pt-40 lg:pt-52 pb-24 px-6 max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-black/5 border border-black/5"
        >
          <span className="w-2 h-2 rounded-full bg-[#111]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111]">Support & Hilfe</span>
        </motion.div>
        
        <CharReveal text="Alle Fragen." className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9]" delay={0.1} />
        <CharReveal text="Klare Antworten." className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-black/40 to-black/10 mt-2" delay={0.3} />
      </section>

      {/* ─── ACCORDION ────────────────────────────────────────────── */}
      <section className="px-6 pb-40 max-w-[1200px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="border-t border-black/10"
        >
          {faqItems.map((item, index) => (
            <FaqAccordionItem 
              key={index} 
              item={item} 
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </motion.div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 pb-32 max-w-[1400px] mx-auto">
        <div className="bg-[#111] text-white rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden flex flex-col items-center">
          {/* Ambient light inside card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter relative z-10">Noch Fragen offen?</h2>
          <p className="mt-6 text-xl text-white/40 font-medium max-w-xl relative z-10">
            Wir sind für dich da. Schreib uns einfach eine Nachricht und wir klären den Rest.
          </p>
          <div className="mt-12 relative z-10">
            <Link 
              href="/kontakt" 
              className="inline-block bg-white text-black px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
