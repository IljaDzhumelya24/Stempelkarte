import {
  api, $, $$, esc, toast, fmtDate, fmtDateTime, pct, relDays, cardPreviewHtml, applyCardColors,
} from './api.js';

const SEG = {
  registered: 'Angemeldet', new: 'Neukunde', regular: 'Stammkunde', at_risk: 'Gefährdet', lost: 'Verloren',
};
const segPill = (k) => `<span class="pill"><span class="sw seg-${k}"></span>${esc(SEG[k] || k)}</span>`;
const view = $('#view');
let me = null;
let customerFilter = { segment: 'all', q: '' };

// ------------------------------------------------------------ Router
const VIEWS = { uebersicht: renderOverview, kunden: renderCustomers, aktionen: renderRules, einstellungen: renderSettings, team: renderTeam };
async function route() {
  const key = (location.hash.slice(1) || 'uebersicht').split('?')[0];
  const fn = VIEWS[key] || renderOverview;
  $$('.tabs [data-view]').forEach((a) => a.classList.toggle('active', a.dataset.view === key));
  $('#drawerRoot').innerHTML = '';
  view.innerHTML = '<p class="muted">Lädt …</p>';
  try { await fn(); } catch (ex) { view.innerHTML = `<div class="notice bad">${esc(ex.message)}</div>`; }
}
window.addEventListener('hashchange', route);

(async () => {
  me = await api('/api/auth/me');
  if (me.role !== 'owner') { location.href = '/scan'; return; }
  $('#bizName').textContent = me.business;
  route();
})();

$('#logout').addEventListener('click', async () => {
  await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
  location.href = '/login';
});

