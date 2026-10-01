import { DEFAULT_RULES } from '../../services/stampnow/src/engine/rules.js';
import { SEGMENTS } from '../../services/stampnow/src/engine/segments.js';

// Entirely fictional, read-only data. No application config, database or credentials are loaded.
const ago = (days) => new Date(Date.now() - days * 864e5).toISOString();
export const business = {
  name: 'Café Nord · Beispielbetrieb', slug: 'cafe-nord', programName: 'Kaffeepause lohnt sich',
  rewardText: 'Ein Kaffee aufs Haus', maxStamps: 10, bgColor: '#3058ff', fgColor: '#ffffff',
  accentColor: '#c5d3ff', logoUrl: null, address: 'Beispielstraße 12, Musterstadt', apple: true, google: true,
};
export const me = { id: 'preview-owner', name: 'Alex (Beispiel)', email: 'alex@example.test', role: 'owner', business: business.name, slug: business.slug };
export const settings = {
  name: business.name, slug: business.slug, program_name: business.programName, reward_text: business.rewardText,
  max_stamps: 10, stamp_cooldown_hours: 4, expected_interval_days: 7,
  bg_color: business.bgColor, fg_color: business.fgColor, accent_color: business.accentColor,
  address: business.address, contact_email: 'cafe@example.test', contact_phone: '',
  retention_months: 24, message_cap_days: 14, holdout_percent: 10, logoUrl: null,
  locations: [{ label: 'Beispielstandort', latitude: 53.05, longitude: 8.63, relevantText: 'Zeit für einen Kaffee?' }],
};
const people = [
  ['Lena (Beispiel)', 'regular', 14, 1, 4, true, 'Apple'],
  ['Max (Beispiel)', 'regular', 10, 2, 10, true, 'Google'],
  ['Mia (Beispiel)', 'new', 2, 3, 2, true, 'Apple'],
  ['Ben (Beispiel)', 'at_risk', 8, 18, 8, true, 'Google'],
  ['Emma (Beispiel)', 'at_risk', 6, 15, 6, false, 'Apple'],
  ['Noah (Beispiel)', 'lost', 3, 45, 3, true, 'Google'],
  ['Lea (Beispiel)', 'registered', 0, null, 0, false, '–'],
  ['Paul (Beispiel)', 'regular', 12, 1, 2, true, 'Apple'],
];
export const customers = people.map(([name, segment, visits, days, stamps, consent, wallet], index) => ({
  customerId: `preview-${index + 1}`, cardId: `card-${index + 1}`, name, phone: `Beispielnummer ${index + 1}`,
  segment, visits, lastVisit: days === null ? null : ago(days), dueAt: days === null ? null : ago(days - 7),
  intervalDays: 7, stamps, rewardPending: stamps === 10, consent, wallet,
}));
export const overview = {
  business,
  kpis: { customers: 8, visits7: 23, visits_prev7: 18, new30: 3, consent: 6, redeemed30: 4, messages30: 5, returnRate: .75, returnCohort: 4 },
  segments: Object.entries(SEGMENTS).map(([key, info]) => ({ key, ...info, count: customers.filter((c) => c.segment === key).length })),
  weekly: [8, 11, 9, 15, 12, 17, 13, 20, 16, 21, 18, 23].map((visits, index) => ({ week: ago((11 - index) * 7), visits })),
  wallet: { apple: true, google: true }, signupUrl: '/k/cafe-nord',
};
export const rules = {
  settings, rules: DEFAULT_RULES.map((rule, index) => ({ ...rule, effect: index < 2 ? {
    sent: 12 + index * 7, sentRate: .42, holdout: 3, holdoutRate: .33, uplift: .09, reliable: false,
  } : null })),
};
export const staff = [
  { ...me, active: true, last_login_at: ago(0) },
  { id: 'preview-staff', name: 'Sam (Beispiel)', email: 'sam@example.test', role: 'staff', active: true, last_login_at: ago(1) },
  { id: 'preview-inactive', name: 'Kim (Beispiel)', email: 'kim@example.test', role: 'staff', active: false, last_login_at: ago(30) },
];
export function customerDetails(customer) {
  return {
    customer: { id: customer.customerId, name: customer.name, phone: customer.phone, consent: customer.consent, consentAt: ago(60) },
    card: { id: customer.cardId, stamps: customer.stamps, rewardPending: customer.rewardPending, rewardsRedeemed: 1, apple: customer.wallet === 'Apple', google: customer.wallet === 'Google' },
    seg: customer,
    events: customer.visits ? [1, 8, 15].map((days, index) => ({ id: index, kind: 'stamp', amount: 1, created_at: ago(days), staff_name: 'Sam (Beispiel)' })) : [],
    messages: customer.consent ? [{ message: 'Schön, dich wiederzusehen! Dein nächster Kaffee wartet.', variant: 'sent', created_at: ago(9) }] : [], offers: [],
  };
}
