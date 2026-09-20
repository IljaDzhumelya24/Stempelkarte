"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ParallaxSectionProps } from "@/lib/types";

export default function ParallaxSection({
  children,
  speed = 0.5,
  className = ""
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const prefersReducedMotion = useReducedMotion();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y: prefersReducedMotion ? 0 : y }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
