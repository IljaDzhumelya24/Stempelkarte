'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import { pricingPlans } from '@/data/site-config';
import { MagneticButton } from '@/components/motion/magnetic-button';

export function PricingTable() {
  const [yearly, setYearly] = useState(false);
  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <p className="max-w-2xl text-ink/62">Alle Preise sind vorläufige Demo-Preise und Platzhalter. Sie sind keine verbindlichen Preisangaben.</p>
          <div className="flex w-fit rounded-full border border-ink/10 bg-white p-1">
            <button className={`rounded-full px-4 py-2 text-sm font-semibold ${!yearly ? 'bg-ink text-white' : 'text-ink/55'}`} onClick={() => setYearly(false)}>Monatlich</button>
            <button className={`rounded-full px-4 py-2 text-sm font-semibold ${yearly ? 'bg-ink text-white' : 'text-ink/55'}`} onClick={() => setYearly(true)}>Jährlich - Demo Rabatt</button>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const price = yearly ? Math.round(plan.price * 10) : plan.price;
            return (
              <article className={`rounded-[30px] border p-7 shadow-soft ${plan.highlighted ? 'border-blue-500 bg-ink text-white' : 'border-ink/10 bg-white'}`} key={plan.name}>
                <p className="font-mono text-xs uppercase tracking-[0.22em] opacity-60">{plan.name}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-6xl font-semibold">{price} €</span>
                  <span className="pb-2 opacity-60">/ {yearly ? 'Jahr' : 'Monat'}</span>
                </div>
                <p className="mt-5 min-h-14 opacity-70">{plan.description}</p>
                <ul className="mt-8 grid gap-3">
                  {plan.features.map((feature) => (
                    <li className="flex gap-3 text-sm" key={feature}><Check size={18} className="shrink-0 text-blue-400" /> {feature}</li>
                  ))}
                </ul>
                <MagneticButton href="/kontakt" variant={plan.highlighted ? 'dark' : 'primary'} className="mt-8 w-full">Demo anfragen</MagneticButton>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
