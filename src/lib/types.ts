export interface WalletCardProps {
  businessName: string;
  currentStamps: number;
  totalStamps: number;
  reward: string;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  showQR?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'fluid';
  interactive?: boolean;
}

export interface BrancheData {
  slug: string;
  name: string;
  businessName: string;
  reward: string;
  totalStamps: number;
  currentStamps: number;
  colorFrom: string;
  colorTo: string;
  description: string;
  benefits: string[];
  ctaText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  setupFee: string;
  description: string;
  features: string[];
  ctaText: string;
}

export interface StorytellingStep {
  title: string;
  description: string;
  icon: string;
}

export interface BenefitStatement {
  text: string;
  subtext: string;
}

export interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

export interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export interface ScaleOnScrollProps {
  children: React.ReactNode;
  className?: string;
}

export interface WordRevealProps {
  text: string;
  className?: string;
}
