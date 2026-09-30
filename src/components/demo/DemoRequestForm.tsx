"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Mail, ShieldCheck } from "lucide-react";

interface DemoRequestFormProps {
  onCompanyChange?: (value: string) => void;
  onIndustryChange?: (value: string) => void;
}

const industries: Record<string, string> = {
  cafe: "Café & Bäckerei",
  kiosk: "Kiosk & Späti",
  salon: "Friseur & Barbershop",
  restaurant: "Restaurant & Gastronomie",
  other: "Anderes Geschäft",
};

const fieldClassName =
  "w-full min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3.5 text-base font-medium text-zinc-950 outline-none transition-colors placeholder:font-normal placeholder:text-zinc-400 hover:border-zinc-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-400/15";

export default function DemoRequestForm({
  onCompanyChange,
  onIndustryChange,
}: DemoRequestFormProps) {
  const [draftHref, setDraftHref] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const readField = (name: string, maxLength: number) =>
      String(data.get(name) ?? "").trim().slice(0, maxLength);
    const name = readField("name", 100);
    const company = readField("company", 120);
    const email = readField("email", 254);
    const industry = industries[readField("industry", 20)] ?? "Anderes Geschäft";
    const message = readField("message", 800);
    const subject = `StampNow Demo für ${company}`;
    const body = [
      "Hallo StampNow-Team,",
      "",
      "ich möchte StampNow bei einer persönlichen Demo kennenlernen.",
      "",
      `Name: ${name}`,
      `Geschäft: ${company}`,
      `E-Mail: ${email}`,
      `Branche: ${industry}`,
      ...(message ? ["", "Meine Nachricht:", message] : []),
      "",
      "Viele Grüße",
      name,
    ].join("\n");
    const href = `mailto:hallo@stempelkarte.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setDraftHref(href);
    window.location.href = href;
  }

  return (
    <section
      id="demo-anfrage"
      aria-labelledby="demo-form-heading"
      className="scroll-mt-28 rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(24,24,27,0.2)] sm:p-9 lg:p-10"
    >
      <div className="mb-7 border-b border-zinc-100 pb-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
            Deine persönliche Demo
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-semibold text-brand-800">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            Unverbindlich
          </span>
        </div>
        <h2
          id="demo-form-heading"
          className="max-w-sm text-[1.75rem] font-bold leading-[1.15] tracking-tight text-zinc-950 sm:text-[2rem]"
        >
          Lernen wir dein Geschäft kennen.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Ein paar Angaben zu dir – und wir zeigen dir, wie StampNow zu deinem Alltag passt.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        onChange={() => setDraftHref(null)}
        className="space-y-5"
      >
        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="min-w-0 space-y-2">
            <label htmlFor="demo-name" className="block text-sm font-semibold text-zinc-800">
              Dein Name
            </label>
            <input
              id="demo-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              pattern=".*\S.*"
              title="Bitte gib deinen Namen ein."
              placeholder="Alex Müller"
              className={fieldClassName}
            />
          </div>
          <div className="min-w-0 space-y-2">
            <label htmlFor="demo-company" className="block text-sm font-semibold text-zinc-800">
              Dein Geschäft
            </label>
            <input
              id="demo-company"
              name="company"
              type="text"
              autoComplete="organization"
              required
              maxLength={120}
              pattern=".*\S.*"
              title="Bitte gib den Namen deines Geschäfts ein."
              placeholder="Café Sonnenseite"
              onChange={(event) => onCompanyChange?.(event.target.value)}
              className={fieldClassName}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="demo-email" className="block text-sm font-semibold text-zinc-800">
            Deine E-Mail-Adresse
          </label>
          <input
            id="demo-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="alex@dein-geschaeft.de"
            className={fieldClassName}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="demo-industry" className="block text-sm font-semibold text-zinc-800">
            Deine Branche
          </label>
          <div className="relative">
            <select
              id="demo-industry"
              name="industry"
              required
              defaultValue=""
              onChange={(event) => onIndustryChange?.(event.target.value)}
              className={`${fieldClassName} appearance-none pr-11 invalid:font-normal invalid:text-zinc-400`}
            >
              <option value="" disabled>Bitte auswählen</option>
              {Object.entries(industries).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="demo-message" className="block text-sm font-semibold text-zinc-800">
            Was möchtest du uns mitgeben?{" "}
            <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <textarea
            id="demo-message"
            name="message"
            rows={3}
            maxLength={800}
            placeholder="Deine Ideen, Fragen oder Wünsche für die Demo …"
            className={`${fieldClassName} min-h-28 resize-y`}
          />
        </div>

        <div className="pt-1">
          <button
            type="submit"
            aria-describedby="demo-email-hint"
            className="brand-button group flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-brand-500 px-5 py-4 text-left text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(48,88,255,0.6)] transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 sm:px-6 sm:text-base"
          >
            Demo per E-Mail anfragen
            <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
          </button>
          <p id="demo-email-hint" className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
            Öffnet einen Entwurf in deinem E-Mail-Programm.
            <br />
            Du prüfst die Angaben und sendest die Anfrage selbst ab.
          </p>
        </div>

        {draftHref && (
          <div role="status" className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm leading-relaxed text-zinc-700">
            <Mail aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
            <div>
              <p className="font-semibold text-zinc-900">Dein E-Mail-Entwurf ist vorbereitet.</p>
              <p className="mt-1">Sende ihn in deinem E-Mail-Programm ab. Es hat sich nichts geöffnet?</p>
              <a href={draftHref} className="mt-2 inline-block font-semibold text-brand-800 underline decoration-brand-400 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
                Entwurf erneut öffnen
              </a>
            </div>
          </div>
        )}

        <p className="flex items-center justify-center gap-2 border-t border-zinc-100 pt-5 text-xs text-zinc-500">
          <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
          <span>
            Infos zum Umgang mit deinen Daten: {" "}
            <Link href="/datenschutz" className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
              Datenschutz
            </Link>
          </span>
        </p>
      </form>
    </section>
  );
}
