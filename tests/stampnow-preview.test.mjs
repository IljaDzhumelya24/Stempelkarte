import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPreviewApp } from '../scripts/preview/server.mjs';

test('local preview renders original pages and fixtures without a database or real login', async () => {
  const server = createPreviewApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const path of ['/', '/dashboard', '/scan', '/k/cafe-nord', '/meine-karte/preview-card?t=preview', '/login', '/datenschutz/cafe-nord']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, path);
      assert.match(await response.text(), /VORSCHAU/);
      assert.equal(response.headers.get('cache-control'), 'no-store');
    }
    assert.equal((await fetch(`${base}/api/auth/me`, { headers: { referer: base + '/login' } })).status, 401);
    assert.equal((await fetch(`${base}/api/auth/me`)).status, 200);
    for (const path of ['/api/dash/overview', '/api/dash/rules', '/api/dash/settings', '/api/dash/staff', '/api/dash/customers/preview-1', '/api/public/card/preview-card', '/api/public/b/cafe-nord']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, path);
      assert.ok(await response.json());
    }
    const filtered = await (await fetch(`${base}/api/dash/customers?segment=at_risk&q=Ben`)).json();
    assert.equal(filtered.customers.length, 1);
    assert.equal(filtered.customers[0].segment, 'at_risk');
    for (const path of ['/api/dash/poster.svg', '/api/public/card/preview-card/qr.svg']) {
      const response = await fetch(base + path);
      assert.match(response.headers.get('content-type'), /svg/);
      assert.match(await response.text(), /<svg/);
    }
    for (const path of ['/css/app.css', '/css/login.css', '/js/dashboard.js', '/preview-assets/preview.js', '/preview-assets/preview.css']) {
      assert.equal((await fetch(base + path)).status, 200, path);
    }
    const before = await (await fetch(`${base}/api/dash/settings`)).json();
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      for (const path of ['/api/dash/settings', '/api/auth/login', '/api/dash/customers/preview-1', '/api/scan']) {
        const response = await fetch(base + path, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Must not be saved' }) });
        assert.equal(response.status, 405, `${method} ${path}`);
        assert.match((await response.json()).error, /Nur Vorschau/);
      }
    }
    assert.deepEqual(await (await fetch(`${base}/api/dash/settings`)).json(), before);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
