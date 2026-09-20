"use client";
import { motion } from "framer-motion";

export default function Marquee({ text, reverse = false, speed = 20 }: { text: string, reverse?: boolean, speed?: number }) {
  return (
    <div className="flex w-full overflow-hidden whitespace-nowrap bg-[#111111] text-white py-4">
      <motion.div
        initial={{ x: reverse ? "-50%" : "0%" }}
        animate={{ x: reverse ? "0%" : "-50%" }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        <div className="flex gap-8 px-4 text-sm font-bold tracking-widest uppercase">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              <span>{text}</span>
              <span className="w-2 h-2 rounded-full bg-white/30" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
