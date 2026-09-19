import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Über uns',
  description: 'Das vierköpfige Gründerteam aus Bremen hinter STAMP.',
};

const team = ['Name', 'Name', 'Name', 'Name'];

export default function UeberUnsPage() {
  return (
    <main>
      <PageHero kicker="Über uns" title="Vier Gründer aus Bremen. Ein sehr alltägliches Problem." text="Klassische Stempelkarten gehen verloren. Smartphones nicht. Deshalb gehört Kundenbindung dorthin, wo Menschen ohnehin Karten aufbewahren." />
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
          {team.map((name, index) => (
            <Reveal className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-soft" key={index}>
              <div className="grid aspect-square place-items-center rounded-3xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-700"><Users size={42} /></div>
              <h2 className="mt-5 text-2xl font-semibold">{name}</h2>
              <p className="mt-1 text-sm text-ink/52">Rolle</p>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-4xl rounded-[30px] bg-ink p-8 text-white sm:p-12">
          <h2 className="text-4xl font-semibold tracking-tight">Wir wollen Kundenbindung für lokale Geschäfte genauso einfach machen wie kontaktloses Bezahlen.</h2>
          <p className="mt-6 leading-8 text-white/66">Wallet ist bereits auf dem Handy. STAMP nutzt genau diesen vertrauten Ort, damit kleine Geschäfte professionell wirken, ohne ihre Kunden in ein neues App-System zu zwingen.</p>
        </div>
      </section>
    </main>
  );
}
