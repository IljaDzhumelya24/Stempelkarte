"use client";

import Link from "next/link";

const columns = [
  {
    title: "Produkt",
    links: [
      { label: "Funktionen", href: "/produkt" },
      { label: "Preise", href: "/preise" },
      { label: "Demo", href: "/demo" }
    ],
  },
  {
    title: "Branchen",
    links: [
      { label: "Alle Branchen", href: "/branchen" },
      { label: "Kiosk", href: "/branchen/kiosk" },
      { label: "Café", href: "/branchen/cafe" },
      { label: "Barbershop", href: "/branchen/barbershop" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { label: "Über uns", href: "/ueber-uns" },
      { label: "Kontakt", href: "/kontakt" },
      { label: "FAQ", href: "/faq" }
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] text-white border-t border-black/10 relative z-30">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-12">
        
        {/* ─── TOP SECTION: BRAND & LINKS ─── */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-24 md:mb-32">
          
          {/* Brand Info */}
          <div className="flex-1 max-w-sm">
            <Link href="/" className="text-2xl font-bold tracking-tight inline-flex items-baseline mb-6 text-white hover:text-white/80 transition-colors">
              Stempelkarte<span className="text-amber-500">.</span>
            </Link>
            <p className="text-sm md:text-base text-white/50 font-medium leading-relaxed">
              Digitale Kundenbindung für lokale Geschäfte. Verabschiede dich von Papier und belohne deine Stammkunden direkt in Apple & Google Wallet.
            </p>
          </div>

          {/* Links Grid */}
          <div className="flex-[2] grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {columns.map((col, i) => (
              <div key={i} className="flex flex-col">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-6">{col.title}</h4>
                <ul className="flex flex-col gap-4">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link 
                        href={link.href} 
                        className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ─── BOTTOM SECTION: COPYRIGHT & SOCIALS ─── */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xs font-bold uppercase tracking-widest text-white/30">
            © 2026 Stempelkarte.
          </span>
          <div className="flex gap-8">
            {["Twitter", "LinkedIn", "Instagram"].map((s) => (
              <Link key={s} href="#" className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors duration-200">
                {s}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
