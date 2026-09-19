'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function Marquee({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  const row = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-white/50 py-5">
      <motion.div
        className="flex w-max gap-10"
        animate={reduce ? undefined : { x: ['0%', '-33.333%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {row.map((item, index) => (
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.26em] text-ink/55" key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
