/**
 * Versionierte Migrationen. Läuft bei jedem Start (`npm start`) und ist idempotent.
 * Neue Änderungen IMMER als neuen Eintrag unten anhängen, nie alte ändern.
 */
import { pool } from './db.js';
import { pathToFileURL } from 'node:url';

const MIGRATIONS = [
  {
    id: 1,
    name: 'grundschema',
    sql: `
    CREATE TABLE businesses (
      id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug                   TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{3,40}$'),
      name                   TEXT NOT NULL,
      program_name           TEXT NOT NULL DEFAULT 'Stempelkarte',
      reward_text            TEXT NOT NULL DEFAULT 'Belohnung',
      max_stamps             INT  NOT NULL DEFAULT 10 CHECK (max_stamps BETWEEN 2 AND 50),
      stamp_cooldown_hours   INT  NOT NULL DEFAULT 12 CHECK (stamp_cooldown_hours BETWEEN 0 AND 168),
      expected_interval_days INT  NOT NULL DEFAULT 35 CHECK (expected_interval_days BETWEEN 3 AND 365),
      bg_color               TEXT NOT NULL DEFAULT '#1f2a44',
      fg_color               TEXT NOT NULL DEFAULT '#ffffff',
      accent_color           TEXT NOT NULL DEFAULT '#c9a35b',
      logo_png               BYTEA,
      logo_updated_at        TIMESTAMPTZ,
      address                TEXT NOT NULL DEFAULT '',
      contact_email          TEXT NOT NULL DEFAULT '',
      contact_phone          TEXT NOT NULL DEFAULT '',
      locations              JSONB NOT NULL DEFAULT '[]'::jsonb,
      retention_months       INT  NOT NULL DEFAULT 24 CHECK (retention_months BETWEEN 3 AND 60),
      message_cap_days       INT  NOT NULL DEFAULT 14 CHECK (message_cap_days BETWEEN 3 AND 90),
      holdout_percent        INT  NOT NULL DEFAULT 10 CHECK (holdout_percent BETWEEN 0 AND 50),
      created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE staff (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      email           TEXT NOT NULL,
      name            TEXT NOT NULL DEFAULT '',
      role            TEXT NOT NULL CHECK (role IN ('owner','staff')),
      password_hash   TEXT NOT NULL,
      active          BOOLEAN NOT NULL DEFAULT true,
      session_version INT NOT NULL DEFAULT 1,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_login_at   TIMESTAMPTZ
    );
    CREATE UNIQUE INDEX staff_email_uq ON staff (lower(email));

    CREATE TABLE customers (
      id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      business_id               UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name                      TEXT NOT NULL,
      phone_e164                TEXT NOT NULL,
      marketing_consent         BOOLEAN NOT NULL DEFAULT false,
      marketing_consent_at      TIMESTAMPTZ,
      marketing_consent_source  TEXT,
      created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_activity_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (business_id, phone_e164)
    );

    CREATE TABLE cards (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      customer_id     UUID NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
      public_id       TEXT NOT NULL UNIQUE,
      stamps          INT  NOT NULL DEFAULT 0 CHECK (stamps >= 0),
      reward_pending  BOOLEAN NOT NULL DEFAULT false,
      rewards_redeemed INT NOT NULL DEFAULT 0,
      news_text       TEXT NOT NULL DEFAULT '',
      news_at         TIMESTAMPTZ,
      has_apple       BOOLEAN NOT NULL DEFAULT false,
      has_google      BOOLEAN NOT NULL DEFAULT false,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX cards_business_idx ON cards (business_id);

    -- Besuche/Stempel. card_id wird bei Kundenlöschung NULL (anonyme Statistik bleibt).
    CREATE TABLE stamp_events (
      id           BIGSERIAL PRIMARY KEY,
      business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      card_id      UUID REFERENCES cards(id) ON DELETE SET NULL,
      staff_id     UUID REFERENCES staff(id) ON DELETE SET NULL,
      kind         TEXT NOT NULL CHECK (kind IN ('stamp','redeem','undo','adjust')),
      amount       INT  NOT NULL DEFAULT 1,
      offer_id     BIGINT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX stamp_events_card_idx ON stamp_events (card_id, created_at);
    CREATE INDEX stamp_events_biz_idx  ON stamp_events (business_id, created_at);

    -- Aktive Angebote (z.B. doppelter Stempel beim nächsten Besuch)
    CREATE TABLE offers (
      id           BIGSERIAL PRIMARY KEY,
      business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      card_id      UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
      kind         TEXT NOT NULL CHECK (kind IN ('double_stamp')),
      source       TEXT NOT NULL,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
      expires_at   TIMESTAMPTZ NOT NULL,
      used_at      TIMESTAMPTZ
    );
    CREATE INDEX offers_card_idx ON offers (card_id) WHERE used_at IS NULL;

    -- Automations-Regeln pro Betrieb
    CREATE TABLE rules (
      business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      key          TEXT NOT NULL,
      enabled      BOOLEAN NOT NULL DEFAULT false,
      message      TEXT NOT NULL,
      params       JSONB NOT NULL DEFAULT '{}'::jsonb,
      PRIMARY KEY (business_id, key)
    );

    -- Jede Nachricht (und jede bewusst NICHT gesendete Holdout-Nachricht)
    CREATE TABLE campaign_log (
      id           BIGSERIAL PRIMARY KEY,
      business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      card_id      UUID REFERENCES cards(id) ON DELETE SET NULL,
      rule_key     TEXT NOT NULL,
      variant      TEXT NOT NULL CHECK (variant IN ('sent','holdout','failed')),
      message      TEXT NOT NULL DEFAULT '',
      created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX campaign_log_card_idx ON campaign_log (card_id, created_at);
    CREATE INDEX campaign_log_biz_idx  ON campaign_log (business_id, rule_key, created_at);

    -- Apple PassKit Geräte-Registrierungen
    CREATE TABLE apple_registrations (
      device_id      TEXT NOT NULL,
      pass_type_id   TEXT NOT NULL,
      serial_number  TEXT NOT NULL,
      push_token     TEXT NOT NULL,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (device_id, pass_type_id, serial_number)
    );
    CREATE INDEX apple_reg_serial_idx ON apple_registrations (serial_number);

    CREATE TABLE audit_log (
      id           BIGSERIAL PRIMARY KEY,
      business_id  UUID REFERENCES businesses(id) ON DELETE CASCADE,
      staff_id     UUID REFERENCES staff(id) ON DELETE SET NULL,
      action       TEXT NOT NULL,
      detail       JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    `,
  },
];

