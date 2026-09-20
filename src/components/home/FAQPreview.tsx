"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { faqItems } from '@/lib/data';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const previewItems = faqItems.slice(0, 6);

  return (
    <section className="bg-white py-32 md:py-48 px-6">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal direction="up" className="mb-16">
          <h2 className="text-4xl md:text-6xl font-light text-slate-950">
            Häufige Fragen
          </h2>
        </ScrollReveal>

        <div className="flex flex-col">
          {previewItems.map((item, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div key={index} className="border-b border-zinc-200">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between py-6 md:py-8 text-left group"
                >
                  <span className="text-lg md:text-xl font-medium text-slate-950 group-hover:text-amber-500 transition-colors">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-shrink-0 ml-4 text-slate-950"
                  >
                    <Plus size={24} strokeWidth={1.5} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 md:pb-8 text-base md:text-lg text-zinc-500">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <ScrollReveal direction="up" delay={0.2} className="mt-16 text-center">
          <Link 
            href="/faq" 
            className="inline-flex text-lg md:text-xl font-medium text-slate-950 hover:text-amber-500 transition-colors"
          >
            Alle Fragen ansehen &rarr;
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
