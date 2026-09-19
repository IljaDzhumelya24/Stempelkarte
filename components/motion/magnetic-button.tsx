'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';

type Props = {
  href?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'dark';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
};

export function MagneticButton({ href, children, variant = 'primary', className = '', onClick, type = 'button' }: Props) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(useTransform(mx, [-80, 80], [-4, 4]), { stiffness: 180, damping: 18 });
  const y = useSpring(useTransform(my, [-80, 80], [-4, 4]), { stiffness: 180, damping: 18 });
  const styles = {
    primary: 'bg-ink text-white shadow-[0_18px_44px_rgba(17,24,39,0.22)] hover:bg-blue-700',
    secondary: 'border border-ink/10 bg-white/70 text-ink hover:border-blue-500/40 hover:bg-white',
    dark: 'bg-white text-ink hover:bg-blue-50',
  };
  const cls = `inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition ${styles[variant]} ${className}`;
  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set(event.clientX - rect.left - rect.width / 2);
    my.set(event.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };
  const content = (
    <motion.span style={{ x, y }} className="relative z-10">
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link className={cls} href={href} onMouseMove={handleMove} onMouseLeave={handleLeave}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cls} onMouseMove={handleMove} onMouseLeave={handleLeave} onClick={onClick} type={type}>
      {content}
    </button>
  );
}
