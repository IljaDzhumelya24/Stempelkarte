/**
 * Plattform-Admin (nur du): neue Betriebe anlegen.
 *   curl -X POST https://app.stampnow.de/api/admin/businesses \
 *     -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -H "X-StampIt: 1" \
 *     -d '{"name":"Salon Bella","slug":"salon-bella","ownerEmail":"inhaberin@example.de","ownerName":"Bella"}'
 */
import { Router } from 'express';
import { requireAdminToken } from '../auth.js';
import { createBusiness } from '../services.js';
import { google } from '../wallet/index.js';
import { config } from '../config.js';

export const adminRouter = Router();

adminRouter.post('/businesses', requireAdminToken, async (req, res) => {
  const { business, ownerPassword } = await createBusiness(req.body || {});
  if (config.google.enabled) google.upsertClass(business).catch((e) => console.error('[Google class]', e.message));
  res.status(201).json({
    id: business.id, slug: business.slug,
    ownerLogin: req.body.ownerEmail, ownerPassword,
    signupUrl: `${config.publicUrl}/k/${business.slug}`,
    hint: 'Passwort nur einmal sichtbar. Inhaber soll es nach dem ersten Login ändern.',
  });
});

adminRouter.get('/health', requireAdminToken, (req, res) => {
  res.json({ apple: config.apple.enabled, google: config.google.enabled, publicUrl: config.publicUrl });
});
