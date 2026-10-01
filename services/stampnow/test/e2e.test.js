/**
 * Ende-zu-Ende gegen eine echte Postgres-Datenbank.
 *   TEST_DATABASE_URL=postgres://user:pw@localhost/stampit_test npm test
 * ACHTUNG: leert die angegebene Datenbank komplett.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

const DB = process.env.TEST_DATABASE_URL;
process.env.DATABASE_URL = DB;
process.env.PUBLIC_URL = 'http://localhost:0';
delete process.env.APPLE_TEAM_ID; delete process.env.GOOGLE_ISSUER_ID;

let server, base, pool, services, runner, tokens;

class Client {
  constructor() { this.cookie = ''; }
  async req(method, path, body, { csrf = true, headers = {} } = {}) {
    const h = { ...headers };
    if (csrf) h['X-StampIt'] = '1';
    if (this.cookie) h.cookie = this.cookie;
    if (body !== undefined) h['content-type'] = 'application/json';
    const res = await fetch(base + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' });
    const sc = res.headers.get('set-cookie');
    if (sc) this.cookie = sc.split(';')[0];
    const ct = res.headers.get('content-type') || '';
    return { status: res.status, body: ct.includes('json') ? await res.json() : await res.text(), headers: res.headers };
  }
}

before(async () => {
  if (!DB) return;
  const { default: pg } = await import('pg');
  const c = new pg.Client({ connectionString: DB });
  await c.connect();
  await c.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await c.end();
  ({ pool } = await import('../src/db.js'));
  const { migrate } = await import('../src/migrate.js');
  await migrate();
  services = await import('../src/services.js');
  runner = await import('../src/engine/runner.js');
  tokens = await import('../src/tokens.js');
  const { createApp } = await import('../src/server.js');
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}`;
});

after(async () => { server?.close(); await pool?.end(); });

const skip = !DB && 'TEST_DATABASE_URL nicht gesetzt';

test('kompletter Ablauf', { skip }, async (t) => {
  const { business: bella, ownerPassword } = await services.createBusiness({
    name: 'Salon Bella', slug: 'salon-bella', ownerEmail: 'bella@example.de', ownerName: 'Bella' });
  const { business: other, ownerPassword: otherPw } = await services.createBusiness({
    name: 'Barber Nord', slug: 'barber-nord', ownerEmail: 'nord@example.de' });

  const owner = new Client();
  const anon = new Client();

  await t.test('Login: falsches Passwort, CSRF, richtiges Passwort', async () => {
    assert.equal((await owner.req('POST', '/api/auth/login', { email: 'bella@example.de', password: 'falsch' })).status, 401);
    assert.equal((await owner.req('POST', '/api/auth/login', { email: 'bella@example.de', password: ownerPassword }, { csrf: false })).status, 403);
    const ok = await owner.req('POST', '/api/auth/login', { email: 'BELLA@example.de', password: ownerPassword });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.role, 'owner');
    assert.equal((await anon.req('GET', '/api/dash/overview')).status, 401);
  });

  let manage, publicId, qr;
  await t.test('Kunde meldet sich über Poster-Link an', async () => {
    const info = await anon.req('GET', '/api/public/b/salon-bella');
    assert.equal(info.body.name, 'Salon Bella');
    const noPrivacy = await anon.req('POST', '/api/public/b/salon-bella/signup', { name: 'Lena Meyer', phone: '0151 23456789' });
    assert.equal(noPrivacy.status, 400);
    const badPhone = await anon.req('POST', '/api/public/b/salon-bella/signup', { name: 'Lena', phone: '123', privacyAccepted: true });
    assert.equal(badPhone.status, 400);
    const r = await anon.req('POST', '/api/public/b/salon-bella/signup',
      { name: 'Lena Meyer', phone: '0151 23456789', privacyAccepted: true, marketingConsent: true });
    assert.equal(r.status, 201);
    manage = new URL(r.body.manageUrl);
    publicId = manage.pathname.split('/')[2];
    qr = tokens.qrPayload(publicId);
    // gleiche Nummer (anders geschrieben) → keine zweite Karte, keine Herausgabe
    const dup = await anon.req('POST', '/api/public/b/salon-bella/signup',
      { name: 'Fremder', phone: '+49 151 23456789', privacyAccepted: true });
    assert.equal(dup.status, 409);
    assert.equal(dup.body.manageUrl, undefined);
  });

  await t.test('Kartenseite nur mit gültigem Token', async () => {
    const good = await anon.req('GET', `/api/public/card/${publicId}${manage.search}`);
    assert.equal(good.status, 200);
    assert.equal(good.body.card.stamps, 0);
    assert.equal(good.body.customer.marketingConsent, true);
    assert.equal((await anon.req('GET', `/api/public/card/${publicId}?t=falsch`)).status, 404);
    const svg = await anon.req('GET', `/api/public/card/${publicId}/qr.svg${manage.search}`);
    assert.match(svg.body, /<svg/);
  });

  let eventId;
  await t.test('Scannen: gültig, Sperrzeit, gefälscht, fremder Betrieb', async () => {
    assert.equal((await anon.req('POST', '/api/scan', { qr })).status, 401);
    const r = await owner.req('POST', '/api/scan', { qr });
    assert.equal(r.status, 200);
    assert.equal(r.body.status, 'stamped');
    assert.equal(r.body.stamps, 1);
    assert.equal(r.body.phone.includes('23456789'), false, 'Telefon maskiert');
    eventId = r.body.eventId;
    const again = await owner.req('POST', '/api/scan', { qr });
    assert.equal(again.body.status, 'cooldown');
    assert.equal((await owner.req('POST', '/api/scan', { qr: `SI1.${publicId}.AAAAAAAAAAAAAAAA` })).status, 400);
    assert.equal((await owner.req('POST', '/api/scan', { qr: 'card_1a2b3c4d' })).status, 400);

    const nord = new Client();
    await nord.req('POST', '/api/auth/login', { email: 'nord@example.de', password: otherPw });
    const foreign = await nord.req('POST', '/api/scan', { qr });
    assert.equal(foreign.status, 403);
    assert.equal(foreign.body.code, 'other_business');
    // fremder Inhaber sieht Bellas Kunden nicht
    const list = await nord.req('GET', '/api/dash/customers');
    assert.equal(list.body.customers.length, 0);
  });

  await t.test('Rückgängig und Inhaber-Override', async () => {
    const u = await owner.req('POST', `/api/stamps/${eventId}/undo`);
    assert.equal(u.body.stamps, 0);
    const r = await owner.req('POST', '/api/scan', { qr });
    assert.equal(r.body.status, 'stamped');
    const forced = await owner.req('POST', '/api/scan', { qr, force: true });
    assert.equal(forced.body.status, 'stamped');
    assert.equal(forced.body.stamps, 2);
  });

  const staff = new Client();
  await t.test('Mitarbeiter anlegen: darf scannen, nicht ins Dashboard, kein Override', async () => {
    const c = await owner.req('POST', '/api/dash/staff', { email: 'team@example.de', name: 'Team' });
    assert.equal(c.status, 201);
    await staff.req('POST', '/api/auth/login', { email: 'team@example.de', password: c.body.password });
    assert.equal((await staff.req('GET', '/api/dash/overview')).status, 403);
    const f = await staff.req('POST', '/api/scan', { qr, force: true });
    assert.equal(f.status, 403);
    const cool = await staff.req('POST', '/api/scan', { qr });
    assert.equal(cool.body.status, 'cooldown');
  });

  await t.test('Karte voll → Belohnung einlösen', async () => {
    await pool.query(`UPDATE stamp_events SET created_at = created_at - interval '2 days'`);
    await pool.query(`UPDATE cards SET stamps = 9 WHERE public_id = $1`, [publicId]);
    const r = await staff.req('POST', '/api/scan', { qr });
    assert.equal(r.body.stamps, 10);
    assert.equal(r.body.rewardPending, true);
    await pool.query(`UPDATE stamp_events SET created_at = created_at - interval '2 days'`);
    const p = await staff.req('POST', '/api/scan', { qr });
    assert.equal(p.body.status, 'reward_pending');
    const red = await staff.req('POST', `/api/cards/${p.body.cardId}/redeem`);
    assert.equal(red.body.stamps, 0);
    assert.equal((await staff.req('POST', `/api/cards/${p.body.cardId}/redeem`)).status, 409);
  });

  await t.test('Dashboard: Übersicht, Kunden, Detail', async () => {
    const o = await owner.req('GET', '/api/dash/overview');
    assert.equal(o.status, 200);
    assert.equal(o.body.kpis.customers, 1);
    assert.equal(o.body.weekly.length, 12);
    const list = await owner.req('GET', '/api/dash/customers');
    assert.equal(list.body.customers[0].name, 'Lena Meyer');
    const d = await owner.req('GET', `/api/dash/customers/${list.body.customers[0].customerId}`);
    assert.equal(d.status, 200);
    assert.ok(d.body.events.length >= 3);
  });

  await t.test('Einstellungen inkl. Standorte (Phase 6)', async () => {
    const bad = await owner.req('PUT', '/api/dash/settings', { max_stamps: 500 });
    assert.equal(bad.status, 400);
    const r = await owner.req('PUT', '/api/dash/settings', {
      reward_text: 'Gratis Schnitt', max_stamps: 8, bg_color: '#223344',
      locations: [{ label: 'Salon', latitude: 53.05, longitude: 8.63, relevantText: 'Du bist in der Nähe' }, { latitude: 999, longitude: 1 }],
    });
    assert.equal(r.status, 200);
    const s = await owner.req('GET', '/api/dash/settings');
    assert.equal(s.body.max_stamps, 8);
    assert.equal(s.body.locations.length, 1, 'ungültige Koordinaten verworfen');
  });

  await t.test('Automation: Neukunde bekommt Angebot, nächster Scan gibt doppelte Stempel', async () => {
    // zweiter Kunde mit einem Besuch vor 30 Tagen
    const { card } = await services.createCustomerAndCard(bella, { name: 'Tom Peters', phone: '0170 1234567', marketingConsent: true, source: 'test' });
    await pool.query(`INSERT INTO stamp_events (business_id, card_id, kind, amount, created_at) VALUES ($1,$2,'stamp',1, now() - interval '30 days')`, [bella.id, card.id]);
    await pool.query(`UPDATE cards SET stamps = 1 WHERE id = $1`, [card.id]);
    await pool.query(`UPDATE businesses SET holdout_percent = 0 WHERE id = $1`, [bella.id]);
    const run = await owner.req('POST', '/api/dash/automations/run');
    assert.equal(run.body.sent, 1);
    const card2 = (await pool.query('SELECT * FROM cards WHERE id = $1', [card.id])).rows[0];
    assert.match(card2.news_text, /doppelte Stempel/);
    // zweiter Lauf: nichts Neues (Frequenzgrenze)
    const run2 = await owner.req('POST', '/api/dash/automations/run');
    assert.equal(run2.body.sent, 0);
    const s = await staff.req('POST', '/api/scan', { qr: tokens.qrPayload(card.public_id) });
    assert.equal(s.body.bonus, true);
    assert.equal(s.body.stamps, 3);
    const rules = await owner.req('GET', '/api/dash/rules');
    const eff = rules.body.rules.find((r) => r.key === 'second_visit').effect;
    assert.equal(eff.sent, 1);
    assert.equal(eff.sentReturned, 1);
  });

  await t.test('Manuelle Aktion respektiert Einwilligung', async () => {
    await services.createCustomerAndCard(bella, { name: 'Ohne Werbung', phone: '0170 7654321', marketingConsent: false, source: 'test' });
    const dry = await owner.req('POST', '/api/dash/campaign', { segment: 'all', dryRun: true });
    assert.equal(dry.body.recipients, 1, 'nur Lena (Tom hat heute schon eine Nachricht, Dritter ohne Einwilligung)');
  });

  await t.test('Kunde widerruft, exportiert und löscht selbst', async () => {
    await anon.req('POST', `/api/public/card/${publicId}/consent${manage.search}`, { marketingConsent: false });
    const exp = await anon.req('GET', `/api/public/card/${publicId}/export${manage.search}`);
    assert.equal(exp.body.kunde.werbe_einwilligung, false);
    assert.equal(exp.body.kunde.telefon, '+4915123456789');
    assert.ok(exp.body.besuche.length >= 2);
    assert.equal((await anon.req('POST', `/api/public/card/${publicId}/delete${manage.search}`, { confirm: 'nein' })).status, 400);
    assert.equal((await anon.req('POST', `/api/public/card/${publicId}/delete${manage.search}`, { confirm: 'LÖSCHEN' })).status, 200);
    assert.equal((await anon.req('GET', `/api/public/card/${publicId}${manage.search}`)).status, 404);
    // Statistik bleibt anonym erhalten
    const anonEvents = await pool.query('SELECT count(*)::int AS n FROM stamp_events WHERE card_id IS NULL AND business_id = $1', [bella.id]);
    assert.ok(anonEvents.rows[0].n >= 2);
    assert.equal((await owner.req('POST', '/api/scan', { qr })).status, 404);
  });

  await t.test('Löschfrist: inaktive Kunden werden automatisch gelöscht', async () => {
    await pool.query(`UPDATE customers SET last_activity_at = now() - interval '25 months' WHERE name = 'Ohne Werbung'`);
    assert.equal(await services.purgeInactiveCustomers(), 1);
  });

  await t.test('Mitarbeiter deaktivieren loggt ihn sofort aus', async () => {
    const team = await owner.req('GET', '/api/dash/staff');
    const tm = team.body.find((s) => s.email === 'team@example.de');
    await owner.req('PATCH', `/api/dash/staff/${tm.id}`, { active: false });
    assert.equal((await staff.req('GET', '/api/auth/me')).status, 401);
  });

  await t.test('Apple Web Service: Registrierung nur mit richtigem Token', async () => {
    const { card } = await services.createCustomerAndCard(bella, { name: 'Iris', phone: '0160 9998887', source: 'test' });
    const url = `/wallet/v1/devices/dev1/registrations/pass.com.janik.stampit/${card.public_id}`;
    const bad = await anon.req('POST', url, { pushToken: 'ab'.repeat(32) }, { headers: { authorization: 'ApplePass falsch' }, csrf: false });
    assert.equal(bad.status, 401);
    const ok = await anon.req('POST', url, { pushToken: 'ab'.repeat(32) },
      { headers: { authorization: `ApplePass ${tokens.appleAuthToken(card.public_id)}` }, csrf: false });
    assert.equal(ok.status, 201);
    const list = await anon.req('GET', '/wallet/v1/devices/dev1/registrations/pass.com.janik.stampit', undefined, { csrf: false });
    assert.deepEqual(list.body.serialNumbers, [card.public_id]);
  });

  await t.test('Admin-API nur mit Token', async () => {
    assert.equal((await anon.req('POST', '/api/admin/businesses', { name: 'X', slug: 'xxx', ownerEmail: 'x@x.de' })).status, 401);
  });
});
