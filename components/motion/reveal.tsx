'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { revealVariants, staggerVariants } from '@/lib/motion';

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={revealVariants}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerVariants}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedText({ text, className = '' }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={className}
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerVariants}
    >
      {text.split(' ').map((word) => (
        <motion.span className="inline-block overflow-hidden pr-[0.18em]" key={word} variants={revealVariants}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
