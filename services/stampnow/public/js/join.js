import { api, $, applyCardColors, cardPreviewHtml } from './api.js';

const slug = location.pathname.split('/').filter(Boolean)[1];
let biz = null;

(async () => {
  try {
    biz = await api(`/api/public/b/${encodeURIComponent(slug)}`);
    document.title = `${biz.programName} – ${biz.name}`;
    $('#title').textContent = `${biz.programName} von ${biz.name}`;
    $('#sub').textContent = `Nach ${biz.maxStamps} Stempeln gibt es: ${biz.rewardText}. Kostenlos, direkt ins Wallet – keine App nötig.`;
    $('#privacyLink').href = `/datenschutz/${encodeURIComponent(slug)}`;
    const p = $('#preview');
    applyCardColors(p, biz);
    p.innerHTML = cardPreviewHtml({ name: biz.name, programName: biz.programName, stamps: 0, max: biz.maxStamps,
      rewardLine: `Nach ${biz.maxStamps} Stempeln: ${biz.rewardText}`, logoUrl: biz.logoUrl });
  } catch {
    $('#f').innerHTML = '<h1>Nicht gefunden</h1><p class="muted">Diesen Betrieb gibt es nicht. Bitte den QR-Code im Laden erneut scannen.</p>';
  }
})();

$('#f').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('#err'); err.hidden = true;
  if (!$('#privacy').checked) { err.textContent = 'Bitte die Datenschutzhinweise bestätigen.'; err.hidden = false; return; }
  $('#go').disabled = true;
  try {
    const r = await api(`/api/public/b/${encodeURIComponent(slug)}/signup`, {
      method: 'POST',
      body: { name: $('#name').value, phone: $('#phone').value, privacyAccepted: true, marketingConsent: $('#marketing').checked },
    });
    location.href = r.manageUrl;
  } catch (ex) {
    err.textContent = ex.message; err.hidden = false;
    $('#go').disabled = false;
  }
});
