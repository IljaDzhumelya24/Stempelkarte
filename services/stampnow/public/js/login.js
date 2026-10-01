import { api, $ } from './api.js';

// Schon eingeloggt? Direkt weiter.
api('/api/auth/me', { noRedirect: true }).then((me) => go(me.role)).catch(() => {});

function go(role) {
  const next = new URLSearchParams(location.search).get('next');
  location.href = next && next.startsWith('/') && !next.startsWith('//') ? next : (role === 'owner' ? '/dashboard' : '/scan');
}

$('#f').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('#err'); err.hidden = true;
  $('#go').disabled = true;
  try {
    const r = await api('/api/auth/login', { method: 'POST', body: { email: $('#email').value, password: $('#password').value } });
    go(r.role);
  } catch (ex) {
    err.textContent = ex.message; err.hidden = false;
  } finally {
    $('#go').disabled = false;
  }
});
