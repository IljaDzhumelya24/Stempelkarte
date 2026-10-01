/** Was auf der Karte steht – gemeinsam für Apple, Google und die Web-Ansicht. */
import { config } from '../config.js';
import { manageToken, qrPayload } from '../tokens.js';

export function stampDots(stamps, max) {
  const n = Math.min(stamps, max);
  return '●'.repeat(n) + '○'.repeat(Math.max(0, max - n));
}

export function manageUrl(publicId) {
  return `${config.publicUrl}/meine-karte/${publicId}?t=${manageToken(publicId)}`;
}

export function cardView(business, card, customer) {
  const max = business.max_stamps;
  const stamps = Math.min(card.stamps, max);
  return {
    title: business.program_name,
    businessName: business.name,
    customerName: customer?.name || 'Kunde',
    stamps,
    max,
    stampsText: `${stamps} / ${max}`,
    dots: stampDots(stamps, max),
    rewardText: business.reward_text,
    rewardPending: card.reward_pending,
    rewardLine: card.reward_pending ? `Bereit: ${business.reward_text}` : `Nach ${max} Stempeln: ${business.reward_text}`,
    news: card.news_text || '',
    howTo: `Zeig diese Karte bei jedem Besuch vor – das Team scannt den Code. Nach ${max} Stempeln gibt es: ${business.reward_text}.`,
    address: business.address || '',
    qr: qrPayload(card.public_id),
    manageUrl: manageUrl(card.public_id),
    privacyUrl: `${config.publicUrl}/datenschutz/${business.slug}`,
  };
}

export function hexToRgb(hex) {
  const h = String(hex || '#000000').replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

/** Standorte (Phase 6) bereinigen: max. 10, gültige Koordinaten. */
export function validLocations(locs) {
  if (!Array.isArray(locs)) return [];
  return locs
    .map((l) => ({
      latitude: Number(l.latitude),
      longitude: Number(l.longitude),
      relevantText: String(l.relevantText || '').slice(0, 100),
      label: String(l.label || '').slice(0, 60),
    }))
    .filter((l) => Number.isFinite(l.latitude) && Number.isFinite(l.longitude)
      && Math.abs(l.latitude) <= 90 && Math.abs(l.longitude) <= 180)
    .slice(0, 10);
}
