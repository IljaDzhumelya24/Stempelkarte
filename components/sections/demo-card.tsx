'use client';

import { Gift, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { MagneticButton } from '@/components/motion/magnetic-button';

export function DemoStampCard() {
  const [stamps, setStamps] = useState(0);
  const unlocked = stamps >= 10;
  const confetti = Array.from({ length: 18 }, (_, index) => index);
  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.85fr_1fr]">
        <div>
          <p className="section-kicker">Interaktive Demo</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">Tippe dich zur Belohnung.</h1>
          <p className="mt-6 text-lg leading-8 text-ink/62">Diese Demo läuft lokal im Browser. Sie zeigt das Gefühl des Produkts, noch ohne echtes Backend.</p>
        </div>
        <div className="relative overflow-hidden rounded-[34px] bg-ink p-7 text-white shadow-[0_30px_100px_rgba(17,24,39,0.25)]">
          <AnimatePresence>
            {unlocked && confetti.map((dot) => (
              <motion.span
                className="absolute size-2 rounded-full bg-blue-200"
                initial={{ opacity: 0, x: '50%', y: '50%', scale: 0 }}
                animate={{ opacity: [0, 1, 0], x: `${20 + (dot * 17) % 62}%`, y: `${12 + (dot * 29) % 70}%`, scale: [0, 1.6, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, delay: dot * 0.015 }}
                key={dot}
              />
            ))}
          </AnimatePresence>
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">MOIN KIOSK</p>
            <div className="mt-8 flex items-end justify-between">
              <h2 className="text-7xl font-semibold">{stamps}</h2>
              <span className="pb-3 text-white/55">/ 10 Stempel</span>
            </div>
            <div className="mt-8 grid grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <motion.span
                  className={`aspect-square rounded-full border ${index < stamps ? 'border-white bg-white' : 'border-white/25 bg-white/5'}`}
                  animate={index === stamps - 1 ? { scale: [0.7, 1.2, 1] } : undefined}
                  key={index}
                />
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <Gift className="text-blue-200" />
                <p className="font-semibold">{unlocked ? 'Belohnung freigeschaltet.' : `${10 - stamps} Stempel bis zu deinem Gratis-Getränk.`}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <MagneticButton onClick={() => setStamps((value) => Math.min(10, value + 1))} variant="dark">{unlocked ? 'Belohnung einlösen' : 'Stempel hinzufügen'}</MagneticButton>
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold" onClick={() => setStamps(0)}>
                <RotateCcw size={16} /> Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
