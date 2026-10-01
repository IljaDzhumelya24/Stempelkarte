/**
 * Einheitliche Schnittstelle: "Karte hat sich geändert" / "Nachricht senden".
 * Fehler bei Apple/Google werden geloggt, brechen aber nie den Stempel-Vorgang ab –
 * die Datenbank ist die Wahrheit, Wallet ist nur die Anzeige.
 */
import { config } from '../config.js';
import { many, one, q } from '../db.js';
import * as apple from './apple.js';
import * as google from './google.js';

export async function loadCardBundle(cardId) {
  const card = await one('SELECT * FROM cards WHERE id = $1', [cardId]);
  if (!card) return null;
  const [business, customer] = await Promise.all([
    one('SELECT * FROM businesses WHERE id = $1', [card.business_id]),
    one('SELECT * FROM customers WHERE id = $1', [card.customer_id]),
  ]);
  return { card, business, customer };
}

async function pushApple(card) {
  if (!config.apple.enabled || !card.has_apple) return 0;
  const regs = await many('SELECT push_token FROM apple_registrations WHERE serial_number = $1', [card.public_id]);
  const r = await apple.pushUpdate([...new Set(regs.map((x) => x.push_token))]);
  if (r.invalid.length) {
    await q('DELETE FROM apple_registrations WHERE push_token = ANY($1)', [r.invalid]);
  }
  return r.sent;
}

/** Nach jedem Stempel/Einlösen aufrufen. */
export async function syncCard(cardId) {
  const b = await loadCardBundle(cardId);
  if (!b) return;
  const out = { apple: 0, google: false };
  await Promise.all([
    pushApple(b.card).then((n) => { out.apple = n; }).catch((e) => console.error('[Apple sync]', e.message)),
    (config.google.enabled && b.card.has_google)
      ? google.updateObject(b.business, b.card, b.customer).then((ok) => { out.google = ok; })
        .catch((e) => console.error('[Google sync]', e.message))
      : null,
  ]);
  return out;
}

/**
 * Nachricht an eine Karte. Rückgabe: true, wenn mindestens ein Kanal sie
 * zustellen konnte. Die Nachricht steht zusätzlich dauerhaft auf der Karte ("Aktuell").
 */
export async function sendCardMessage(cardId, text) {
  await q('UPDATE cards SET news_text = $2, news_at = now(), updated_at = now() WHERE id = $1', [cardId, text]);
  const b = await loadCardBundle(cardId);
  if (!b) return false;
  let delivered = false;
  if (config.apple.enabled && b.card.has_apple) {
    try { delivered = (await pushApple(b.card)) > 0 || delivered; } catch (e) { console.error('[Apple msg]', e.message); }
  }
  if (config.google.enabled && b.card.has_google) {
    try {
      await google.updateObject(b.business, b.card, b.customer);
      delivered = (await google.sendMessage(b.card, b.business.name, text)) || delivered;
    } catch (e) { console.error('[Google msg]', e.message); }
  }
  // Ohne echte Wallet-Anbindung (lokal/Tests) zählt die Nachricht als zugestellt,
  // weil sie auf der Karte steht – so lässt sich alles ohne Zertifikate testen.
  if (!config.apple.enabled && !config.google.enabled) delivered = true;
  return delivered;
}

export async function retireCard(card) {
  if (config.google.enabled && card.has_google) {
    await google.expireObject(card).catch((e) => console.error('[Google expire]', e.message));
  }
  // Apple: Karten lassen sich serverseitig nicht vom iPhone löschen. Registrierungen
  // entfernen wir; die Karte zeigt ab dann keine Daten mehr an (404 beim Abruf).
  await q('DELETE FROM apple_registrations WHERE serial_number = $1', [card.public_id]);
}

export { apple, google };
