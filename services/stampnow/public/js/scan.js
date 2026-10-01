import { api, $, $$, esc, fmtDateTime } from './api.js';

let me = null;
let stream = null;
let busy = false;
let lastCode = { text: '', at: 0 };
let resumeTimer = null;
let detector = null;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// ---------------------------------------------------------------- Start
(async () => {
  me = await api('/api/auth/me');
  $('#who').textContent = `${me.business} · ${me.name || me.email}`;
  $('#dashLink').hidden = me.role !== 'owner';
})();

$('#logout').addEventListener('click', async () => {
  await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
  location.href = '/login';
});

$$('.tabs [data-tab]').forEach((b) => b.addEventListener('click', () => {
  $$('.tabs [data-tab]').forEach((x) => x.classList.toggle('active', x === b));
  ['scan', 'new', 'resend'].forEach((t) => { $(`#tab-${t}`).hidden = t !== b.dataset.tab; });
  if (b.dataset.tab !== 'scan') stopCamera();
}));

// ---------------------------------------------------------------- Kamera
function savedCam() { try { return localStorage.getItem('stampit.cam') || ''; } catch { return ''; } }
function saveCam(id) { try { localStorage.setItem('stampit.cam', id); } catch { /* egal */ } }

async function startCamera(deviceId = savedCam()) {
  stopCamera();
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
    });
  } catch (e) {
    if (deviceId) return startCamera(''); // gespeicherte Kamera weg → Standard
    showResult('bad', `<div class="who">Kamera nicht verfügbar</div><p>${esc(e.message)}. Bitte im Browser die Kamera erlauben (Schloss-Symbol in der Adresszeile).</p>`);
    return;
  }
  const v = $('#video');
  v.srcObject = stream;
  await v.play();
  $('#idle').hidden = true; $('#frame').hidden = false;
  if ('BarcodeDetector' in window) {
    try { detector = new window.BarcodeDetector({ formats: ['qr_code'] }); } catch { detector = null; }
  }
  navigator.wakeLock?.request('screen').catch(() => {});
  fillCameraList(stream.getVideoTracks()[0]?.getSettings().deviceId);
  requestAnimationFrame(loop);
}

function stopCamera() {
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
  $('#idle').hidden = false; $('#frame').hidden = true;
}

async function fillCameraList(activeId) {
  const cams = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'videoinput');
  const sel = $('#camSelect');
  sel.hidden = cams.length < 2;
  sel.innerHTML = cams.map((c, i) => `<option value="${esc(c.deviceId)}"${c.deviceId === activeId ? ' selected' : ''}>${esc(c.label || `Kamera ${i + 1}`)}</option>`).join('');
}

$('#camSelect').addEventListener('change', (e) => { saveCam(e.target.value); startCamera(e.target.value); });
$('#startCam').addEventListener('click', () => startCamera());
document.addEventListener('visibilitychange', () => { if (document.hidden) stopCamera(); });

let lastFrame = 0;
async function loop(ts) {
  if (!stream) return;
  if (!busy && ts - lastFrame > 120) {
    lastFrame = ts;
    const text = await decodeFrame();
    if (text) onCode(text);
  }
  requestAnimationFrame(loop);
}

async function decodeFrame() {
  const v = $('#video');
  if (v.readyState < 2) return null;
  if (detector) {
    try {
      const codes = await detector.detect(v);
      return codes[0]?.rawValue || null;
    } catch { detector = null; }
  }
  const scale = Math.min(1, 640 / Math.max(v.videoWidth, v.videoHeight));
  canvas.width = Math.round(v.videoWidth * scale); canvas.height = Math.round(v.videoHeight * scale);
  ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return window.jsQR(img.data, img.width, img.height, { inversionAttempts: 'attemptBoth' })?.data || null;
}

// ---------------------------------------------------------------- Ergebnis
function showResult(kind, html) {
  const r = $('#result');
  r.innerHTML = `<div class="result ${kind}">${html}</div>`;
}

function scheduleResume(ms) {
  clearTimeout(resumeTimer);
  resumeTimer = setTimeout(() => { busy = false; }, ms);
}

async function onCode(text) {
  if (text === lastCode.text && Date.now() - lastCode.at < 5000) return;
  lastCode = { text, at: Date.now() };
  busy = true;
  navigator.vibrate?.(40);
  await submitScan(text, false);
}

