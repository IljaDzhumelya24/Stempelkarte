"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ScrollRevealProps } from "@/lib/types";

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.65,
  className = ""
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();

  const getVariants = () => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      };
    }
    
    switch (direction) {
      case "up": return { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
      case "down": return { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } };
      case "left": return { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } };
      case "right": return { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={getVariants()}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion || isInView ? "visible" : "hidden"}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  );
}
