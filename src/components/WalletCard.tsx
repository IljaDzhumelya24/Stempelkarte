"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { WalletCardProps } from "@/lib/types";

const sizeMap = {
  sm: { width: "w-[260px]", height: "min-h-[340px]", text: "text-sm", title: "text-base", stamp: "w-5 h-5", count: "text-3xl", qr: "w-14 h-14" },
  md: { width: "w-[320px]", height: "min-h-[420px]", text: "text-base", title: "text-lg", stamp: "w-6 h-6", count: "text-4xl", qr: "w-20 h-20" },
  lg: { width: "w-[380px]", height: "min-h-[500px]", text: "text-base", title: "text-xl", stamp: "w-7 h-7", count: "text-5xl", qr: "w-24 h-24" },
};

export default function WalletCard({
  businessName,
  currentStamps,
  totalStamps,
  reward,
  colorFrom = "#f59e0b",
  colorTo = "#d97706",
  className = "",
  showQR = false,
  size = "md",
}: WalletCardProps & { size?: "sm" | "md" | "lg" }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const s = sizeMap[size];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const remaining = totalStamps - currentStamps;
  const isComplete = remaining <= 0;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || prefersReducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${s.width} ${s.height} relative rounded-[1.75rem] overflow-hidden select-none ${className}`}
      style={{
        background: `linear-gradient(145deg, ${colorFrom} 0%, ${colorTo} 100%)`,
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glossy shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6 sm:p-7 text-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-auto">
          <div>
            <p className={`${s.title} font-bold tracking-[0.08em] uppercase`}>
              {businessName}
            </p>
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-white/50 mt-1 font-medium">
              Treuekarte
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white/60" />
          </div>
        </div>

        {/* Stamp count */}
        <div className="my-8 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className={`${s.count} font-extralight tabular-nums`}>
              {currentStamps}
            </span>
            <span className="text-lg text-white/40 font-light">/</span>
            <span className="text-lg text-white/40 font-light">{totalStamps}</span>
          </div>
        </div>

        {/* Stamps grid */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-6">
          {Array.from({ length: totalStamps }).map((_, i) => {
            const filled = i < currentStamps;
            return (
              <div
                key={i}
                className={`${s.stamp} rounded-full transition-all duration-300 ${
                  filled
                    ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    : "bg-white/10 border border-white/20"
                }`}
              />
            );
          })}
        </div>

        {/* Reward text */}
        <p className={`${s.text} text-center text-white/70 font-light leading-relaxed mb-6`}>
          {isComplete
            ? "🎉 Belohnung freigeschaltet!"
            : `Noch ${remaining} bis zu deinem ${reward}.`}
        </p>

        {/* QR Code area */}
        {showQR && (
          <div className="mt-auto flex justify-center">
            <div className="bg-white rounded-xl p-3 shadow-lg">
              <div className={`${s.qr} relative`}>
                {/* Simulated QR pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  {/* Corner squares */}
                  <rect x="2" y="2" width="26" height="26" rx="4" fill="currentColor" />
                  <rect x="6" y="6" width="18" height="18" rx="2" fill="white" />
                  <rect x="9" y="9" width="12" height="12" rx="1" fill="currentColor" />
                  <rect x="72" y="2" width="26" height="26" rx="4" fill="currentColor" />
                  <rect x="76" y="6" width="18" height="18" rx="2" fill="white" />
                  <rect x="79" y="9" width="12" height="12" rx="1" fill="currentColor" />
                  <rect x="2" y="72" width="26" height="26" rx="4" fill="currentColor" />
                  <rect x="6" y="76" width="18" height="18" rx="2" fill="white" />
                  <rect x="9" y="79" width="12" height="12" rx="1" fill="currentColor" />
                  {/* Data pattern */}
                  <rect x="34" y="6" width="6" height="6" fill="currentColor" />
                  <rect x="44" y="6" width="6" height="6" fill="currentColor" />
                  <rect x="54" y="6" width="6" height="6" fill="currentColor" />
                  <rect x="34" y="16" width="6" height="6" fill="currentColor" />
                  <rect x="54" y="16" width="6" height="6" fill="currentColor" />
                  <rect x="6" y="34" width="6" height="6" fill="currentColor" />
                  <rect x="16" y="34" width="6" height="6" fill="currentColor" />
                  <rect x="6" y="44" width="6" height="6" fill="currentColor" />
                  <rect x="16" y="54" width="6" height="6" fill="currentColor" />
                  <rect x="34" y="34" width="6" height="6" fill="currentColor" />
                  <rect x="44" y="44" width="6" height="6" fill="currentColor" />
                  <rect x="54" y="34" width="6" height="6" fill="currentColor" />
                  <rect x="64" y="44" width="6" height="6" fill="currentColor" />
                  <rect x="34" y="54" width="6" height="6" fill="currentColor" />
                  <rect x="44" y="54" width="6" height="6" fill="currentColor" />
                  <rect x="54" y="54" width="6" height="6" fill="currentColor" />
                  <rect x="64" y="54" width="6" height="6" fill="currentColor" />
                  <rect x="74" y="34" width="6" height="6" fill="currentColor" />
                  <rect x="84" y="44" width="6" height="6" fill="currentColor" />
                  <rect x="74" y="54" width="6" height="6" fill="currentColor" />
                  <rect x="84" y="54" width="6" height="6" fill="currentColor" />
                  <rect x="34" y="74" width="6" height="6" fill="currentColor" />
                  <rect x="44" y="74" width="6" height="6" fill="currentColor" />
                  <rect x="54" y="74" width="6" height="6" fill="currentColor" />
                  <rect x="64" y="74" width="6" height="6" fill="currentColor" />
                  <rect x="74" y="74" width="6" height="6" fill="currentColor" />
                  <rect x="84" y="74" width="6" height="6" fill="currentColor" />
                  <rect x="44" y="84" width="6" height="6" fill="currentColor" />
                  <rect x="64" y="84" width="6" height="6" fill="currentColor" />
                  <rect x="84" y="84" width="6" height="6" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