/** Beim Start ist die Datenbank manchmal noch nicht erreichbar (z. B. nach Neustart/Umzug) → bis zu 2 Min. warten. */
async function connectWithRetry(tries = 24) {
  for (let i = 1; ; i++) {
    try { return await pool.connect(); }
    catch (e) {
      if (i >= tries) throw e;
      console.log(`Datenbank noch nicht erreichbar (${e.code || e.message}) – neuer Versuch in 5 s (${i}/${tries})`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

export async function migrate() {
  const client = await connectWithRetry();
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT PRIMARY KEY, name TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
    // Sperre gegen parallele Starts (mehrere Railway-Instanzen)
    await client.query('SELECT pg_advisory_lock(424242)');
    const done = new Set((await client.query('SELECT id FROM schema_migrations')).rows.map((r) => r.id));
    for (const m of MIGRATIONS) {
      if (done.has(m.id)) continue;
      await client.query('BEGIN');
      try {
        await client.query(m.sql);
        await client.query('INSERT INTO schema_migrations (id, name) VALUES ($1,$2)', [m.id, m.name]);
        await client.query('COMMIT');
        console.log(`✓ Migration ${m.id} (${m.name})`);
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      }
    }
    await client.query('SELECT pg_advisory_unlock(424242)');
  } finally {
    client.release();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  migrate().then(() => { console.log('✓ Datenbank aktuell'); return pool.end(); })
    .catch((e) => { console.error(e); process.exit(1); });
}
