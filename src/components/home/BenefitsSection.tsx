"use client";

import React from 'react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { benefitStatements } from '@/lib/data';

export default function BenefitsSection() {
  return (
    <section className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {benefitStatements.map((benefit, index) => {
          const isRight = index % 2 !== 0;
          
          return (
            <div key={index} className="relative">
              {index > 0 && (
                <div className="absolute top-0 left-0 w-full border-t border-zinc-200" />
              )}
              <div className="py-24 md:py-40 flex flex-col w-full">
                <ScrollReveal 
                  direction={isRight ? "left" : "right"}
                  className={`w-full flex flex-col ${isRight ? 'items-end text-right' : 'items-start text-left'}`}
                >
                  <h3 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-slate-950 mb-6">
                    {benefit.text}
                  </h3>
                  <p className="text-lg md:text-xl text-zinc-500 max-w-xl">
                    {benefit.subtext}
                  </p>
                </ScrollReveal>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
