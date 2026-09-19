import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Store } from 'lucide-react';
import { businessTypes } from '@/data/site-config';
import { PageHero } from '@/components/sections/page-hero';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Branchen',
  description: 'Digitale Stempelkarten für Kioske, Cafes, Bäckereien, Barbershops, Restaurants und lokale Dienstleister.',
};

export default function BranchenPage() {
  return (
    <main>
      <PageHero kicker="Branchen" title="Für Geschäfte, die von Wiederkommen leben." text="Jede Branche hat ihre eigene Routine. STAMP bleibt einfach genug für den Tresen und flexibel genug für unterschiedliche Rewards." />
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {businessTypes.map((type) => (
            <Reveal className="min-h-72 rounded-[30px] border border-ink/10 bg-white p-7 shadow-soft" key={type.slug}>
              <Store style={{ color: type.accent }} />
              <h2 className="mt-12 text-3xl font-semibold">{type.title}</h2>
              <p className="mt-3 text-ink/62">{type.description}</p>
              {['kiosk', 'cafe', 'barbershop'].includes(type.slug) ? (
                <Link className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-700" href={`/branchen/${type.slug}`}>Landingpage öffnen <ArrowRight size={18} /></Link>
              ) : (
                <p className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-ink/42">Weitere Seite folgt</p>
              )}
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
