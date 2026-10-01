"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: !prefersReducedMotion }}>
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
