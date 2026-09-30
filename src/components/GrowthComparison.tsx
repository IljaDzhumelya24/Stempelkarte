"use client";

import { useId, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, RotateCcw } from "lucide-react";

const risingPath = "M 32 174 C 90 173 118 169 158 165 S 226 155 264 149 S 326 139 352 130 C 404 112 426 110 440 30";
const fallingPath = "M 32 174 C 86 174 110 180 158 183 S 226 190 264 198 S 328 207 352 216 S 410 233 440 244";

function ComparisonChart({ digital }: { digital: boolean }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(chartRef, { once: true, amount: 0.4 });
  const reducedMotion = useReducedMotion();
  const gradientId = useId();
  const visible = isInView || reducedMotion;
  const path = digital ? risingPath : fallingPath;
  const endpoint = digital ? 30 : 244;

  return (
    <div ref={chartRef} className="relative mt-6 sm:mt-10">
      <svg viewBox="0 0 480 280" className="block w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={digital ? "#3058ff" : "#a1a1aa"} stopOpacity={digital ? "0.4" : "0.12"} />
            <stop offset="100%" stopColor={digital ? "#3058ff" : "#a1a1aa"} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[54, 110, 166, 222, 270].map((height) => (
          <line key={height} x1="32" x2="448" y1={height} y2={height} stroke="currentColor" className={digital ? "text-white/[0.07]" : "text-black/[0.06]"} />
        ))}
        <line x1="32" x2="448" y1="174" y2="174" stroke="currentColor" strokeDasharray="3 7" className={digital ? "text-white/15" : "text-black/15"} />
        <motion.path
          d={`${path} L 440 270 L 32 270 Z`}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 1.1, delay: reducedMotion ? 0 : 1.5 }}
        />
        {digital && (
          <motion.path
            d={path}
            fill="none"
            stroke="#3058ff"
            strokeWidth="16"
            strokeLinecap="round"
            style={{ filter: "blur(10px)" }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: visible ? 1 : 0, opacity: visible ? 0.65 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 2.6, ease: "easeIn" }}
          />
        )}
        <motion.path
          d={path}
          fill="none"
          stroke={digital ? "#6e91ff" : "#a1a1aa"}
          strokeWidth={digital ? 5 : 3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: visible ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 2.6, ease: digital ? "easeIn" : "easeInOut" }}
        />
        <circle cx="32" cy="174" r="4" fill={digital ? "#a8baff" : "#a1a1aa"} />
        <motion.circle
          cx="440" cy={endpoint} r={digital ? 6 : 4}
          fill={digital ? "#ffffff" : "#a1a1aa"}
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2, delay: reducedMotion ? 0 : 2.5 }}
        />
        {digital && (
          <g>
            <motion.circle
              cx="440" cy="30" r="8" fill="none" stroke="#829dff" strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={visible && !reducedMotion ? { r: [8, 28, 36], opacity: [0, 0.9, 0] } : { opacity: 0 }}
              transition={{ duration: 0.9, delay: 2.5 }}
            />
            {Array.from({ length: 8 }, (_, index) => {
              const angle = (index * Math.PI) / 4;
              return (
                <motion.line
                  key={index}
                  x1={440 + Math.cos(angle) * 14} y1={30 + Math.sin(angle) * 14}
                  x2={440 + Math.cos(angle) * 29} y2={30 + Math.sin(angle) * 29}
                  stroke="#a8baff" strokeWidth="2" strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={visible && !reducedMotion ? { opacity: [0, 1, 0], pathLength: [0, 1, 1] } : { opacity: 0 }}
                  transition={{ duration: 0.7, delay: 2.55 }}
                />
              );
            })}
          </g>
        )}
      </svg>
      <div className={`mt-2 flex justify-between text-[10px] font-medium uppercase tracking-[0.16em] ${digital ? "text-white/40" : "text-zinc-400"}`}>
        <span>Erster Besuch</span>
        <span>Mit der Zeit →</span>
      </div>
    </div>
  );
}

export default function GrowthComparison() {
  const [replay, setReplay] = useState(0);

  return (
    <section aria-labelledby="growth-heading" className="bg-surface px-5 py-20 sm:px-8 md:py-32">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600">Ein Besuch ist erst der Anfang</p>
            <h2 id="growth-heading" className="text-4xl font-black leading-[1.05] tracking-tighter text-zinc-950 sm:text-5xl md:text-6xl">
              Aus Besuchern werden<br /><span className="text-brand-500">Stammkunden.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg">
              Gib deinen Kunden einen Grund, wiederzukommen. Mit einer Karte, die bleibt – und einer Belohnung, auf die sie sich freuen.
            </p>
          </div>
          <button type="button" onClick={() => setReplay((value) => value + 1)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-black/10 bg-white/70 px-4 text-xs font-semibold text-zinc-600 transition-colors hover:border-brand-200 hover:text-brand-600 motion-reduce:hidden sm:self-auto">
            <RotateCcw size={14} aria-hidden="true" />Noch einmal ansehen
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <figure className="flex flex-col rounded-[2rem] border border-black/5 bg-white/80 p-6 sm:p-9">
            <figcaption>
              <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400"><span className="size-1.5 rounded-full bg-zinc-400" />Ohne digitale Kundenbindung</div>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-600 sm:text-3xl">Einmal da. Und dann?</h3>
              <p className="mt-3 min-h-12 text-sm leading-relaxed text-zinc-500">Keine Karte oder eine Papierkarte, die zu Hause liegt. Der nächste Besuch bleibt dem Zufall überlassen.</p>
            </figcaption>
            <ComparisonChart key={`paper-${replay}`} digital={false} />
            <div className="mt-7 flex items-center gap-3 border-t border-black/5 pt-5 text-sm font-medium text-zinc-500"><ArrowDownRight size={20} aria-hidden="true" />Kontakt kann verloren gehen.</div>
            <p className="sr-only">Schematische graue Kurve, die im Verlauf abfällt. Keine gemessenen Daten.</p>
          </figure>

          <figure className="relative isolate flex flex-col overflow-hidden rounded-[2rem] border border-brand-400/25 bg-[#101320] p-6 shadow-[0_24px_70px_-28px_rgba(48,88,255,0.4)] sm:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-24 -z-10 size-72 rounded-full bg-brand-500/20 blur-[80px]" />
            <figcaption>
              <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-300"><span className="size-1.5 rounded-full bg-brand-400 shadow-[0_0_12px_#3058ff]" />Mit StampNow</div>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Da geht noch mehr.</h3>
              <p className="mt-3 min-h-12 text-sm leading-relaxed text-white/60">Immer in der Wallet. Jeder Stempel bringt die Belohnung näher – und gibt einen Anlass, wiederzukommen.</p>
            </figcaption>
            <ComparisonChart key={`digital-${replay}`} digital />
            <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5 text-sm font-semibold text-brand-200"><ArrowUpRight size={20} aria-hidden="true" />Mehr Anlässe. Mehr Wiedersehen.</div>
            <p className="sr-only">Schematische blaue Kurve, die immer steiler ansteigt und mit einem Lichtimpuls endet. Keine gemessenen Daten.</p>
          </figure>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-zinc-500">Illustrativer Vergleich, keine Messdaten oder Wachstumsprognose. Die tatsächliche Entwicklung hängt von deinem Geschäft, deinen Prämien und der Nutzung ab.</p>
      </div>
    </section>
  );
}
