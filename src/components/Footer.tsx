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
    <footer className="w-full bg-[#0a0a0a] text-white relative z-30">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-16 md:py-20">
        
        {/* Grid: Brand + Links all in one tight row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8">
          
          {/* Brand (spans 2 cols) */}
          <div className="col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tighter inline-flex items-baseline mb-4">
              Stempelkarte<span className="text-amber-500">.</span>
            </Link>
            <p className="text-[13px] text-white/30 font-medium leading-relaxed max-w-[240px]">
              Digitale Stempelkarten für lokale Geschäfte. Belohne Stammkunden – mit deiner Marke und deinen Prämien.
            </p>
          </div>

          {/* Link Columns */}
          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-5">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className="text-[13px] font-medium text-white/40 hover:text-white transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[11px] font-medium text-white/15 tracking-wide">
            © 2026 Stempelkarte. Alle Rechte vorbehalten.
          </span>
          <div className="flex gap-6">
            {["Twitter", "LinkedIn", "Instagram"].map((s) => (
              <Link key={s} href="#" className="text-[11px] font-medium text-white/15 hover:text-white/40 transition-colors duration-300 tracking-wide">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
