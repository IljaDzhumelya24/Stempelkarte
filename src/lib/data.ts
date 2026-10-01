import type { BrancheData, FAQItem, PricingPlan, StorytellingStep, BenefitStatement } from './types';

export const branchen: BrancheData[] = [
  {
    slug: 'kiosk',
    name: 'Kiosk',
    businessName: 'MOIN KIOSK',
    reward: 'Gratis-Getränk',
    totalStamps: 10,
    currentStamps: 7,
    colorFrom: '#3058ff',
    colorTo: '#2547dc',
    description: 'Gib deinen Kunden einen Anlass für den nächsten Einkauf bei dir. Belohne regelmäßige Besuche mit einem Getränk oder Snack aus deinem Sortiment.',
    benefits: [
      'Perfekt für tägliche Einkäufe',
      'QR-Code direkt an der Kasse',
      'Dein Team vergibt Stempel an der Kasse',
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
    colorFrom: '#203ab5',
    colorTo: '#1b2c75',
    description: 'Mach aus Laufkundschaft Stammgäste. Mit deiner digitalen Kaffeekarte belohnst du regelmäßige Besuche – direkt an der Theke und im Design deines Cafés.',
    benefits: [
      'Klassische Kaffeekarte, digital',
      'Weniger Papierkarten an deiner Theke',
      'Dein Logo und deine Farben',
      'Deine Prämie bleibt für Gäste sichtbar',
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
    description: 'Stärke die Bindung zu deinem Barbershop. Du legst fest, nach wie vielen Besuchen du Stammkunden mit einem Extra oder einer Behandlung belohnst.',
    benefits: [
      'Premium-Look für Premium-Service',
      'Deine Prämien für regelmäßige Besuche',
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
    colorFrom: '#203ab5',
    colorTo: '#203ab5',
    description: 'Gib deinen Kunden einen Grund, ihr Frühstück wieder bei dir zu holen. Dein Team vergibt Stempel an der Theke, du bestimmst die passende Prämie.',
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
    colorFrom: '#334a9e',
    colorTo: '#172554',
    description: 'Mach deinen Mittagstisch zur Gewohnheit. Belohne wiederkehrende Gäste mit einer Prämie, die zu deinem Restaurant und deiner Kalkulation passt.',
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
    colorFrom: '#4264e8',
    colorTo: '#273f9a',
    description: 'Pflege die Bindung zu deinem Salon. Belohne regelmäßige Termine mit einer Behandlung oder einem Produkt – im Design deiner Marke.',
    benefits: [
      'Stärkt langfristige Kundenbeziehungen',
      'Karte im Design deines Salons',
      'Behandlung oder Produkt als Belohnung',
      'Dein Salon bleibt in der Wallet präsent',
    ],
    ctaText: 'Demo für Friseure ansehen',
  },
];

export const storytellingSteps: StorytellingStep[] = [
  {
    title: 'Karte\nbereitstellen',
    description: 'Platziere den QR-Code deines Geschäfts gut sichtbar an der Kasse oder am Tresen.',
    icon: 'scan',
  },
  {
    title: 'Kunden\neinladen',
    description: 'Lade deine Kunden ein, die digitale Stempelkarte deines Geschäfts zu nutzen.',
    icon: 'card',
  },
  {
    title: 'Im Alltag\npräsent bleiben',
    description: 'Deine Kunden speichern deine Karte in ihrer Wallet – mit deinem Logo und deinen Belohnungen.',
    icon: 'wallet',
  },
  {
    title: 'Stempel\nvergeben',
    description: 'Dein Team scannt die Kundenkarte und vergibt einen Stempel für den Einkauf oder Besuch.',
    icon: 'stamp',
  },
  {
    title: 'Treue\nbelohnen',
    description: 'Ist die festgelegte Stempelanzahl erreicht, gibt dein Team die vereinbarte Prämie aus.',
    icon: 'gift',
  },
];

export const pricingPlan: PricingPlan = {
  name: 'StampNow',
  price: '29,99',
  period: 'pro Monat',
  setupFee: '150',
  description: 'Digitale Kundenbindung für dein Geschäft – mit deiner Marke, deinen Prämien und Übersicht für dein Team.',
  features: [
    'Digitale Stempelkarte in deinem Design',
    'Apple Wallet & Google Wallet',
    'QR-Code für deine Kasse',
    'Stempelvergabe per Smartphone oder Tablet',
    'Individuelle Stempelanzahl und Prämien',
    'Dashboard mit Statistiken',
    'E-Mail-Support',
  ],
  ctaText: 'Demo anfragen',
};

export const faqItems: FAQItem[] = [
  {
    question: 'Wie erhalten meine Kunden ihre Karte?',
    answer: 'Deine Kunden scannen den QR-Code in deinem Geschäft und speichern ihre digitale Stempelkarte in Apple Wallet oder Google Wallet. Bei jedem Besuch zeigen sie die Karte zum Stempeln vor.',
  },
  {
    question: 'Wie vergibt mein Team Stempel?',
    answer: 'Der Kunde zeigt seine Wallet-Karte vor. Dein Mitarbeiter scannt den QR-Code auf der Karte mit einem beliebigen Smartphone oder Tablet. Der Stempel wird automatisch vergeben.',
  },
  {
    question: 'Wie löst mein Team eine Belohnung ein?',
    answer: 'Sobald alle Stempel gesammelt sind, wird die Belohnung automatisch auf der Karte angezeigt. Dein Mitarbeiter kann die Belohnung einlösen und die Karte wird zurückgesetzt.',
  },
  {
    question: 'Kann ich die Karte an mein Geschäft anpassen?',
    answer: 'Ja. Du wählst Farben, Logo, Geschäftsname, Belohnung und Anzahl der Stempel. Die Karte sieht aus wie deine Marke – nicht wie unsere.',
  },
  {
    question: 'Wie lange dauert die Einrichtung?',
    answer: 'Du legst Logo, Farben, Stempelanzahl und Belohnung fest und platzierst deinen QR-Code im Geschäft. In der Demo zeigen wir dir den Ablauf für deinen Betrieb.',
  },
  {
    question: 'Was kostet der Service?',
    answer: `StampNow kostet ${pricingPlan.price} € pro Monat. Hinzu kommen einmalig ${pricingPlan.setupFee} € für die Einrichtung.`,
  },
  {
    question: 'Welche Smartphones können meine Kunden nutzen?',
    answer: 'Deine Kunden benötigen ein Smartphone mit Apple Wallet oder Google Wallet. In der Demo besprechen wir die Nutzung und Voraussetzungen für dein Geschäft.',
  },
  {
    question: 'Kann ich sehen, wie viele Kunden die Karte nutzen?',
    answer: 'Ja. In deinem Dashboard siehst du aktive Karten, Stempel-Aktivität, eingelöste Belohnungen und wiederkehrende Kunden – alles in Echtzeit.',
  },
  {
    question: 'Bin ich an einen Vertrag gebunden?',
    answer: 'Du kannst monatlich kündigen. Die einmalige Einrichtungsgebühr fällt zum Start an.',
  },
  {
    question: 'Wo ist der Service verfügbar?',
    answer: 'StampNow ist deutschlandweit für lokale Geschäfte verfügbar. In einer Demo zeigen wir dir, wie du die digitale Kundenbindung in deinem Betrieb einsetzt.',
  },
];

export const benefitStatements: BenefitStatement[] = [
  {
    text: 'Einfach für deine Kunden.',
    subtext: 'Deine Kunden nutzen deine Karte in Apple Wallet oder Google Wallet. Stempel und Prämien bleiben dort im Blick.',
  },
  {
    text: 'Passend zu deinem Betrieb.',
    subtext: 'Lege dein Kartendesign und deine Prämie fest. Den QR-Code stellst du direkt an deiner Kasse bereit.',
  },
  {
    text: 'Einfach für dein Team.',
    subtext: 'Dein Team scannt die Kundenkarte und vergibt den Stempel. So wird Kundenbindung Teil deines Kassenalltags.',
  },
  {
    text: 'Belohnungen, die Kunden wiederbringen.',
    subtext: 'Wähle Prämien, die deine Kunden ansprechen und zu deiner Kalkulation passen. Du bestimmst die Spielregeln.',
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
