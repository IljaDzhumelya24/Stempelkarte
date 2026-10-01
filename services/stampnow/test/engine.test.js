import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, median } from '../src/engine/segments.js';
import { decide, inHoldout, inSendWindow, renderMessage, DEFAULT_RULES } from '../src/engine/rules.js';

const DAY = 864e5;
const now = new Date('2026-10-06T12:00:00Z'); // Dienstag
const ago = (d) => new Date(+now - d * DAY);

test('median', () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(median([]), null);
});

test('Segmente: persönlicher Rhythmus statt fester Grenze', () => {
  // Kunde kommt alle 28 Tage, letzter Besuch vor 20 Tagen → Stammkunde
  const regular = classify([ago(104), ago(76), ago(48), ago(20)], 35, now);
  assert.equal(regular.segment, 'regular');
  assert.equal(regular.intervalDays, 28);
  // gleicher Kunde, jetzt 50 Tage weg (> 1,5 × 28) → gefährdet
  assert.equal(classify([ago(134), ago(106), ago(78), ago(50)], 35, now).segment, 'at_risk');
  // 8-Wochen-Kunde nach 50 Tagen ist NICHT gefährdet
  assert.equal(classify([ago(218), ago(162), ago(106), ago(50)], 35, now).segment, 'regular');
  // > 3 × Rhythmus → verloren
  assert.equal(classify([ago(200), ago(172), ago(144), ago(100)], 35, now).segment, 'lost');
});

test('Segmente: Neukunden & Angemeldete', () => {
  assert.equal(classify([], 35, now).segment, 'registered');
  assert.equal(classify([ago(10)], 35, now).segment, 'new');
  assert.equal(classify([ago(60)], 35, now).segment, 'at_risk'); // 60/35 = 1,7
  // zwei Stempel am selben Tag zählen nicht als Rhythmus 0
  const same = classify([ago(10), new Date(+ago(10) + 60e3)], 35, now);
  assert.equal(same.intervalDays, 35);
});

const business = { name: 'Salon Bella', reward_text: 'Gratis Schnitt', max_stamps: 10, message_cap_days: 14, holdout_percent: 0 };
const rules = DEFAULT_RULES.map((r) => ({ ...r }));
const cust = { name: 'Lena Meyer', marketing_consent: true };

test('Regel: ohne Einwilligung nie eine Nachricht', () => {
  const seg = classify([ago(30)], 35, now);
  assert.equal(decide({ card: { id: 'c1', stamps: 1 }, customer: { ...cust, marketing_consent: false }, business, seg, rules, now }), null);
});

test('Regel: zweiter Besuch für Neukunden mit Angebot', () => {
  const seg = classify([ago(30)], 35, now); // 30/35 = 0,86
  const d = decide({ card: { id: 'c1', stamps: 1, reward_pending: false }, customer: cust, business, seg, rules, now });
  assert.equal(d.ruleKey, 'second_visit');
  assert.equal(d.offerDays, 21);
  assert.match(d.message, /Lena/);
  assert.match(d.message, /21 Tagen/);
});

test('Regel: zu früh → nichts', () => {
  const seg = classify([ago(5)], 35, now);
  assert.equal(decide({ card: { id: 'c1', stamps: 1 }, customer: cust, business, seg, rules, now }), null);
});

test('Regel: Frequenzgrenze und einmal pro Abwesenheit', () => {
  const seg = classify([ago(134), ago(106), ago(78), ago(50)], 35, now);
  const card = { id: 'c2', stamps: 4, reward_pending: false };
  assert.equal(decide({ card, customer: cust, business, seg, rules, now }).ruleKey, 'win_back');
  // vor 5 Tagen schon eine Nachricht → Sperre
  assert.equal(decide({ card, customer: cust, business, seg, rules, now, log: [{ rule_key: 'almost_there', created_at: ago(5) }] }), null);
  // win_back vor 20 Tagen (nach letztem Besuch) → nicht nochmal
  assert.equal(decide({ card, customer: cust, business, seg, rules, now, log: [{ rule_key: 'win_back', created_at: ago(20) }] }), null);
  // win_back vor dem letzten Besuch → neue Abwesenheit, darf wieder
  assert.equal(decide({ card, customer: cust, business, seg, rules, now, log: [{ rule_key: 'win_back', created_at: ago(60) }] }).ruleKey, 'win_back');
});

test('Regel: Belohnung wartet hat Vorrang', () => {
  const seg = classify([ago(80), ago(50), ago(20)], 35, now);
  const d = decide({ card: { id: 'c3', stamps: 10, reward_pending: true }, customer: cust, business, seg, rules, now });
  assert.equal(d.ruleKey, 'reward_waiting');
});

test('Regel: fast voll', () => {
  const seg = classify([ago(90), ago(60), ago(30)], 35, now); // Rhythmus 30, ratio 1,0
  const d = decide({ card: { id: 'c4', stamps: 9, reward_pending: false }, customer: cust, business, seg, rules, now });
  assert.equal(d.ruleKey, 'almost_there');
  assert.match(d.message, /Nur noch 1 Stempel/);
});

test('Regel: deaktivierte Regel feuert nicht', () => {
  const seg = classify([ago(200), ago(170), ago(140)], 35, now);
  assert.equal(decide({ card: { id: 'c5', stamps: 3 }, customer: cust, business, seg, rules, now }), null); // last_try ist aus
  const on = rules.map((r) => (r.key === 'last_try' ? { ...r, enabled: true } : r));
  assert.equal(decide({ card: { id: 'c5', stamps: 3 }, customer: cust, business, seg, rules: on, now }).ruleKey, 'last_try');
});

test('Holdout: deterministisch und ungefähr im Prozentsatz', () => {
  assert.equal(inHoldout('a', 'win_back', '1', 10), inHoldout('a', 'win_back', '1', 10));
  let n = 0;
  for (let i = 0; i < 5000; i++) if (inHoldout(`card${i}`, 'win_back', 'x', 10)) n++;
  assert.ok(n > 400 && n < 600, `Holdout-Anteil ${n / 50} %`);
  assert.equal(inHoldout('a', 'b', 'c', 0), false);
});

test('Sendefenster: Mo–Sa 10–19 Uhr Berlin', () => {
  assert.equal(inSendWindow(new Date('2026-10-06T12:00:00Z')), true);   // Di 14 Uhr
  assert.equal(inSendWindow(new Date('2026-10-06T06:00:00Z')), false);  // Di 8 Uhr
  assert.equal(inSendWindow(new Date('2026-10-06T17:30:00Z')), false);  // Di 19:30
  assert.equal(inSendWindow(new Date('2026-10-04T12:00:00Z')), false);  // Sonntag
});

test('Platzhalter', () => {
  assert.equal(renderMessage('Hi {name}, {unbekannt}', { name: 'Lena' }), 'Hi Lena, {unbekannt}');
});
