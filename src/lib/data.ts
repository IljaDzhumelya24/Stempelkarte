import type { BrancheData, FAQItem, PricingTier, StorytellingStep, BenefitStatement } from './types';

export const branchen: BrancheData[] = [
  {
    slug: 'kiosk',
    name: 'Kiosk',
    businessName: 'MOIN KIOSK',
    reward: 'Gratis-Getränk',
    totalStamps: 10,
    currentStamps: 7,
    colorFrom: '#f59e0b',
    colorTo: '#d97706',
    description: 'Stammkunden belohnen, die täglich vorbeikommen. Ob Kaffee, Snack oder Getränk – mit digitalen Stempelkarten kommen sie immer wieder.',
    benefits: [
      'Perfekt für tägliche Einkäufe',
      'QR-Code direkt an der Kasse',
      'Kunden sammeln bei jedem Besuch',
      'Gratis-Getränk oder Snack als Belohnung',
    ],
    ctaText: 'Demo für Kioske ansehen',
  },
  {
    slug: 'cafe',
    name: 'Café',
    businessName: 'CAFÉ MORGEN',
    reward: 'Gratis-Kaffee',
    totalStamps: 8,
    currentStamps: 5,
    colorFrom: '#92400e',
    colorTo: '#78350f',
    description: 'Der zehnte Kaffee ist gratis – ein Klassiker, der mit digitalen Stempelkarten endlich zuverlässig funktioniert.',
    benefits: [
      'Klassische Kaffeekarte, digital',
      'Kein Vergessen, keine verlorenen Karten',
      'Branding in euren Farben',
      'Kunden sehen den Fortschritt im Wallet',
    ],
    ctaText: 'Demo für Cafés ansehen',
  },
  {
    slug: 'barbershop',
    name: 'Barbershop',
    businessName: 'BLADE & SOUL',
    reward: 'Gratis-Haarschnitt',
    totalStamps: 10,
    currentStamps: 8,
    colorFrom: '#1e293b',
    colorTo: '#0f172a',
    description: 'Kunden, die alle vier Wochen kommen, verdienen eine Belohnung. Digitale Stempelkarten machen Kundenbindung zum Standard.',
    benefits: [
      'Premium-Look für Premium-Service',
      'Kunden werden an Termine erinnert',
      'Belohnung nach regelmäßigen Besuchen',
      'Stärkt die Kundenbindung nachhaltig',
    ],
    ctaText: 'Demo für Barbershops ansehen',
  },
  {
    slug: 'baeckerei',
    name: 'Bäckerei',
    businessName: 'BACKSTUBE KARL',
    reward: 'Gratis-Brot',
    totalStamps: 12,
    currentStamps: 9,
    colorFrom: '#b45309',
    colorTo: '#92400e',
    description: 'Ob Brötchen am Morgen oder Kuchen am Nachmittag – belohne treue Kunden, die jeden Tag vorbeischauen.',
    benefits: [
      'Ideal für tägliche Besuche',
      'Schneller Stempel an der Theke',
      'Funktioniert auch in der Filiale',
      'Gratis-Brot oder Gebäck als Belohnung',
    ],
    ctaText: 'Demo für Bäckereien ansehen',
  },
  {
    slug: 'restaurant',
    name: 'Restaurant',
    businessName: 'TISCH & FREUNDE',
    reward: 'Gratis-Dessert',
    totalStamps: 6,
    currentStamps: 4,
    colorFrom: '#7c2d12',
    colorTo: '#431407',
    description: 'Stammgäste sind das Fundament jedes Restaurants. Belohne ihre Treue mit einer digitalen Stempelkarte.',
    benefits: [
      'Perfekt für Mittagstisch-Stammgäste',
      'Elegante Karte im Restaurant-Branding',
      'Dessert oder Getränk als Belohnung',
      'Einfach vom Service zu bedienen',
    ],
    ctaText: 'Demo für Restaurants ansehen',
  },
  {
    slug: 'friseur',
    name: 'Friseur',
    businessName: 'SALON ANNIKA',
    reward: 'Gratis-Behandlung',
    totalStamps: 10,
    currentStamps: 6,
    colorFrom: '#be185d',
    colorTo: '#9d174d',
    description: 'Friseurbesuche sind regelmäßig – perfekt für eine Stempelkarte. Belohne treue Kundinnen und Kunden.',
    benefits: [
      'Stärkt langfristige Kundenbeziehungen',
      'Karte in eurem Salon-Design',
      'Behandlung oder Produkt als Belohnung',
      'Kunden tragen die Karte immer dabei',
    ],
    ctaText: 'Demo für Friseure ansehen',
  },
];

export const storytellingSteps: StorytellingStep[] = [
  {
    title: 'QR-Code\nscannen',
    description: 'Der Kunde scannt den QR-Code an der Kasse oder am Tresen.',
    icon: 'scan',
  },
  {
    title: 'Karte\nerstellen',
    description: 'In Sekunden wird eine persönliche digitale Stempelkarte erstellt.',
    icon: 'card',
  },
  {
    title: 'Im Wallet\nspeichern',
    description: 'Die Karte wird direkt in Apple Wallet oder Google Wallet gespeichert.',
    icon: 'wallet',
  },
  {
    title: 'Stempel\nsammeln',
    description: 'Bei jedem Besuch scannt der Mitarbeiter die Karte – neuer Stempel.',
    icon: 'stamp',
  },
  {
    title: 'Belohnung\nerhalten',
    description: 'Nach der festgelegten Anzahl wird die Belohnung freigeschaltet.',
    icon: 'gift',
  },
];

