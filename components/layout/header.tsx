'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { navigationItems, siteConfig } from '@/data/site-config';
import { MagneticButton } from '@/components/motion/magnetic-button';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 transition-all duration-300 sm:px-5 ${scrolled ? 'border border-ink/10 bg-paper/82 shadow-[0_18px_60px_rgba(17,24,39,0.08)] backdrop-blur-xl' : 'border border-transparent bg-transparent'}`}>
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-full bg-ink text-sm font-black text-white">S</span>
          <span className="text-sm font-black tracking-[0.18em]">{siteConfig.siteName}</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {navigationItems.map((item) => (
            <Link className={`text-sm font-medium transition hover:text-blue-600 ${pathname === item.href ? 'text-blue-600' : 'text-ink/62'}`} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <MagneticButton href="/demo" variant="secondary" className="min-h-10 px-4">Demo ansehen</MagneticButton>
          <MagneticButton href="/kontakt" className="min-h-10 px-4">Jetzt starten</MagneticButton>
        </div>
        <button className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menü öffnen">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div className={`fixed inset-0 z-[-1] bg-ink text-white transition-all duration-500 lg:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="flex h-full flex-col justify-between px-6 pb-10 pt-28">
          <nav className="grid gap-5">
            {[...navigationItems, { label: 'Demo', href: '/demo' }, { label: 'FAQ', href: '/faq' }].map((item) => (
              <Link className="border-b border-white/10 pb-5 text-4xl font-semibold tracking-tight" href={item.href} key={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <MagneticButton href="/kontakt" variant="dark" onClick={() => setOpen(false)}>Kostenlose Demo anfragen</MagneticButton>
        </div>
      </div>
    </header>
  );
}
