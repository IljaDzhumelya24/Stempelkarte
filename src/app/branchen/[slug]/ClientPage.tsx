"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WalletCard from "@/components/WalletCard";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import type { BrancheData } from "@/lib/types";

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

// Client Component receives the raw unwrapped data from the Server Component
export default function BrancheSubpageClient({ data }: { data: BrancheData }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yPhone = useTransform(heroScroll, [0, 1], [0, 300]);
  const opacityPhone = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <main className="bg-[#fcfcfc] text-[#111] min-h-screen relative selection:bg-amber-500 selection:text-black overflow-x-clip">
      <Navigation theme="dark" />

      {/* ─── HERO SECTION (Cinematic Dark Mode) ──────────────────── */}
      <section ref={heroRef} className="w-full min-h-dvh flex flex-col justify-center relative bg-[#050505] text-white pt-32 pb-20 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-[30%] left-[60%] w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
          
          {/* LEFT: Text */}
          <div className="w-full lg:w-3/5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
                Stempelkarte für {data.name}
              </span>
            </motion.div>

            <CharReveal 
              text={data.name + "."} 
              className="text-[18vw] md:text-[10vw] font-bold tracking-tight md:tracking-[-0.05em] leading-[0.8] mb-8 pb-4" 
              delay={0.1} 
            />
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-2xl text-white/50 font-medium max-w-xl leading-relaxed"
            >
              {data.description}
            </motion.p>
          </div>

          {/* RIGHT: Floating Card */}
          <motion.div 
            style={{ y: yPhone, opacity: opacityPhone }}
            className="w-full lg:w-2/5 flex justify-center lg:justify-end mt-12 lg:mt-0"
          >
            <motion.div
              initial={{ opacity: 0, rotateY: 30, scale: 0.8, filter: "blur(20px)" }}
              animate={{ opacity: 1, rotateY: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative [perspective:1200px]"
            >
              <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full transform scale-90" />
              <WalletCard 
                businessName={data.businessName}
                currentStamps={data.currentStamps}
                totalStamps={data.totalStamps}
                reward={data.reward}
                colorFrom={data.colorFrom}
                colorTo={data.colorTo}
                size="lg"
                showQR={true}
                className="shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 origin-center transform md:scale-110 lg:scale-125"
              />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ─── BENEFITS LIST (Massive Editorial Style) ─────────────── */}
      <section className="w-full py-32 md:py-48 px-6 md:px-16 bg-[#fcfcfc] max-w-[1400px] mx-auto">
        <div className="mb-24 md:mb-32">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#111] max-w-3xl leading-[1.1]">
            Warum eine Stempelkarte für dein <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-amber-700">{data.name}</span>?
          </h2>
        </div>

        <div className="flex flex-col gap-12 md:gap-24">
          {data.benefits.map((benefit: string, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row gap-6 md:gap-16 border-t border-black/5 pt-12 md:pt-16"
            >
              <div className="text-2xl md:text-3xl font-bold tracking-tighter text-black/20">
                0{i + 1}
              </div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#111] max-w-4xl leading-[1.1]">
                {benefit}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="w-full py-8 px-4 md:px-8 bg-[#f5f5f7]">
        <div className="w-full py-40 md:py-56 bg-black text-white rounded-[3rem] md:rounded-[4rem] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.85] relative z-10 max-w-[900px]">
            Kundenbindung für dein <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-amber-600">Geschäft?</span>
          </h2>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 relative z-10 w-full sm:w-auto">
            <Link href="/demo" className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform">
              Demo für deinen Betrieb
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
