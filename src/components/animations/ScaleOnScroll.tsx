"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ScaleOnScrollProps } from "@/lib/types";

export default function ScaleOnScroll({ children, className = "" }: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const prefersReducedMotion = useReducedMotion();
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const filter = useTransform(scrollYProgress, [0, 1], ["blur(8px)", "blur(0px)"]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        scale: prefersReducedMotion ? 1 : scale,
        filter: prefersReducedMotion ? "none" : filter,
      }}
    >
      {children}
    </motion.div>
  );
}
