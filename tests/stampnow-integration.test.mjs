import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { appPages, appRewrites, appHeaders, backendUrl } from '../scripts/stampnow-routing.mjs';

const source = new URL('../services/stampnow/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('upstream-manifest.json', source), 'utf8'));

test('ZIP business logic, browser scripts and original tests remain byte-identical', async () => {
  for (const [file, expected] of Object.entries(manifest.files)) {
    const bytes = await readFile(new URL(file, source));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected, file);
  }
});

test('restyled pages retain every original interaction target and script', async () => {
  for (const [page, original] of Object.entries(manifest.pages)) {
    const html = await readFile(new URL(`public/${page}.html`, source), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${page}: duplicate IDs`);
    for (const id of original.ids) assert.ok(ids.includes(id), `${page}: missing ${id}`);
    assert.deepEqual(scripts, original.scripts, page);
  }
});

test('all application pages are available without replacing the marketing or legal pages', () => {
  const routes = appRewrites('');
  for (const [url, page] of appPages) {
    assert.ok(routes.some((route) => route.source === url && route.destination === `/stampnow-app/${page}.html`));
  }
  for (const url of ['/', '/preise', '/demo', '/impressum', '/datenschutz']) {
    assert.ok(!routes.some((route) => route.source === url));
  }
  assert.ok(!routes.some((route) => route.source.startsWith('/api')));
});

test('configured backend receives original API, wallet, media and business privacy paths', () => {
  const routes = appRewrites('https://app.example.test/');
  for (const path of ['/api/:path*', '/wallet/v1/:path*', '/media/logo/:path*', '/datenschutz/:slug', '/health']) {
    assert.ok(routes.some((route) => route.source === path && route.destination === `https://app.example.test${path}`));
  }
  assert.equal(backendUrl('  '), null);
  for (const invalid of ['ftp://app.example.test', 'https://user:secret@app.example.test', 'https://app.example.test/api', 'https://app.example.test/?key=secret']) {
    assert.throws(() => backendUrl(invalid));
  }
});

test('private application pages forbid caching and framing while allowing the scanner camera', () => {
  for (const route of appHeaders()) {
    const headers = Object.fromEntries(route.headers.map(({ key, value }) => [key, value]));
    assert.equal(headers['Cache-Control'], 'no-store');
    assert.equal(headers['X-Frame-Options'], 'DENY');
    assert.match(headers['Permissions-Policy'], /camera=\(self\)/);
    assert.match(headers['Content-Security-Policy'], /script-src 'self';/);
    assert.match(headers['Referrer-Policy'], /no-referrer/);
  }
});

test('original server still protects private data and rejects writes without CSRF', async () => {
  const { createApp } = await import('../services/stampnow/src/server.js');
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(`${base}/health`)).status, 200);
    for (const path of ['/api/auth/me', '/api/dash/overview']) {
      assert.equal((await fetch(base + path)).status, 401, path);
    }
    const rejected = await fetch(`${base}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
    });
    assert.equal(rejected.status, 403);
    const logout = await fetch(`${base}/api/auth/logout`, { method: 'POST', headers: { 'X-StampIt': '1' } });
    assert.equal(logout.status, 200);
    assert.match(logout.headers.get('set-cookie'), /stampit_session=; Path=\//);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
