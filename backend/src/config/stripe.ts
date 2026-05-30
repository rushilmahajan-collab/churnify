import Stripe from 'stripe';
import { logger } from '../utils/logger';

let stripeInstance: Stripe | null = null;

export function initializeStripe(apiKey: string): Stripe {
  try {
    return new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });
  } catch (err) {
    logger.error(err, 'Failed to initialize Stripe');
    throw err;
  }
}

export function getStripe(apiKey: string): Stripe {
  if (!stripeInstance) {
    stripeInstance = initializeStripe(apiKey);
  }
  return stripeInstance;
}

export async function validateStripeKey(apiKey: string): Promise<boolean> {
  try {
    const stripe = initializeStripe(apiKey);
    await stripe.customers.list({ limit: 1 });
    return true;
  } catch (err) {
    logger.error(err, 'Invalid Stripe API key');
    return false;
  }
}
