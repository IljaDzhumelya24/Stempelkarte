"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { navLinks } from "@/lib/data";

export default function Navigation({ theme = "light" }: { theme?: "light" | "dark" }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    setIsScrolled(latest > 50);
    
    // Hide header on scroll down, show on scroll up (only if mobile menu is closed)
    if (latest > 100 && latest > previous && !mobileMenuOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const isDark = theme === "dark" && !isScrolled && !mobileMenuOpen;
  const textColor = isDark ? "text-white" : "text-[#111]";
  const textMuted = isDark ? "text-white/50" : "text-[#111]/40";
  const hoverTextColor = isDark ? "hover:text-white" : "hover:text-[#111]";
  const lineColor = isDark ? "bg-white" : "bg-[#111]";

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-colors duration-500 ${
          isScrolled || mobileMenuOpen
            ? "bg-white/90 backdrop-blur-xl border-b border-black/5" 
            : "bg-transparent"
        }`}
      >
        <div className="px-6 lg:px-12 py-6 flex items-center justify-between w-full mx-auto">
          
          {/* Left: Brand */}
          <div className="flex-1 flex justify-start z-50">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-xl font-bold tracking-tighter uppercase flex items-baseline transition-colors duration-500 ${textColor}`}
            >
              Stempelkarte<span className="text-amber-500 font-serif ml-0.5 text-3xl leading-[0.5]">.</span>
            </Link>
          </div>

          {/* Center: Desktop Links */}
          <nav className="flex-1 hidden md:flex justify-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-colors duration-500 relative group py-2 ${textMuted} ${hoverTextColor}`}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={`absolute left-1/2 bottom-0 w-0 h-[2px] -translate-x-1/2 group-hover:w-full transition-all duration-500 ease-[0.16,1,0.3,1] ${lineColor}`} />
              </Link>
            ))}
          </nav>

          {/* Right: CTA & Mobile Toggle */}
          <div className="flex-1 flex justify-end items-center gap-6 z-50">
            <Link
              href="/demo"
              className={`hidden sm:flex group items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 hover:text-amber-500 ${textColor}`}
            >
              <span>Demo Starten</span>
              <div className={`w-8 h-[2px] transition-colors duration-500 relative overflow-hidden group-hover:bg-amber-500 ${lineColor}`}>
                <motion.div 
                  className="absolute inset-0 bg-amber-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[0.16,1,0.3,1]"
                />
              </div>
            </Link>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5 relative"
            >
              <div className={`w-6 h-[1.5px] transition-transform transition-colors duration-300 ${lineColor} ${mobileMenuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
              <div className={`w-6 h-[1.5px] transition-transform transition-colors duration-300 ${lineColor} ${mobileMenuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[90] bg-white pt-32 px-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-4xl font-bold tracking-tighter uppercase text-[#111]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 pt-8 border-t border-black/10"
              >
                <Link
                  href="/demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-3 text-lg font-bold uppercase tracking-widest text-amber-500"
                >
                  Demo Starten →
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
