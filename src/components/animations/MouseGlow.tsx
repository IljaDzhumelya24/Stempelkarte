"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function MouseGlow() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 100, mass: 2 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 100, mass: 2 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div className="pointer-events-none fixed top-0 left-0 w-full h-full z-0 overflow-hidden mix-blend-multiply">
      <motion.div
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
        className="absolute w-[800px] h-[800px] bg-black/5 rounded-full blur-[100px]"
      />
    </motion.div>
  );
}
