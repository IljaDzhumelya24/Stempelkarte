import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Stamp } from "lucide-react";

export const metadata: Metadata = {
  title: "Anmelden | Stempelkarte",
  robots: { index: false, follow: false },
};

export default function AnmeldenPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#fcfcfc] px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl bg-amber-400 text-zinc-950 shadow-[0_12px_32px_-12px_rgba(245,158,11,0.5)]"><Stamp size={30} aria-hidden="true" /></div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Dein Geschäftsbereich</p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">Bald für dich da.</h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-500">Hier entsteht der Anmeldebereich für dein Geschäft. Schau bald wieder vorbei.</p>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-4"><ArrowLeft size={17} aria-hidden="true" />Zurück zur Startseite</Link>
      </div>
    </main>
  );
}
