"use client";

import React from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function PilotSection() {
  return (
    <section className="bg-slate-50 py-32 md:py-48 px-6 flex flex-col items-center text-center">
      <ScrollReveal direction="up" className="max-w-3xl flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-slate-950 mb-6">
          Wir starten in Bremen.
        </h2>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-12">
          Wir suchen ausgewählte lokale Geschäfte, die mit uns die digitale Stempelkarte testen.
        </p>
        
        <Link 
          href="/demo"
          className="inline-flex items-center justify-center px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium rounded-full transition-colors text-lg"
        >
          Pilotpartner werden
        </Link>
        <p className="mt-4 text-sm text-zinc-500">
          Kostenlos während der Pilotphase
        </p>
      </ScrollReveal>
    </section>
  );
}
