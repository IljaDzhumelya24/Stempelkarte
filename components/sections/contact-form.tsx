'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="rounded-[30px] border border-ink/10 bg-white p-6 shadow-soft"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {['Name', 'Unternehmen', 'E-Mail', 'Telefon optional', 'Art des Geschäfts'].map((label) => (
          <label className={label === 'Art des Geschäfts' ? 'sm:col-span-2' : ''} key={label}>
            <span className="mb-2 block text-sm font-semibold">{label}</span>
            <input className="min-h-12 w-full rounded-2xl border border-ink/10 bg-paper px-4 outline-none focus:border-blue-500" required={!label.includes('optional')} type={label === 'E-Mail' ? 'email' : 'text'} />
          </label>
        ))}
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold">Nachricht</span>
          <textarea className="min-h-36 w-full rounded-2xl border border-ink/10 bg-paper p-4 outline-none focus:border-blue-500" />
        </label>
      </div>
      <button className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white" type="submit">
        <Send size={16} /> Kostenlose Demo anfragen
      </button>
      <a className="ml-3 inline-flex min-h-12 items-center justify-center rounded-full border border-ink/10 px-6 text-sm font-semibold" href="https://wa.me/490000000000" rel="noreferrer" target="_blank">WhatsApp Platzhalter</a>
      {sent && <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">Danke. Deine Anfrage wurde als Demo erfolgreich erfasst.</p>}
    </form>
  );
}
