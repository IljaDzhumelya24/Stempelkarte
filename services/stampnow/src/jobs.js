/**
 * Hintergrund-Jobs im selben Prozess:
 *  - alle 15 Minuten: Automationen (sendet nur Mo–Sa 10–19 Uhr)
 *  - einmal täglich: Löschfristen (inaktive Kunden) + abgelaufene Angebote aufräumen
 * Ein Postgres-Advisory-Lock sorgt dafür, dass bei mehreren Instanzen nur eine arbeitet.
 */
import { pool, q } from './db.js';
import { runAutomations } from './engine/runner.js';
import { purgeInactiveCustomers } from './services.js';
import { config } from './config.js';

const LOCK_ID = 777001;
let lastPurgeDay = null;

async function withLock(fn) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT pg_try_advisory_lock($1) AS ok', [LOCK_ID]);
    if (!rows[0].ok) return null;
    try { return await fn(); } finally { await client.query('SELECT pg_advisory_unlock($1)', [LOCK_ID]); }
  } finally {
    client.release();
  }
}

export async function tick(now = new Date()) {
  return withLock(async () => {
    const auto = await runAutomations({ now });
    if (auto.sent || auto.failed) console.log('[jobs] Automationen:', JSON.stringify(auto));
    const day = now.toLocaleDateString('sv-SE', { timeZone: config.timezone });
    if (day !== lastPurgeDay) {
      lastPurgeDay = day;
      const purged = await purgeInactiveCustomers();
      await q(`DELETE FROM offers WHERE used_at IS NULL AND expires_at < now() - interval '90 days'`);
      if (purged) console.log(`[jobs] Löschfrist: ${purged} inaktive Kunden gelöscht`);
    }
    return auto;
  });
}

export function startJobs() {
  const run = () => tick().catch((e) => console.error('[jobs]', e));
  setTimeout(run, 30_000);
  return setInterval(run, 15 * 60_000);
}
