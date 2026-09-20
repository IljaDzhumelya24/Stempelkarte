"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { WordRevealProps } from "@/lib/types";

export default function WordReveal({ text, className = "" }: WordRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 40%"]
  });
  
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <div ref={containerRef} className={`flex flex-wrap gap-x-3 gap-y-2 ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(
          scrollYProgress,
          [start, end],
          [0.15, 1]
        );

        return (
          <motion.span
            key={i}
            style={{ opacity: prefersReducedMotion ? 1 : opacity }}
            className="inline-block"
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}
