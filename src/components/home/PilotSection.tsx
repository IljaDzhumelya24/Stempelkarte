"use client";

import React from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { pricingPlan } from '@/lib/data';

export default function PilotSection() {
  return (
    <section className="bg-slate-50 py-32 md:py-48 px-6 flex flex-col items-center text-center">
      <ScrollReveal direction="up" className="max-w-3xl flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-slate-950 mb-6">
          Für Geschäfte in ganz Deutschland.
        </h2>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-12">
          Nutze StampNow für die digitale Kundenbindung in deinem Geschäft. Wir zeigen dir, wie du deine Karte gestaltest und mit deinem Team Stempel vergibst.
        </p>
        
        <Link 
          href="/demo"
          className="inline-flex items-center justify-center px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium rounded-full transition-colors text-lg"
        >
          Demo anfragen
        </Link>
        <p className="mt-4 text-sm text-zinc-500">
          {pricingPlan.price} € pro Monat + einmalig {pricingPlan.setupFee} € Einrichtung
        </p>
      </ScrollReveal>
    </section>
  );
}
