// This file is injected only by the separate, local preview server.
const noticeText = 'Nur Vorschau: Hier werden keine Änderungen gespeichert, Nachrichten versendet oder echten Karten erstellt.';
let noticeTimer;
function notice() {
  document.querySelector('.preview-notice')?.remove();
  const element = document.createElement('div');
  element.className = 'preview-notice'; element.role = 'status'; element.textContent = noticeText;
  document.body.append(element);
  clearTimeout(noticeTimer); noticeTimer = setTimeout(() => element.remove(), 6000);
}
// Stop mutations before application handlers run, while leaving navigation, filters,
// drawers and the live card design preview available.
const blockedButtons = '#logout, #runNow, #cDry, #cSend, #save, #sendMsg, #adjBtn, #del, #tAdd, #pSave, #delBtn, #exportBtn, .rule .save, .tgl, .rst';
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const action = target?.closest(blockedButtons);
  const download = target?.closest('a[href^="/api/"]');
  if (action || download) { event.preventDefault(); event.stopImmediatePropagation(); notice(); }
}, true);
document.addEventListener('submit', (event) => { event.preventDefault(); event.stopImmediatePropagation(); notice(); }, true);
document.addEventListener('change', (event) => {
  if (event.target.id === 'consent' || event.target.id === 'logo') {
    event.stopImmediatePropagation();
    if (event.target.id === 'consent') event.target.checked = !event.target.checked;
    else event.target.value = '';
    notice();
  }
}, true);
