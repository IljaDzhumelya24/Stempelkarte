// Kleiner Fetch-Wrapper: setzt CSRF-Header, wirft verständliche Fehler.
export async function api(path, { method = 'GET', body, raw, headers = {}, noRedirect = false } = {}) {
  const opts = { method, headers: { 'X-StampIt': '1', ...headers }, credentials: 'same-origin' };
  if (raw) { opts.body = raw; }
  else if (body !== undefined) { opts.body = JSON.stringify(body); opts.headers['Content-Type'] = 'application/json'; }
  const res = await fetch(path, opts);
  let data = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('json')) data = await res.json().catch(() => null);
  if (res.status === 401 && !noRedirect && location.pathname !== '/login' && !path.startsWith('/api/public')) {
    location.href = '/login?next=' + encodeURIComponent(location.pathname + location.hash);
    throw new Error('Bitte neu einloggen.');
  }
  if (!res.ok) {
    const err = new Error(data?.error || `Fehler ${res.status}`);
    err.status = res.status; err.data = data;
    throw err;
  }
  return data;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function toast(msg, ms = 2600) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg; t.setAttribute('role', 'status');
  document.body.append(t);
  setTimeout(() => t.remove(), ms);
}

const dtf = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
const dtt = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
export const fmtDate = (d) => (d ? dtf.format(new Date(d)) : '–');
export const fmtDateTime = (d) => (d ? dtt.format(new Date(d)) : '–');
export const fmtTime = (d) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
export const pct = (x) => (x == null ? '–' : `${Math.round(x * 100)} %`);

export function relDays(d) {
  if (!d) return '–';
  const days = Math.round((Date.now() - new Date(d)) / 864e5);
  if (days <= 0) return 'heute';
  if (days === 1) return 'gestern';
  if (days < 60) return `vor ${days} Tagen`;
  return `vor ${Math.round(days / 30)} Monaten`;
}

/** Karten-Vorschau (HTML) für Kundenseite und Einstellungen. */
export function cardPreviewHtml({ name, programName, stamps, max, rewardLine, logoUrl, customerName }) {
  const dots = Array.from({ length: max }, (_, i) => `<span class="cp-dot${i < stamps ? ' on' : ''}"></span>`).join('');
  return `<div class="cp-top">
      ${logoUrl ? `<img class="cp-logo" src="${esc(logoUrl)}" alt="${esc(name)}">` : `<span class="cp-name">${esc(name)}</span>`}
      <div><div class="cp-label">Stempel</div><div class="num"><b>${stamps} / ${max}</b></div></div>
    </div>
    <div><div class="cp-label">${esc(programName)}</div></div>
    <div class="cp-dots" aria-label="${stamps} von ${max} Stempeln">${dots}</div>
    <div class="row"><div><div class="cp-label">Name</div>${esc(customerName || 'Kundin / Kunde')}</div></div>
    <div class="small">${esc(rewardLine || '')}</div>`;
}

export function applyCardColors(el, { bgColor, fgColor, accentColor }) {
  el.style.setProperty('--card-bg', bgColor);
  el.style.setProperty('--card-fg', fgColor);
  el.style.setProperty('--card-accent', accentColor);
}