// ------------------------------------------------------------ Übersicht
async function renderOverview() {
  const d = await api('/api/dash/overview');
  const k = d.kpis;
  const trend = k.visits_prev7 ? Math.round(((k.visits7 - k.visits_prev7) / k.visits_prev7) * 100) : null;
  const total = d.segments.reduce((s, x) => s + x.count, 0) || 1;
  const walletWarn = !d.wallet.apple && !d.wallet.google;

  view.innerHTML = `
    ${walletWarn ? '<div class="notice warn">Apple und Google Wallet sind auf dem Server noch nicht eingerichtet. Kunden sehen ihre Karte vorerst nur als Webseite mit QR-Code.</div>' : ''}
    <div class="kpis">
      <div class="kpi"><span class="l">Besuche 7 Tage</span><span class="v">${k.visits7}</span>
        <span class="d ${trend == null ? 'muted' : trend >= 0 ? 'up' : 'down'}">${trend == null ? 'keine Vorwoche' : `${trend >= 0 ? '▲' : '▼'} ${Math.abs(trend)} % zur Vorwoche`}</span></div>
      <div class="kpi"><span class="l">Kunden</span><span class="v">${k.customers}</span><span class="d muted">+${k.new30} in 30 Tagen</span></div>
      <div class="kpi"><span class="l">Wiederkehrquote</span><span class="v">${pct(k.returnRate)}</span>
        <span class="d muted">${k.returnCohort ? `von ${k.returnCohort} Neukunden kamen wieder` : 'noch zu wenig Daten'}</span></div>
      <div class="kpi"><span class="l">Belohnungen 30 T.</span><span class="v">${k.redeemed30}</span><span class="d muted">eingelöst</span></div>
      <div class="kpi"><span class="l">Angebote erlaubt</span><span class="v">${pct(k.customers ? k.consent / k.customers : null)}</span><span class="d muted">${k.messages30} Nachrichten in 30 T.</span></div>
    </div>
    <div class="cols">
      <section class="section">
        <div class="section-head"><h2>Besuche pro Woche</h2><span class="muted small">letzte 12 Wochen</span></div>
        <div class="chart" id="chart"></div>
      </section>
      <section class="section">
        <div class="section-head"><h2>Kundenstamm</h2><span class="muted small num">${d.segments.reduce((n, x) => n + x.count, 0)} gesamt</span></div>
        <div class="segbar" id="segbar">${d.segments.map((s) => `<span class="seg-${s.key}" data-w="${s.count / total}" title="${esc(s.label)}: ${s.count}"></span>`).join('')}</div>
        <div class="seglist">${d.segments.map((s) => `
          <button type="button" data-seg="${s.key}"><span class="sw seg-${s.key}"></span>
            <span><b>${esc(s.label)}</b><br><span class="muted small">${esc(s.hint)}</span></span>
            <span class="spacer"></span><b class="num">${s.count}</b></button>`).join('')}</div>
      </section>
    </div>
    <div class="cols">
      <section class="section" id="todo">
        <div class="section-head"><h2>Überfällig</h2><a href="#kunden" id="allRisk" class="small">alle gefährdeten Kunden</a></div>
        <div id="todoList" class="muted small">Lädt …</div>
      </section>
      <section class="section">
        <h2>Poster für den Laden</h2>
        <p class="muted small">Kunden scannen diesen Code, tragen sich ein und legen die Karte ins Wallet.</p>
        <div class="qrbox" id="posterQr"></div>
        <p class="small num">${esc(d.signupUrl)}</p>
        <button class="btn secondary" id="printPoster" type="button">Poster drucken</button>
      </section>
    </div>`;

  $$('#segbar span').forEach((s) => { s.style.width = `${Number(s.dataset.w) * 100}%`; });
  $$('.seglist [data-seg]').forEach((b) => b.addEventListener('click', () => {
    customerFilter = { segment: b.dataset.seg, q: '' }; location.hash = 'kunden';
  }));
  $('#allRisk').addEventListener('click', () => { customerFilter = { segment: 'at_risk', q: '' }; });
  drawChart($('#chart'), d.weekly);

  const svg = await fetch('/api/dash/poster.svg').then((r) => r.text());
  $('#posterQr').innerHTML = svg;
  $('#poster').innerHTML = `<h1>${esc(d.business.name)}</h1><p>Digitale Stempelkarte – kostenlos, ohne App</p>
    <div class="qrbox">${svg}</div><p>Code scannen · eintragen · ins Wallet legen<br>Nach ${d.business.maxStamps} Stempeln gibt es eine Belohnung</p>`;
  $('#printPoster').addEventListener('click', () => window.print());

  const list = await api('/api/dash/customers?segment=at_risk');
  const top = list.customers.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt)).slice(0, 6);
  $('#todoList').innerHTML = top.length
    ? `<div class="timeline">${top.map((c) => `<div><span><b>${esc(c.name)}</b> <span class="muted">· alle ${Math.round(c.intervalDays)} Tage</span></span>
        <span class="muted">zuletzt ${relDays(c.lastVisit)}</span></div>`).join('')}</div>
       <p class="muted small">Mit aktiver Automation „Stammkunde zurückholen“ bekommen diese Kunden automatisch ein Angebot (falls sie zugestimmt haben).</p>`
    : '<p class="muted">Niemand überfällig. Gut so.</p>';
}

