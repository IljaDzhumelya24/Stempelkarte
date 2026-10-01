import { api, $, applyCardColors, cardPreviewHtml, toast } from './api.js';

const publicId = location.pathname.split('/').filter(Boolean)[1];
const t = new URLSearchParams(location.search).get('t') || '';
const base = `/api/public/card/${encodeURIComponent(publicId)}`;
const qs = `?t=${encodeURIComponent(t)}`;

function fail(msg) {
  $('#loading').hidden = true; $('#content').hidden = true;
  $('#err').textContent = msg; $('#err').hidden = false;
}

async function load() {
  try {
    const d = await api(base + qs);
    const p = $('#preview');
    applyCardColors(p, d.business);
    p.innerHTML = cardPreviewHtml({
      name: d.business.name, programName: d.business.programName, stamps: d.card.stamps, max: d.card.max,
      rewardLine: d.card.rewardLine, logoUrl: d.business.logoUrl, customerName: d.customer.name,
    });
    document.title = `${d.business.programName} – ${d.business.name}`;

    const ua = navigator.userAgent;
    const isApple = /iPhone|iPad|Macintosh/.test(ua);
    const isAndroid = /Android/.test(ua);
    if (d.wallet.apple) {
      const a = $('#appleBtn'); a.href = `${base}/apple.pkpass${qs}`; a.hidden = isAndroid;
    }
    if (d.wallet.google) {
      const g = $('#googleBtn'); g.href = `${base}/google${qs}`; g.hidden = isApple && d.wallet.apple;
      if (isAndroid) g.classList.remove('secondary');
    }
    if (!d.wallet.apple && !d.wallet.google) {
      $('#qr').closest('details').open = true;
    }
    $('#qr').innerHTML = await (await fetch(`${base}/qr.svg${qs}`)).text();
    $('#consent').checked = d.customer.marketingConsent;
    $('#exportBtn').href = `${base}/export${qs}`;
    $('#privacyLink').href = `/datenschutz/${encodeURIComponent(d.business.slug)}`;
    $('#loading').hidden = true; $('#content').hidden = false;
  } catch (ex) {
    fail(ex.message || 'Karte konnte nicht geladen werden.');
  }
}

$('#consent').addEventListener('change', async (e) => {
  try {
    await api(`${base}/consent${qs}`, { method: 'POST', body: { marketingConsent: e.target.checked } });
    toast(e.target.checked ? 'Angebote aktiviert' : 'Angebote abbestellt');
  } catch (ex) { toast(ex.message); e.target.checked = !e.target.checked; }
});

$('#delBtn').addEventListener('click', async () => {
  try {
    await api(`${base}/delete${qs}`, { method: 'POST', body: { confirm: $('#delConfirm').value.trim().toUpperCase() } });
    fail('Deine Karte und alle Daten wurden gelöscht. Du kannst die Karte jetzt auch aus deinem Wallet entfernen.');
  } catch (ex) { toast(ex.message); }
});

load();
