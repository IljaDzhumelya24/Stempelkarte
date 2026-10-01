/**
 * Demo-Betrieb mit realistischen Beispielkunden – für Verkaufsgespräche und zum Ausprobieren.
 *   node scripts/seed-demo.js
 * Login danach:  demo@stampnow.de / demo-passwort-123   (Mitarbeiter: team@stampnow.de / team-passwort-123)
 * Läuft NICHT in Produktion, außer mit --force (dann nur, wenn der Demo-Betrieb noch nicht existiert).
 */
import { pool, q, one } from '../src/db.js';
import { migrate } from '../src/migrate.js';
import { createBusiness } from '../src/services.js';
import { hashPassword } from '../src/auth.js';
import { newPublicId } from '../src/tokens.js';
import { isProd } from '../src/config.js';

if (isProd && !process.argv.includes('--force')) {
  console.error('Produktion erkannt – mit --force bestätigen.');
  process.exit(1);
}

const FIRST = ['Lena', 'Mia', 'Emma', 'Sophie', 'Hannah', 'Lea', 'Anna', 'Marie', 'Laura', 'Julia', 'Sara', 'Nina',
  'Lukas', 'Leon', 'Finn', 'Jonas', 'Paul', 'Ben', 'Elias', 'Noah', 'Tim', 'Max', 'Can', 'Deniz', 'Aylin', 'Selin',
  'Mehmet', 'Ali', 'Olga', 'Ivan', 'Katja', 'Tom', 'Jan', 'Nils', 'Ole', 'Svenja', 'Merle', 'Jana', 'Kai', 'Timo'];
const LAST = ['Meyer', 'Schulz', 'Wagner', 'Becker', 'Hoffmann', 'Koch', 'Richter', 'Klein', 'Wolf', 'Neumann',
  'Schröder', 'Yilmaz', 'Kaya', 'Petrov', 'Janssen', 'Hinrichs', 'Brandt', 'Lange', 'Krüger', 'Peters'];

let seed = 42;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const pick = (a) => a[Math.floor(rnd() * a.length)];
const DAY = 864e5;

try {
  await migrate();
  if (await one(`SELECT 1 FROM businesses WHERE slug = 'demo-salon'`)) {
    console.log('Demo existiert schon. Zum Neuaufsetzen: DELETE FROM businesses WHERE slug = \'demo-salon\';');
  } else {
    const { business: b } = await createBusiness({
      name: 'Demo Salon Delmenhorst', slug: 'demo-salon', ownerEmail: 'demo@stampnow.de',
      ownerName: 'Demo Inhaberin', password: 'demo-passwort-123',
    });
    await q(`UPDATE businesses SET reward_text = 'Kostenloser Haarschnitt', address = 'Lange Straße 1\n27749 Delmenhorst',
             contact_email = 'demo@stampnow.de', expected_interval_days = 35,
             locations = '[{"label":"Salon","latitude":53.0511,"longitude":8.6310,"relevantText":"Du bist in der Nähe – Zeit für einen neuen Schnitt?"}]'::jsonb
             WHERE id = $1`, [b.id]);
    const staffId = (await one(`INSERT INTO staff (business_id, email, name, role, password_hash)
      VALUES ($1,'team@stampnow.de','Team Tresen','staff',$2) RETURNING id`, [b.id, await hashPassword('team-passwort-123')])).id;

    const now = Date.now();
    const used = new Set();
    for (let i = 0; i < 80; i++) {
      const name = `${pick(FIRST)} ${pick(LAST)}`;
      let phone; do { phone = `+49151${String(Math.floor(rnd() * 1e8)).padStart(8, '0')}`; } while (used.has(phone));
      used.add(phone);
      // Kundentyp bestimmt die Besuchshistorie
      const type = rnd();
      const interval = 21 + Math.floor(rnd() * 35);           // persönlicher Rhythmus 3–8 Wochen
      let visits = [];
      const start = now - (20 + Math.floor(rnd() * 300)) * DAY;
      if (type < 0.15) visits = [];                             // nur angemeldet
      else if (type < 0.4) visits = [start];                    // 1 Besuch
      else {
        let t = start;
        const stopEarly = type > 0.8;                           // wird untreu
        while (t < now - (stopEarly ? interval * 2.2 : 0) * DAY) {
          visits.push(t);
          t += (interval + (rnd() - 0.5) * interval * 0.4) * DAY;
        }
      }
      const created = visits[0] ? visits[0] - 60e3 : now - Math.floor(rnd() * 40) * DAY;
      const consent = rnd() < 0.7;
      const cu = await one(`INSERT INTO customers (business_id, name, phone_e164, marketing_consent, marketing_consent_at,
               marketing_consent_source, created_at, last_activity_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
        [b.id, name, phone, consent, consent ? new Date(created) : null, consent ? 'signup_form' : null,
          new Date(created), new Date(visits.at(-1) || created)]);
      let stamps = 0; let redeemed = 0; let pending = false;
      const card = await one(`INSERT INTO cards (business_id, customer_id, public_id, created_at, has_apple, has_google)
               VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [b.id, cu.id, newPublicId(), new Date(created), rnd() < 0.55, rnd() < 0.45]);
      for (const v of visits) {
        if (pending) {
          await q(`INSERT INTO stamp_events (business_id, card_id, staff_id, kind, amount, created_at) VALUES ($1,$2,$3,'redeem',0,$4)`,
            [b.id, card.id, staffId, new Date(v - 1000)]);
          stamps = 0; pending = false; redeemed++;
          continue; // Belohnungsbesuch zählt nicht als Stempel
        }
        stamps++;
        await q(`INSERT INTO stamp_events (business_id, card_id, staff_id, kind, amount, created_at) VALUES ($1,$2,$3,'stamp',1,$4)`,
          [b.id, card.id, staffId, new Date(v)]);
        if (stamps >= 10) pending = true;
      }
      await q('UPDATE cards SET stamps = $2, reward_pending = $3, rewards_redeemed = $4 WHERE id = $1',
        [card.id, stamps, pending, redeemed]);
    }
    console.log('✓ Demo-Betrieb mit 80 Beispielkunden angelegt');
    console.log('  Inhaber:     demo@stampnow.de / demo-passwort-123');
    console.log('  Mitarbeiter: team@stampnow.de / team-passwort-123');
  }
} catch (e) {
  console.error('✗', e);
  process.exitCode = 1;
} finally {
  await pool.end();
}
