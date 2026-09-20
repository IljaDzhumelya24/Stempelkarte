"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import type { ComponentType, ReactNode } from "react";

type LenisRootProps = {
  root?: boolean;
  options?: {
    lerp?: number;
    duration?: number;
    smoothWheel?: boolean;
  };
  children: ReactNode;
};

const LenisRoot = ReactLenis as unknown as ComponentType<LenisRootProps>;

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <LenisRoot root options={{ lerp: 0.07, duration: 1.5, smoothWheel: true }}>
      {children}
    </LenisRoot>
  );
}
