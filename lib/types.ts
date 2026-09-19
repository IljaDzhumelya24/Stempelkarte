export interface NavigationItem {
  label: string;
  href: string;
}

export interface BusinessType {
  title: string;
  slug: string;
  description: string;
  reward: string;
  accent: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Feature {
  title: string;
  text: string;
}

export interface WalletCardProps {
  brand: string;
  reward: string;
  stamps: number;
  total?: number;
  accent?: string;
  className?: string;
}
