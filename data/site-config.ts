import type {
  BusinessType,
  FAQItem,
  Feature,
  NavigationItem,
  PricingPlan,
} from '@/lib/types';

export const siteConfig = {
  siteName: 'STAMP',
  tagline: 'Digitale Stempelkarten direkt im Wallet.',
  email: 'hello@stamp-demo.de',
  phone: '+49 421 000000',
  location: 'Bremen, Deutschland',
  socialLinks: [
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'X', href: '#' },
  ],
};

export const navigationItems: NavigationItem[] = [
  { label: 'Produkt', href: '/produkt' },
  { label: 'Branchen', href: '/branchen' },
  { label: 'Preise', href: '/preise' },
  { label: 'Über uns', href: '/ueber-uns' },
];

export const businessTypes: BusinessType[] = [
  {
    title: 'Kioske',
    slug: 'kiosk',
    description: 'Stempel für Kaffee, Snacks und Stammkunden um die Ecke.',
    reward: 'Gratis-Getränk nach 10 Besuchen',
    accent: '#2458ff',
  },
  {
    title: 'Cafés & Bäckereien',
    slug: 'cafe',
    description: 'Morgenroutinen sichtbar machen und Wiederkommen belohnen.',
    reward: 'Jeder 10. Kaffee aufs Haus',
    accent: '#9b5cff',
  },
  {
    title: 'Barbershops & Friseure',
    slug: 'barbershop',
    description: 'Treue nach jedem Cut, jeder Pflege und jedem Termin.',
    reward: 'Pflegeprodukt oder Rabatt nach 8 Besuchen',
    accent: '#111827',
  },
  {
    title: 'Restaurants',
    slug: 'restaurant',
    description: 'Lunchgäste, Stammplätze und kleine Rewards sauber verbinden.',
    reward: 'Dessert oder Drink als Dankeschön',
    accent: '#0e9f6e',
  },
  {
    title: 'Nagelstudios',
    slug: 'nagelstudio',
    description: 'Termine mit Belohnungen verbinden, ohne Papierkarten.',
    reward: 'Upgrade nach 6 Terminen',
    accent: '#d946ef',
  },
  {
    title: 'Einzelhandel',
    slug: 'einzelhandel',
    description: 'Lokale Einkäufe wiederkehrend und messbar machen.',
    reward: 'Gutschein nach 10 Einkäufen',
    accent: '#f59e0b',
  },
];

export const features: Feature[] = [
  { title: 'Apple & Google Wallet', text: 'Die Karte liegt dort, wo Kunden ohnehin Tickets, Boardingpässe und Karten speichern.' },
  { title: 'Kein App-Download', text: 'Ein QR-Code reicht. Kein Konto, keine Hürde, kein vergessener Login.' },
  { title: 'Eigene Designs', text: 'Farben, Logo und Belohnung passen zu deinem Geschäft.' },
  { title: 'QR-Code Onboarding', text: 'Aufsteller auf den Tresen, scannen lassen, fertig.' },
  { title: 'Stempel in Sekunden', text: 'Mitarbeiter bestätigen direkt am Gerät oder Scanner.' },
  { title: 'Belohnungen', text: 'Freischalten, einlösen und sauber dokumentieren.' },
  { title: 'Dashboard', text: 'Aktive Karten, Stempel und Rewards in einer ruhigen Übersicht.' },
  { title: 'Mitarbeiterzugänge', text: 'Mehrere Menschen im Laden können Stempel vergeben.' },
  { title: 'Mehrere Standorte', text: 'Für wachsende lokale Marken vorbereitet. Später verfügbar.' },
];

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: 29,
    description: 'Für kleine Läden, die digital starten wollen.',
    features: ['1 Standort', '1 digitale Stempelkarte', 'Apple & Google Wallet', 'QR-Code zum Auslegen', 'Basis-Dashboard'],
  },
  {
    name: 'Business',
    price: 49,
    highlighted: true,
    description: 'Für Geschäfte mit Team, Laufkundschaft und klarer Routine.',
    features: ['3 Standorte', 'Mehrere Mitarbeiter', 'Eigene Kartenfarben', 'Reward-Verwaltung', 'Aktivitätsübersicht'],
  },
  {
    name: 'Pro',
    price: 99,
    description: 'Für lokale Marken mit mehreren Filialen.',
    features: ['10 Standorte', 'Mehrere Kartendesigns', 'Priorisierte Einrichtung', 'Erweiterte Auswertungen', 'Standortübergreifende Rewards'],
  },
];

export const faqItems: FAQItem[] = [
  { question: 'Brauchen meine Kunden eine App?', answer: 'Nein. Die Karte wird direkt in Apple Wallet oder Google Wallet gespeichert.' },
  { question: 'Funktioniert es auf iPhone und Android?', answer: 'Ja. STAMP ist für beide Wallet-Systeme gedacht.' },
  { question: 'Wie bekommt ein Kunde einen Stempel?', answer: 'Die persönliche Karte wird im Laden gescannt und der Mitarbeiter bestätigt den neuen Stempel.' },
  { question: 'Kann ich mein eigenes Design verwenden?', answer: 'Ja. Farben, Name, Logo-Platzhalter und Belohnung lassen sich auf dein Geschäft abstimmen.' },
  { question: 'Kann ich die Anzahl der notwendigen Stempel bestimmen?', answer: 'Ja. 6, 8, 10 oder andere Ziele sind möglich.' },
  { question: 'Kann ich verschiedene Belohnungen anbieten?', answer: 'Ja, verschiedene Rewards sind vorgesehen und können je Karte unterschiedlich sein.' },
  { question: 'Wie lange dauert die Einrichtung?', answer: 'Für die Demo rechnen wir mit wenigen Tagen, sobald Logo, Farben und Belohnung feststehen.' },
  { question: 'Brauche ich spezielle Hardware?', answer: 'Zum Start nicht. Ein Smartphone, Tablet oder vorhandener Scanner kann reichen.' },
  { question: 'Was passiert, wenn ein Kunde sein Handy wechselt?', answer: 'Die Wallet-Karte kann erneut gespeichert werden. Der Stand bleibt mit der Karte verbunden.' },
  { question: 'Kann ich mehrere Mitarbeiter hinzufügen?', answer: 'Ja. Mitarbeiterzugänge sind im Business-Plan vorgesehen.' },
  { question: 'Kann ich mehrere Filialen verwalten?', answer: 'Ja. Mehrere Standorte sind im Business- und Pro-Setup vorgesehen.' },
];
