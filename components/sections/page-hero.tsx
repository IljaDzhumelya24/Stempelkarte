import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/reveal';

export function PageHero({
  kicker,
  title,
  text,
  children,
  dark = false,
}: {
  kicker: string;
  title: string;
  text: string;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={`px-5 pb-16 pt-36 sm:px-8 ${dark ? 'bg-ink text-white' : ''}`}>
      <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1fr_.72fr]">
        <Reveal>
          <p className={dark ? 'font-mono text-xs font-bold uppercase tracking-[0.22em] text-blue-200' : 'section-kicker'}>{kicker}</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">{title}</h1>
          <p className={`mt-7 max-w-2xl text-lg leading-8 ${dark ? 'text-white/65' : 'text-ink/62'}`}>{text}</p>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