async function submitScan(text, force) {
  try {
    const r = await api('/api/scan', { method: 'POST', body: { qr: text, force } });
    render(r, text);
  } catch (ex) {
    showResult('bad', `<div class="who">${esc(ex.message)}</div>`);
    scheduleResume(2500);
  }
}

function render(r, text) {
  const who = `<div class="who">${esc(r.customerName)} <span class="muted small">${esc(r.phone)}</span></div>`;
  if (r.status === 'stamped') {
    const full = r.rewardPending;
    showResult(full ? 'gold' : 'ok', `
      <div class="big num">${full ? 'Karte voll!' : `✓ ${r.stamps} / ${r.max}`}</div>
      ${who}
      ${r.bonus ? '<p><b>Aktion eingelöst: doppelter Stempel.</b></p>' : ''}
      ${full ? `<p>Beim <b>nächsten</b> Besuch: ${esc(r.rewardText)}.</p>` : `<p class="muted small">${r.visits}. Besuch</p>`}
      <div class="row">
        <button class="btn secondary" id="undo" type="button">Rückgängig</button>
        <button class="btn" id="next" type="button">Nächste Karte</button>
      </div>`);
    $('#undo').onclick = async () => {
      try { await api(`/api/stamps/${r.eventId}/undo`, { method: 'POST' }); showResult('warn', '<div class="who">Stempel zurückgenommen.</div>'); }
      catch (ex) { showResult('bad', `<div class="who">${esc(ex.message)}</div>`); }
      scheduleResume(1500);
    };
    $('#next').onclick = () => { $('#result').innerHTML = ''; busy = false; };
    scheduleResume(4000);
  } else if (r.status === 'reward_pending') {
    showResult('gold', `
      <div class="big">Belohnung einlösen</div>${who}
      <p><b>${esc(r.rewardText)}</b> – danach startet die Karte wieder bei 0.</p>
      <div class="row">
        <button class="btn gold" id="redeem" type="button">Jetzt einlösen</button>
        <button class="btn secondary" id="later" type="button">Später</button>
      </div>`);
    $('#redeem').onclick = async () => {
      try {
        await api(`/api/cards/${r.cardId}/redeem`, { method: 'POST' });
        showResult('ok', `<div class="big">Eingelöst ✓</div>${who}<p>Karte steht wieder auf 0 / ${r.max}.</p>`);
      } catch (ex) { showResult('bad', `<div class="who">${esc(ex.message)}</div>`); }
      scheduleResume(2500);
    };
    $('#later').onclick = () => { $('#result').innerHTML = ''; busy = false; };
  } else if (r.status === 'cooldown') {
    showResult('warn', `
      <div class="big">Schon gestempelt</div>${who}
      <p>Letzter Stempel: ${fmtDateTime(r.lastStampAt)} Uhr. Nächster möglich ab ${fmtDateTime(r.nextAllowedAt)} Uhr.</p>
      <div class="row">
        ${me?.role === 'owner' ? '<button class="btn secondary" id="force" type="button">Trotzdem stempeln</button>' : ''}
        <button class="btn" id="ok" type="button">OK</button>
      </div>`);
    $('#ok').onclick = () => { $('#result').innerHTML = ''; busy = false; };
    const f = $('#force');
    if (f) f.onclick = () => submitScan(text, true);
  }
}

// ---------------------------------------------------------------- Neue Karte / erneut senden
$('#newForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('#nErr'); err.hidden = true;
  if (!$('#nPrivacy').checked) { err.textContent = 'Bitte den Kunden auf die Datenschutzhinweise hinweisen und abhaken.'; err.hidden = false; return; }
  try {
    const r = await api('/api/customers', { method: 'POST', body: {
      name: $('#nName').value, phone: $('#nPhone').value, marketingConsent: $('#nMarketing').checked } });
    $('#newQr').innerHTML = r.qrSvg;
    $('#newForm').hidden = true; $('#newResult').hidden = false;
  } catch (ex) { err.textContent = ex.message; err.hidden = false; }
});
$('#newAgain').addEventListener('click', () => {
  $('#newForm').reset(); $('#newForm').hidden = false; $('#newResult').hidden = true;
});

$('#resendForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('#rErr'); err.hidden = true; $('#resendResult').hidden = true;
  try {
    const r = await api('/api/customers/resend', { method: 'POST', body: { phone: $('#rPhone').value } });
    $('#rName').textContent = r.name; $('#rQr').innerHTML = r.qrSvg; $('#resendResult').hidden = false;
  } catch (ex) { err.textContent = ex.message; err.hidden = false; }
});
