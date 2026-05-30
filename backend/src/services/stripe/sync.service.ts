import { getStripe } from '../../config/stripe';
import { db } from '../../config/database';
import { organizations } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../../utils/logger';
import { getDecryptedStripeKey } from './connection.service';

export interface SyncProgress {
  status: 'syncing' | 'completed' | 'failed';
  progress: number;
  customersImported: number;
  totalCustomers?: number;
  error?: string;
}

export async function performInitialSync(
  orgId: string
): Promise<SyncProgress> {
  try {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, orgId),
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    const apiKey = await getDecryptedStripeKey(orgId);
    if (!apiKey) {
      throw new Error('Stripe API key not found');
    }

    const stripe = getStripe(apiKey);

    // Get total customer count
    const { data: customers } = await stripe.customers.list({ limit: 1 });
    const totalCustomers = customers.length; // TODO: Get actual count from Stripe

    logger.info(
      { orgId, totalCustomers },
      'Starting Stripe sync'
    );

    // Update sync status
    await db
      .update(organizations)
      .set({
        stripeSyncStatus: 'syncing',
        stripeSyncProgress: 0,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, orgId));

    // TODO: Implement full sync logic
    // 1. Fetch all customers
    // 2. For each customer, fetch subscriptions
    // 3. For each subscription, fetch charges/payments
    // 4. Insert/update records in database
    // 5. Calculate health scores
    // 6. Generate initial alerts

    // For now, mark as completed
    await db
      .update(organizations)
      .set({
        stripeSyncStatus: 'completed',
        stripeSyncProgress: 100,
        stripeLastSyncedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, orgId));

    return {
      status: 'completed',
      progress: 100,
      customersImported: 0,
      totalCustomers,
    };
  } catch (err) {
    logger.error(err, 'Stripe sync failed');

    await db
      .update(organizations)
      .set({
        stripeSyncStatus: 'failed',
        stripeSyncError: err instanceof Error ? err.message : 'Unknown error',
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, orgId));

    return {
      status: 'failed',
      progress: 0,
      customersImported: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function getSyncProgress(orgId: string): Promise<SyncProgress> {
  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, orgId),
    columns: {
      stripeSyncStatus: true,
      stripeSyncProgress: true,
      stripeSyncError: true,
    },
  });

  if (!org) {
    throw new Error('Organization not found');
  }

  return {
    status: (org.stripeSyncStatus as any) || 'none',
    progress: org.stripeSyncProgress || 0,
    customersImported: 0,
    error: org.stripeSyncError || undefined,
  };
}