function drawChart(el, weeks) {
  const W = 640, H = 220, padL = 34, padB = 26, padT = 12;
  const max = Math.max(4, ...weeks.map((w) => w.visits));
  const step = Math.ceil(max / 4);
  const top = step * 4;
  const bw = (W - padL) / weeks.length;
  const y = (v) => padT + (H - padT - padB) * (1 - v / top);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Besuche pro Woche">`;
  for (let v = 0; v <= top; v += step) {
    s += `<line class="grid" x1="${padL}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text x="${padL - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
  }
  weeks.forEach((w, i) => {
    const x = padL + i * bw + bw * 0.18;
    const h = y(0) - y(w.visits);
    s += `<rect class="bar${i === weeks.length - 1 ? ' current' : ''}" x="${x}" y="${y(w.visits)}" width="${bw * 0.64}" height="${Math.max(0, h)}" rx="3"><title>Woche ab ${fmtDate(w.week)}: ${w.visits} Besuche</title></rect>`;
    if (i % 2 === weeks.length % 2 || i === weeks.length - 1) {
      s += `<text x="${x + bw * 0.32}" y="${H - 8}" text-anchor="middle">${new Date(w.week).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</text>`;
    }
  });
  el.innerHTML = s + '</svg>';
}

// ------------------------------------------------------------ Kunden
async function renderCustomers() {
  view.innerHTML = `
    <section class="section">
      <div class="section-head"><h2>Kunden</h2><span class="muted small" id="count"></span></div>
      <div class="row">
        <input id="q" type="search" placeholder="Name oder Nummer suchen" value="${esc(customerFilter.q)}" aria-label="Suchen">
      </div>
      <div class="chips" id="chips">
        ${[['all', 'Alle'], ...Object.entries(SEG)].map(([k, l]) => `<button type="button" data-seg="${k}" class="${customerFilter.segment === k ? 'active' : ''}">${esc(l)}</button>`).join('')}
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Name</th><th>Status</th><th>Besuche</th><th>Zuletzt</th><th>Rhythmus</th><th>Karte</th><th>Angebote</th></tr></thead>
        <tbody id="rows"></tbody></table></div>
    </section>`;
  let timer;
  $('#q').addEventListener('input', (e) => { clearTimeout(timer); timer = setTimeout(() => { customerFilter.q = e.target.value; load(); }, 250); });
  $$('#chips button').forEach((b) => b.addEventListener('click', () => {
    customerFilter.segment = b.dataset.seg;
    $$('#chips button').forEach((x) => x.classList.toggle('active', x === b));
    load();
  }));
  async function load() {
    const p = new URLSearchParams({ segment: customerFilter.segment, q: customerFilter.q });
    const d = await api(`/api/dash/customers?${p}`);
    $('#count').textContent = `${d.customers.length} von ${d.total}`;
    $('#rows').innerHTML = d.customers.length ? d.customers.map((c) => `
      <tr data-id="${c.customerId}" tabindex="0">
        <td><b>${esc(c.name)}</b><br><span class="muted small num">${esc(c.phone)}</span></td>
        <td>${segPill(c.segment)}</td>
        <td class="num">${c.visits}</td>
        <td>${relDays(c.lastVisit)}</td>
        <td class="num">${c.visits >= 2 ? `alle ${Math.round(c.intervalDays)} T.` : '–'}</td>
        <td class="num">${c.rewardPending ? '<b>voll</b>' : `${c.stamps}`} <span class="muted small">${esc(c.wallet)}</span></td>
        <td>${c.consent ? 'ja' : '<span class="muted">nein</span>'}</td>
      </tr>`).join('') : '<tr><td colspan="7" class="muted">Keine Kunden in dieser Auswahl.</td></tr>';
    $$('#rows tr[data-id]').forEach((tr) => {
      tr.addEventListener('click', () => openCustomer(tr.dataset.id));
      tr.addEventListener('keydown', (e) => { if (e.key === 'Enter') openCustomer(tr.dataset.id); });
    });
  }
  await load();
}

async function openCustomer(id) {
  const d = await api(`/api/dash/customers/${id}`);
  const c = d.customer; const s = d.seg || {};
  const root = $('#drawerRoot');
  const kindLabel = { stamp: 'Stempel', redeem: 'Belohnung eingelöst', adjust: 'Korrektur', undo: 'Rückgängig' };
  root.innerHTML = `
    <div class="drawer-bg" id="dbg"></div>
    <aside class="drawer" role="dialog" aria-label="Kunde ${esc(c.name)}">
      <div class="section-head"><h2>${esc(c.name)}</h2><button class="btn ghost" id="close" type="button">Schließen</button></div>
      <div class="row">${segPill(s.segment)} <span class="muted small num">${esc(c.phone)}</span></div>
      <div class="kpis">
        <div class="kpi"><span class="l">Besuche</span><span class="v">${s.visits ?? 0}</span></div>
        <div class="kpi"><span class="l">Rhythmus</span><span class="v">${s.visits >= 2 ? Math.round(s.intervalDays) : '–'}</span><span class="d muted">Tage</span></div>
        <div class="kpi"><span class="l">Karte</span><span class="v num">${d.card.stamps}</span><span class="d muted">${d.card.rewardsRedeemed}× eingelöst</span></div>
      </div>
      <p class="small">${s.dueAt ? `Nächster Besuch erwartet: <b>${fmtDate(s.dueAt)}</b>` : 'Noch kein Besuch.'}
        · Angebote: <b>${c.consent ? `ja (seit ${fmtDate(c.consentAt)})` : 'nein'}</b>
        · Wallet: ${d.card.apple ? 'Apple ' : ''}${d.card.google ? 'Google' : ''}${!d.card.apple && !d.card.google ? '–' : ''}</p>

      <section class="section">
        <h3>Nachricht auf die Karte</h3>
        ${c.consent ? `<textarea id="msg" maxlength="300" placeholder="z. B. Diese Woche 10 % auf Färben"></textarea>
          <button class="btn" id="sendMsg" type="button">Senden</button>` : '<p class="muted small">Nicht möglich – keine Einwilligung für Angebote.</p>'}
      </section>

      <section class="section">
        <h3>Verlauf</h3>
        <div class="timeline">${d.events.map((e) => `<div><span>${esc(kindLabel[e.kind] || e.kind)}${e.amount > 1 ? ` (+${e.amount})` : ''}
          <span class="muted small">${esc(e.staff_name || '')}</span></span><span class="muted num">${fmtDateTime(e.created_at)}</span></div>`).join('') || '<p class="muted small">Noch nichts.</p>'}</div>
        ${d.messages.length ? `<h3>Nachrichten</h3><div class="timeline">${d.messages.map((m) => `<div><span>${m.variant === 'holdout' ? '<span class="muted">Kontrollgruppe (nicht gesendet)</span>' : esc(m.message)}</span>
          <span class="muted num">${fmtDate(m.created_at)}</span></div>`).join('')}</div>` : ''}
      </section>

      <section class="section">
        <h3>Korrektur &amp; Datenschutz</h3>
        <div class="row"><label>Stempel setzen auf <input id="adj" type="number" min="0" value="${d.card.stamps}"></label>
          <button class="btn secondary" id="adjBtn" type="button">Speichern</button></div>
        <div class="row">
          <a class="btn secondary" href="/api/dash/customers/${c.id}/export" download>Daten exportieren</a>
        </div>
        <details><summary class="small">Kunde löschen</summary>
          <div class="stack"><p class="small">Löscht Name, Nummer und Karte endgültig. Anonyme Besuchszahlen bleiben in der Statistik.</p>
          <button class="btn danger" id="del" type="button">Endgültig löschen</button></div></details>
      </section>
    </aside>`;
  const close = () => { root.innerHTML = ''; };
  $('#close').onclick = close; $('#dbg').onclick = close;
  document.addEventListener('keydown', function esc_(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc_); } });
  $('#close').focus();
  const send = $('#sendMsg');
  if (send) send.onclick = async () => {
    try { const r = await api(`/api/dash/customers/${c.id}/message`, { method: 'POST', body: { text: $('#msg').value } });
      toast(r.ok ? 'Nachricht gesendet' : 'Gespeichert – Karte ist in keinem Wallet'); openCustomer(id); } catch (ex) { toast(ex.message); }
  };
  $('#adjBtn').onclick = async () => {
    try { await api(`/api/dash/customers/${c.id}/adjust`, { method: 'POST', body: { stamps: Number($('#adj').value) } }); toast('Gespeichert'); openCustomer(id); }
    catch (ex) { toast(ex.message); }
  };
  $('#del').onclick = async () => {
    try { await api(`/api/dash/customers/${c.id}`, { method: 'DELETE' }); close(); toast('Kunde gelöscht'); route(); }
    catch (ex) { toast(ex.message); }
  };
}

// ------------------------------------------------------------ Aktionen
async function renderRules() {
  const d = await api('/api/dash/rules');
  const paramLabels = { afterDays: 'nach Tagen', maxMissing: 'fehlende Stempel', minRatio: 'ab Anteil des Rhythmus', offerDays: 'Angebot gültig (Tage)' };
  const eff = (e) => {
    if (!e) return '<span class="muted">Noch nicht ausgelöst.</span>';
    return `<span><b class="num">${e.sent}</b> gesendet · <b>${pct(e.sentRate)}</b> kamen innerhalb 21 Tagen</span>
      <span class="muted">Kontrollgruppe: ${e.holdout ? `${pct(e.holdoutRate)} (${e.holdout})` : '–'}</span>
      ${e.uplift != null ? `<span class="${e.uplift >= 0 ? 'up' : 'down'}">${e.uplift >= 0 ? '+' : ''}${Math.round(e.uplift * 100)} Pp.${e.reliable ? '' : ' (noch zu wenig Daten)'}</span>` : ''}`;
  };
  view.innerHTML = `
    <section class="section">
      <div class="section-head"><h2>Automatische Aktionen</h2>
        <button class="btn secondary" id="runNow" type="button">Jetzt prüfen &amp; senden</button></div>
      <p class="muted small">Nur Kunden mit Einwilligung. Höchstens eine automatische Nachricht alle ${d.settings.message_cap_days} Tage pro Kunde.
        Gesendet wird Mo–Sa zwischen 10 und 19 Uhr. ${d.settings.holdout_percent} % der passenden Kunden bekommen bewusst nichts
        (Kontrollgruppe) – nur so sieht man, ob die Nachrichten wirklich zusätzliche Besuche bringen.
        Platzhalter: {name} {business} {reward} {missing} {offerDays}</p>
    </section>
    ${d.rules.map((r) => `
      <section class="rule ${r.enabled ? '' : 'off'}" data-key="${r.key}">
        <div class="rule-head">
          <div><h3>${esc(r.title)}</h3><p class="muted small">${esc(r.description)}</p></div>
          <label class="switch"><input type="checkbox" class="en" ${r.enabled ? 'checked' : ''}> aktiv</label>
        </div>
        <textarea class="msg" maxlength="300" aria-label="Nachricht">${esc(r.message)}</textarea>
        <div class="grid2">${Object.entries(r.params).map(([k, v]) => `<label>${esc(paramLabels[k] || k)} <input type="number" step="any" min="0" data-p="${k}" value="${v}"></label>`).join('')}</div>
        <div class="effect small">${eff(r.effect)}</div>
        <div><button class="btn save" type="button">Speichern</button></div>
      </section>`).join('')}
    <section class="section">
      <h2>Einmalige Aktion senden</h2>
      <div class="grid2">
        <label>An <select id="cSeg"><option value="all">Alle mit Einwilligung</option>${Object.entries(SEG).map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select></label>
        <label>Doppelte Stempel für (Tage, 0 = nein) <input id="cDays" type="number" min="0" max="60" value="0"></label>
      </div>
      <label>Nachricht <textarea id="cMsg" maxlength="300" placeholder="Hallo {name}, diese Woche gibt es bei {business} …"></textarea></label>
      <div class="row"><button class="btn secondary" id="cDry" type="button">Empfänger zählen</button>
        <button class="btn" id="cSend" type="button" disabled>Senden</button><span id="cInfo" class="small muted"></span></div>
    </section>`;

  $$('.rule').forEach((el) => {
    $('.save', el).onclick = async () => {
      const params = Object.fromEntries($$('[data-p]', el).map((i) => [i.dataset.p, Number(i.value)]));
      try {
        await api(`/api/dash/rules/${el.dataset.key}`, { method: 'PUT', body: { enabled: $('.en', el).checked, message: $('.msg', el).value, params } });
        el.classList.toggle('off', !$('.en', el).checked); toast('Gespeichert');
      } catch (ex) { toast(ex.message); }
    };
  });
  $('#runNow').onclick = async () => {
    const r = await api('/api/dash/automations/run', { method: 'POST' });
    toast(`${r.sent} gesendet · ${r.holdout} Kontrollgruppe · ${r.failed} fehlgeschlagen`, 4000);
    renderRules();
  };
  const body = () => ({ segment: $('#cSeg').value, message: $('#cMsg').value, offerDays: Number($('#cDays').value) });
  $('#cDry').onclick = async () => {
    const r = await api('/api/dash/campaign', { method: 'POST', body: { ...body(), dryRun: true } });
    $('#cInfo').textContent = `${r.recipients} Empfänger (ohne Kunden, die heute schon eine Nachricht bekamen)`;
    $('#cSend').disabled = r.recipients === 0;
  };
  $('#cSeg').onchange = () => { $('#cSend').disabled = true; $('#cInfo').textContent = ''; };
  $('#cSend').onclick = async () => {
    $('#cSend').disabled = true;
    try { const r = await api('/api/dash/campaign', { method: 'POST', body: body() }); toast(`An ${r.sent} Karten gesendet`); $('#cInfo').textContent = ''; }
    catch (ex) { toast(ex.message); $('#cSend').disabled = false; }
  };
}

// ------------------------------------------------------------ Einstellungen
async function renderSettings() {
  const s = await api('/api/dash/settings');
  const f = (k, label, type = 'text', extra = '') => `<label>${label} <input id="s_${k}" type="${type}" value="${esc(s[k])}" ${extra}></label>`;
  view.innerHTML = `
    <div class="cols">
      <div class="stack">
        <section class="section"><h2>Stempelkarte</h2>
          <div class="grid2">
            ${f('name', 'Name des Betriebs')}
            ${f('program_name', 'Name der Karte')}
            ${f('reward_text', 'Belohnung')}
            ${f('max_stamps', 'Stempel bis zur Belohnung', 'number', 'min="2" max="50"')}
            ${f('stamp_cooldown_hours', 'Sperrzeit zwischen Stempeln (Std.)', 'number', 'min="0" max="168"')}
            ${f('expected_interval_days', 'Üblicher Abstand zwischen Besuchen (Tage)', 'number', 'min="3" max="365"')}
          </div>
          <p class="muted small">Der übliche Abstand ist der Startwert für neue Kunden. Ab dem 3. Besuch rechnet StampNow mit dem persönlichen Rhythmus jedes Kunden.</p>
        </section>
        <section class="section"><h2>Design</h2>
          <div class="grid2">
            ${f('bg_color', 'Hintergrund', 'color')}${f('fg_color', 'Schrift', 'color')}${f('accent_color', 'Akzent', 'color')}
            <label>Logo (PNG, quer, max. 400 KB) <input id="logo" type="file" accept="image/png"></label>
          </div>
        </section>
        <section class="section"><h2>Kontakt (erscheint in den Datenschutzhinweisen)</h2>
          <label>Adresse <textarea id="s_address" rows="2">${esc(s.address)}</textarea></label>
          <div class="grid2">${f('contact_email', 'E-Mail', 'email')}${f('contact_phone', 'Telefon', 'tel')}</div>
          <a class="small" href="/datenschutz/${esc(s.slug)}" target="_blank" rel="noopener">Datenschutzhinweise ansehen</a>
        </section>
        <section class="section"><h2>Standorte</h2>
          <p class="muted small">iPhones zeigen die Karte auf dem Sperrbildschirm, wenn der Kunde in der Nähe ist (bis zu 10 Standorte).
            Ob und wann das passiert, entscheidet iOS – es ist ein Extra, keine garantierte Benachrichtigung.
            Koordinaten: in Google Maps Rechtsklick auf den Laden → oberste Zeile anklicken (kopiert „53.05, 8.63“).</p>
          <div id="locs" class="stack"></div>
          <div><button class="btn secondary" id="addLoc" type="button">Standort hinzufügen</button></div>
        </section>
        <section class="section"><h2>Datenschutz &amp; Nachrichten</h2>
          <div class="grid2">
            ${f('retention_months', 'Daten löschen nach Inaktivität (Monate)', 'number', 'min="3" max="60"')}
            ${f('message_cap_days', 'Max. 1 automatische Nachricht alle … Tage', 'number', 'min="3" max="90"')}
            ${f('holdout_percent', 'Kontrollgruppe (%)', 'number', 'min="0" max="50"')}
          </div>
        </section>
        <div class="row"><button class="btn big" id="save" type="button">Alles speichern</button></div>
      </div>
      <div class="stack">
        <section class="section"><h2>Vorschau</h2><div class="card-preview card-mini" id="prev"></div>
          <p class="muted small">Apple und Google stellen die Karte in ihrem eigenen Layout dar – Farben, Logo und Texte kommen von hier.</p></section>
      </div>
    </div>`;

  const locs = $('#locs');
  const locRow = (l = {}) => {
    const d = document.createElement('div');
    d.className = 'loc';
    d.innerHTML = `<label>Bezeichnung <input class="l-label" value="${esc(l.label || '')}" placeholder="Filiale Mitte"></label>
      <label>Breite <input class="l-lat" type="number" step="any" value="${l.latitude ?? ''}"></label>
      <label>Länge <input class="l-lng" type="number" step="any" value="${l.longitude ?? ''}"></label>
      <label>Text auf dem Sperrbildschirm <input class="l-text" maxlength="100" value="${esc(l.relevantText || '')}" placeholder="Du bist in der Nähe – Zeit für einen Kaffee?"></label>
      <button class="btn ghost l-del" type="button">Entfernen</button>`;
    $('.l-lat', d).addEventListener('paste', (e) => {
      const t = e.clipboardData.getData('text'); const m = t.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
      if (m) { e.preventDefault(); $('.l-lat', d).value = m[1]; $('.l-lng', d).value = m[2]; }
    });
    $('.l-del', d).onclick = () => d.remove();
    locs.append(d);
  };
  (s.locations || []).forEach(locRow);
  $('#addLoc').onclick = () => { if ($$('.loc', locs).length < 10) locRow(); };

  const preview = () => {
    const p = $('#prev');
    applyCardColors(p, { bgColor: $('#s_bg_color').value, fgColor: $('#s_fg_color').value, accentColor: $('#s_accent_color').value });
    const max = Number($('#s_max_stamps').value) || 10;
    p.innerHTML = cardPreviewHtml({ name: $('#s_name').value, programName: $('#s_program_name').value, stamps: Math.min(3, max), max,
      rewardLine: `Nach ${max} Stempeln: ${$('#s_reward_text').value}`, logoUrl: s.logoUrl, customerName: 'Lena M.' });
  };
  $$('input, textarea', view).forEach((i) => i.addEventListener('input', preview));
  preview();

  $('#logo').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try { await api('/api/dash/settings/logo', { method: 'PUT', raw: file, headers: { 'Content-Type': 'image/png' } }); toast('Logo gespeichert'); }
    catch (ex) { toast(ex.message); }
  };

  $('#save').onclick = async () => {
    const body = {};
    for (const k of ['name', 'program_name', 'reward_text', 'max_stamps', 'stamp_cooldown_hours', 'expected_interval_days',
      'bg_color', 'fg_color', 'accent_color', 'address', 'contact_email', 'contact_phone', 'retention_months', 'message_cap_days', 'holdout_percent']) {
      body[k] = $(`#s_${k}`).value;
    }
    body.locations = $$('.loc', locs).map((d) => ({
      label: $('.l-label', d).value, latitude: $('.l-lat', d).value, longitude: $('.l-lng', d).value, relevantText: $('.l-text', d).value,
    })).filter((l) => l.latitude !== '' && l.longitude !== '');
    try { await api('/api/dash/settings', { method: 'PUT', body }); toast('Gespeichert – Wallet-Karten werden aktualisiert'); $('#bizName').textContent = body.name; }
    catch (ex) { toast(ex.message); }
  };
}

// ------------------------------------------------------------ Team
async function renderTeam() {
  const list = await api('/api/dash/staff');
  view.innerHTML = `
    <div class="cols">
      <section class="section">
        <h2>Team</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Name</th><th>Rolle</th><th>Zuletzt aktiv</th><th></th></tr></thead>
          <tbody>${list.map((s) => `<tr>
            <td><b>${esc(s.name || '–')}</b><br><span class="muted small">${esc(s.email)}</span></td>
            <td>${s.role === 'owner' ? 'Inhaber' : 'Mitarbeiter'}${s.active ? '' : ' <span class="pill">deaktiviert</span>'}</td>
            <td>${s.last_login_at ? relDays(s.last_login_at) : 'nie'}</td>
            <td class="row">${s.id === me.id ? '<span class="muted small">du</span>' : `
              <button class="btn ghost tgl" data-id="${s.id}" data-active="${s.active}" type="button">${s.active ? 'Deaktivieren' : 'Aktivieren'}</button>
              <button class="btn ghost rst" data-id="${s.id}" type="button">Neues Passwort</button>`}</td></tr>`).join('')}</tbody>
        </table></div>
        <div id="pwOut"></div>
      </section>
      <div class="stack">
        <section class="section">
          <h2>Mitarbeiter hinzufügen</h2>
          <p class="muted small">Jede Person bekommt ein eigenes Login – so sieht man, wer gestempelt hat, und kann einzelne Zugänge sperren.</p>
          <label>Name <input id="tName"></label>
          <label>E-Mail <input id="tEmail" type="email"></label>
          <label>Rolle <select id="tRole"><option value="staff">Mitarbeiter (nur Scanner)</option><option value="owner">Inhaber (alles)</option></select></label>
          <button class="btn" id="tAdd" type="button">Hinzufügen</button>
        </section>
        <section class="section">
          <h2>Mein Passwort</h2>
          <label>Aktuell <input id="pCur" type="password" autocomplete="current-password"></label>
          <label>Neu (mind. 10 Zeichen) <input id="pNew" type="password" autocomplete="new-password"></label>
          <button class="btn secondary" id="pSave" type="button">Ändern</button>
        </section>
      </div>
    </div>`;
  const showPw = (email, pw) => {
    $('#pwOut').innerHTML = `<div class="notice ok stack"><span>Zugang für <b>${esc(email)}</b> – Passwort nur jetzt sichtbar:</span>
      <div class="pw-box">${esc(pw)}</div><span class="small">Login unter ${esc(location.origin)}/login</span></div>`;
  };
  $$('.tgl').forEach((b) => { b.onclick = async () => {
    try { await api(`/api/dash/staff/${b.dataset.id}`, { method: 'PATCH', body: { active: b.dataset.active !== 'true' } }); renderTeam(); }
    catch (ex) { toast(ex.message); }
  }; });
  $$('.rst').forEach((b) => { b.onclick = async () => {
    const r = await api(`/api/dash/staff/${b.dataset.id}/reset-password`, { method: 'POST' });
    showPw(b.closest('tr').querySelector('.muted').textContent, r.password);
  }; });
  $('#tAdd').onclick = async () => {
    try {
      const r = await api('/api/dash/staff', { method: 'POST', body: { name: $('#tName').value, email: $('#tEmail').value, role: $('#tRole').value } });
      await renderTeam(); showPw(r.email, r.password);
    } catch (ex) { toast(ex.message); }
  };
  $('#pSave').onclick = async () => {
    try { await api('/api/me/password', { method: 'POST', body: { current: $('#pCur').value, next: $('#pNew').value } }); toast('Passwort geändert'); $('#pCur').value = ''; $('#pNew').value = ''; }
    catch (ex) { toast(ex.message); }
  };
}