export const faqItems: FAQItem[] = [
  {
    question: 'Brauchen meine Kunden eine App?',
    answer: 'Nein. Die Stempelkarte wird direkt in Apple Wallet oder Google Wallet gespeichert. Keine App-Installation nötig, keine Registrierung. Einfach QR-Code scannen und los.',
  },
  {
    question: 'Wie funktioniert das Stempeln?',
    answer: 'Der Kunde zeigt seine Wallet-Karte vor. Dein Mitarbeiter scannt den QR-Code auf der Karte mit einem beliebigen Smartphone oder Tablet. Der Stempel wird automatisch vergeben.',
  },
  {
    question: 'Was passiert, wenn die Karte voll ist?',
    answer: 'Sobald alle Stempel gesammelt sind, wird die Belohnung automatisch auf der Karte angezeigt. Dein Mitarbeiter kann die Belohnung einlösen und die Karte wird zurückgesetzt.',
  },
  {
    question: 'Kann ich das Design der Karte anpassen?',
    answer: 'Ja. Du wählst Farben, Logo, Geschäftsname, Belohnung und Anzahl der Stempel. Die Karte sieht aus wie deine Marke – nicht wie unsere.',
  },
  {
    question: 'Wie lange dauert die Einrichtung?',
    answer: 'Wenige Minuten. Karte konfigurieren, QR-Code ausdrucken, fertig. Kein technisches Wissen nötig.',
  },
  {
    question: 'Was kostet der Service?',
    answer: 'Wir bieten verschiedene Pakete an, die sich nach der Anzahl der aktiven Karten richten. Für Pilotpartner in Bremen ist der Start kostenlos.',
  },
  {
    question: 'Funktioniert das mit jedem Smartphone?',
    answer: 'Ja. Apple Wallet ist auf jedem iPhone vorinstalliert. Google Wallet ist auf den meisten Android-Geräten verfügbar. Zusammen deckt das über 95% aller Smartphones ab.',
  },
  {
    question: 'Kann ich sehen, wie viele Kunden die Karte nutzen?',
    answer: 'Ja. In deinem Dashboard siehst du aktive Karten, Stempel-Aktivität, eingelöste Belohnungen und wiederkehrende Kunden – alles in Echtzeit.',
  },
  {
    question: 'Bin ich an einen Vertrag gebunden?',
    answer: 'Nein. Du kannst monatlich kündigen. Keine Mindestlaufzeit, keine versteckten Kosten.',
  },
  {
    question: 'Wo ist der Service verfügbar?',
    answer: 'Wir starten mit ausgewählten Pilotpartnern in Bremen. Eine Ausweitung auf weitere Städte ist geplant.',
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '29',
    period: 'pro Monat',
    description: 'Perfekt für den Einstieg. Eine Stempelkarte, volles Dashboard.',
    features: [
      '1 Stempelkarte',
      'Bis zu 200 aktive Kunden',
      'Eigenes Branding',
      'Dashboard mit Statistiken',
      'QR-Code für die Kasse',
      'E-Mail-Support',
    ],
    ctaText: 'Starter wählen',
  },
  {
    name: 'Professional',
    price: '59',
    period: 'pro Monat',
    description: 'Für wachsende Geschäfte. Mehrere Karten, volle Kontrolle.',
    features: [
      'Bis zu 5 Stempelkarten',
      'Unbegrenzte aktive Kunden',
      'Eigenes Branding pro Karte',
      'Erweitertes Dashboard',
      'Push-Benachrichtigungen',
      'Prioritäts-Support',
      'Mehrere Standorte',
    ],
    highlighted: true,
    ctaText: 'Professional wählen',
  },
  {
    name: 'Enterprise',
    price: 'Individuell',
    period: '',
    description: 'Für Ketten und Franchise. Maßgeschneidert für euch.',
    features: [
      'Unbegrenzte Stempelkarten',
      'Unbegrenzte Kunden',
      'API-Zugang',
      'Dedizierter Ansprechpartner',
      'Custom Integrationen',
      'SLA-Garantie',
      'Onboarding-Support',
    ],
    ctaText: 'Kontakt aufnehmen',
  },
];

export const benefitStatements: BenefitStatement[] = [
  {
    text: 'Keine App nötig.',
    subtext: 'Apple Wallet und Google Wallet sind vorinstalliert. Deine Kunden brauchen nichts herunterzuladen.',
  },
  {
    text: 'In Minuten eingerichtet.',
    subtext: 'Karte konfigurieren, QR-Code drucken, an die Kasse kleben. Das war\'s.',
  },
  {
    text: 'Ein Stempel dauert Sekunden.',
    subtext: 'Karte vorzeigen, scannen, fertig. Kein Suchen, kein Fragen, kein Warten.',
  },
  {
    text: 'Belohnungen, die Kunden wiederbringen.',
    subtext: 'Ein Gratis-Kaffee, ein Gratis-Haarschnitt – einfache Anreize mit großer Wirkung.',
  },
];

export const navLinks = [
  { label: 'Produkt', href: '/produkt' },
  { label: 'Branchen', href: '/branchen' },
  { label: 'Preise', href: '/preise' },
];

export const footerLinks = {
  produkt: [
    { label: 'Funktionen', href: '/produkt' },
    { label: 'Preise', href: '/preise' },
    { label: 'Demo', href: '/demo' },
    { label: 'FAQ', href: '/faq' },
  ],
  branchen: [
    { label: 'Kiosk', href: '/branchen/kiosk' },
    { label: 'Café', href: '/branchen/cafe' },
    { label: 'Barbershop', href: '/branchen/barbershop' },
  ],
  unternehmen: [
    { label: 'Über uns', href: '/ueber-uns' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  rechtliches: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
  ],
};
