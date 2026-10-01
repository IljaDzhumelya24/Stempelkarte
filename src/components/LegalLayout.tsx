import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function LegalLayout({ title, complete, children }: {
  title: string;
  complete: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas text-[#111] selection:bg-brand-500 selection:text-white">
      <Navigation />
      <main className="mx-auto max-w-[850px] px-6 pb-28 pt-40 [overflow-wrap:anywhere] lg:pt-52">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">StampNow · Rechtliches</p>
        <h1 className="mb-12 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">{title}</h1>
        {!complete && (
          <p role="status" className="mb-10 rounded-2xl border border-brand-200 bg-brand-50 p-5 text-sm leading-relaxed text-brand-800">
            Die Angaben zum Betreiber werden derzeit vervollständigt.
          </p>
        )}
        <div className="space-y-10 text-base leading-relaxed text-zinc-600 sm:text-lg [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-zinc-950 [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
