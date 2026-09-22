"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight, LogIn, Menu, Stamp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Navigation({ theme = "light" }: { theme?: "light" | "dark" }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [mobileMenuOpen]);

  const isDark = theme === "dark" && !isScrolled;
  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-6 sm:pt-5">
      <div className={`mx-auto max-w-7xl rounded-[1.5rem] border transition-[background-color,box-shadow,border-color] duration-300 motion-reduce:transition-none ${
        isDark
          ? "border-white/15 bg-zinc-950 text-white shadow-[0_12px_40px_-16px_rgba(0,0,0,0.5)]"
          : `border-black/[0.08] bg-white text-zinc-950 ${isScrolled || mobileMenuOpen ? "shadow-[0_16px_48px_-18px_rgba(0,0,0,0.25)]" : "shadow-[0_8px_32px_-16px_rgba(0,0,0,0.16)]"}`
      }`}>
        <div className="flex h-[68px] items-center justify-between gap-3 px-3 sm:h-[76px] sm:px-5">
          <Link href="/" onClick={closeMenu} aria-label="Stempelkarte – Startseite" className={`group flex shrink-0 items-center gap-2.5 rounded-xl ${focusRing}`}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-400 text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-transform group-hover:-rotate-6 motion-reduce:transform-none sm:size-10">
              <Stamp size={21} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="text-[15px] font-extrabold tracking-[-0.055em] sm:text-xl">STEMPELKARTE<span className="text-amber-500">.</span></span>
          </Link>

          <nav aria-label="Hauptnavigation" className={`hidden items-center gap-1 rounded-full p-1 lg:flex ${isDark ? "bg-white/5" : "bg-zinc-100/80"}`}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={`rounded-full px-4 py-2.5 text-xs font-semibold transition-colors ${focusRing} ${
                isActive(link.href) ? "bg-amber-400 text-zinc-950 shadow-sm" : isDark ? "text-white/65 hover:bg-white/10 hover:text-white" : "text-zinc-500 hover:bg-white hover:text-zinc-950"
              }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link href="/anmelden" onClick={closeMenu} className={`hidden min-h-11 items-center gap-2 rounded-full px-3 text-xs font-semibold transition-colors sm:inline-flex ${focusRing} ${isDark ? "hover:bg-white/10" : "hover:bg-zinc-100"}`}>
              <LogIn size={15} aria-hidden="true" />Anmelden
            </Link>
            <Link href="/demo" onClick={closeMenu} className={`group hidden min-h-11 items-center gap-3 rounded-full bg-amber-400 py-2.5 pl-5 pr-2.5 text-xs font-bold text-zinc-950 transition-colors hover:bg-amber-300 sm:inline-flex ${focusRing}`}>
              Demo anfragen
              <span className="flex size-7 items-center justify-center rounded-full bg-zinc-950 text-white"><ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" /></span>
            </Link>
            <button ref={toggleRef} type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" className={`flex size-11 items-center justify-center rounded-full border lg:hidden ${focusRing} ${isDark ? "border-white/15 hover:bg-white/10" : "border-black/10 hover:bg-zinc-100"}`}>
              {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <nav id="mobile-navigation" aria-label="Mobile Navigation" hidden={!mobileMenuOpen} className={`max-h-[calc(100dvh-110px)] overflow-y-auto overscroll-contain border-t px-4 pb-5 pt-4 lg:hidden ${isDark ? "border-white/10" : "border-black/5"}`} data-lenis-prevent>
          <p className={`mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-white/40" : "text-zinc-400"}`}>Kundenbindung für dein Geschäft.</p>
          {navLinks.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={closeMenu} aria-current={isActive(link.href) ? "page" : undefined} className={`mb-1 flex items-center justify-between gap-4 rounded-xl px-3 py-4 text-xl font-semibold tracking-tight ${focusRing} ${isActive(link.href) ? "bg-amber-400 text-zinc-950" : isDark ? "hover:bg-white/5" : "hover:bg-zinc-50"}`}>
              <span className="flex items-center gap-4"><span className="text-[10px] font-medium tabular-nums opacity-40">0{index + 1}</span>{link.label}</span><ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link href="/anmelden" onClick={closeMenu} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold ${focusRing} ${isDark ? "border-white/15 hover:bg-white/10" : "border-black/10 hover:bg-zinc-50"}`}><LogIn size={16} aria-hidden="true" />Anmelden</Link>
            <Link href="/demo" onClick={closeMenu} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 text-sm font-bold text-zinc-950 hover:bg-amber-300 ${focusRing}`}>Demo anfragen<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
