import type { Metadata } from 'next';
import { DemoStampCard } from '@/components/sections/demo-card';

export const metadata: Metadata = {
  title: 'Interaktive Produktdemo',
  description: 'Teste eine digitale Demo-Stempelkarte direkt im Browser.',
};

export default function DemoPage() {
  return <main className="pt-16"><DemoStampCard /></main>;
}
