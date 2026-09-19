import type { Metadata } from 'next';
import { siteConfig } from '@/data/site-config';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Platzhalter für das Impressum von STAMP.',
};

export default function ImpressumPage() {
  return (
    <main>
      <PageHero kicker="Rechtliches" title="Impressum." text="Platzhalterseite. Vor Veröffentlichung müssen Anbieterkennzeichnung, Vertretungsberechtigte und rechtliche Angaben ergänzt werden." />
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-ink/10 bg-white p-8 shadow-soft">
          <p className="font-semibold">{siteConfig.siteName}</p>
          <p className="mt-2 text-ink/62">{siteConfig.location}</p>
          <p className="mt-2 text-ink/62">{siteConfig.email}</p>
        </div>
      </section>
    </main>
  );
}
