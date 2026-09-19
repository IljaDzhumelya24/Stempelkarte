import Link from 'next/link';
import { siteConfig } from '@/data/site-config';

const groups = [
  { title: 'Produkt', links: [['Produkt', '/produkt'], ['Demo', '/demo'], ['Preise', '/preise'], ['FAQ', '/faq']] },
  { title: 'Branchen', links: [['Kioske', '/branchen/kiosk'], ['Cafés', '/branchen/cafe'], ['Barbershops', '/branchen/barbershop'], ['Alle Branchen', '/branchen']] },
  { title: 'Unternehmen', links: [['Über uns', '/ueber-uns'], ['Kontakt', '/kontakt']] },
  { title: 'Rechtliches', links: [['Impressum', '/impressum'], ['Datenschutz', '/datenschutz']] },
];

export function Footer() {
  return (
    <footer className="bg-ink px-5 py-16 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-white text-sm font-black text-ink">S</span>
              <span className="font-black tracking-[0.18em]">{siteConfig.siteName}</span>
            </div>
            <h2 className="max-w-2xl text-5xl font-semibold tracking-tight sm:text-7xl">Mach deinen ersten Stammkunden digital.</h2>
            <p className="mt-6 max-w-xl text-white/60">{siteConfig.tagline} Gebaut in {siteConfig.location}.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/38">{group.title}</h3>
                <ul className="grid gap-3 text-sm text-white/68">
                  {group.links.map(([label, href]) => (
                    <li key={href}><Link className="transition hover:text-white" href={href}>{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-5 border-t border-white/10 pt-7 text-sm text-white/45 sm:flex-row">
          <p>© 2026 {siteConfig.siteName}. Platzhaltermarke.</p>
          <div className="flex gap-4">
            {siteConfig.socialLinks.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
