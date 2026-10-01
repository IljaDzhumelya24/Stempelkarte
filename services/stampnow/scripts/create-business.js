/**
 * Neuen Betrieb + Inhaber-Login anlegen (direkt in der Datenbank).
 *   node scripts/create-business.js --name "Salon Bella" --slug salon-bella --email inhaberin@example.de [--owner "Bella"]
 * Auf Railway:  railway run node scripts/create-business.js ...
 */
import { parseArgs } from 'node:util';
import { pool } from '../src/db.js';
import { migrate } from '../src/migrate.js';
import { createBusiness } from '../src/services.js';
import { config } from '../src/config.js';

const { values } = parseArgs({ options: {
  name: { type: 'string' }, slug: { type: 'string' }, email: { type: 'string' }, owner: { type: 'string', default: '' },
} });

try {
  await migrate();
  const { business, ownerPassword } = await createBusiness({
    name: values.name, slug: values.slug, ownerEmail: values.email, ownerName: values.owner,
  });
  console.log('\n✓ Betrieb angelegt');
  console.log(`  Name:         ${business.name}`);
  console.log(`  Login:        ${config.publicUrl}/login`);
  console.log(`  E-Mail:       ${values.email}`);
  console.log(`  Passwort:     ${ownerPassword}   ← nur jetzt sichtbar, bitte sicher weitergeben`);
  console.log(`  Kunden-Link:  ${config.publicUrl}/k/${business.slug}  (steht auch als QR im Dashboard)\n`);
} catch (e) {
  console.error('✗', e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
