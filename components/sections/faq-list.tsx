'use client';

import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { faqItems } from '@/data/site-config';

export function FAQList() {
  const [open, setOpen] = useState(0);
  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {faqItems.map((item, index) => (
          <div className="border-b border-ink/10 py-5" key={item.question}>
            <button className="flex w-full items-center justify-between gap-4 text-left text-xl font-semibold" onClick={() => setOpen(open === index ? -1 : index)}>
              {item.question}
              <ChevronDown className={`shrink-0 transition ${open === index ? 'rotate-180' : ''}`} />
            </button>
            <motion.div initial={false} animate={{ height: open === index ? 'auto' : 0, opacity: open === index ? 1 : 0 }} className="overflow-hidden">
              <p className="max-w-2xl pb-3 pt-4 leading-7 text-ink/62">{item.answer}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
