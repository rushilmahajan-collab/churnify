import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { getDecryptedStripeKey } from '../services/stripe/connection.service';
import { handleStripeWebhook } from '../services/stripe/webhook.service';
import { db } from '../config/database';
import { organizations } from '../db/schema';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { eq } from 'drizzle-orm';

const router = Router();

// POST /api/webhooks/stripe
router.post('/stripe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    if (!signature) {
      return next(new AppError('STRIPE_WEBHOOK_INVALID', 'Missing Stripe signature', 400));
    }

    const rawBody = req.body;
    if (typeof rawBody !== 'string') {
      return next(new AppError('STRIPE_WEBHOOK_INVALID', 'Invalid request body', 400));
    }

    // TODO: Verify signature and determine org from webhook secret
    // For now, we'll need to parse the event and find the org

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch (err) {
      return next(new AppError('INVALID_JSON', 'Invalid JSON in request body', 400));
    }

    // Find organization by webhook secret
    // TODO: Implement this properly - need to store webhook secrets and check them
    const orgs = await db.query.organizations.findMany({
      where: (orgs, { and, isNotNull }) => and(isNotNull(orgs.stripeWebhookSecret)),
    });

    let foundOrg = null;
    for (const org of orgs) {
      try {
        const apiKey = await getDecryptedStripeKey(org.id);
        if (!apiKey) continue;

        const stripe = new Stripe(apiKey);
        stripe.webhooks.constructEvent(rawBody, signature, org.stripeWebhookSecret!);
        foundOrg = org;
        break;
      } catch (err) {
        // Try next org
        continue;
      }
    }

    if (!foundOrg) {
      // Signature validation failed or org not found
      return next(
        new AppError('STRIPE_WEBHOOK_INVALID', 'Webhook signature verification failed', 400)
      );
    }

    // Process the webhook
    await handleStripeWebhook(event, foundOrg.id);

    res.status(200).json({ received: true });
  } catch (err) {
    logger.error(err, 'Webhook processing error');
    next(err);
  }
});

export { router as webhookRoutes };
