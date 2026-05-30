import { db } from '../../config/database';
import { organizations } from '../../db/schema';
import { encrypt, decrypt } from '../../utils/encryption';
import { validateStripeKey } from '../../config/stripe';
import { AppError } from '../../middleware/errorHandler';
import { eq } from 'drizzle-orm';

export async function connectStripe(
  orgId: string,
  apiKey: string
): Promise<{ success: boolean }> {
  // Validate key format
  if (!apiKey.match(/^[rs]k_(test|live)_/)) {
    throw new AppError('STRIPE_KEY_INVALID', 'Invalid Stripe API key format', 400);
  }

  // Test the API key
  const isValid = await validateStripeKey(apiKey);
  if (!isValid) {
    throw new AppError(
      'STRIPE_KEY_INVALID',
      'Unable to validate Stripe API key. Please verify your key and try again.',
      400
    );
  }

  // Encrypt the key
  const { encrypted, iv, authTag } = encrypt(apiKey);

  // Store in database
  await db
    .update(organizations)
    .set({
      stripeApiKeyEncrypted: encrypted,
      stripeApiKeyIv: iv,
      stripeApiKeyTag: authTag,
      stripeConnectedAt: new Date(),
      stripeSyncStatus: 'syncing',
      stripeSyncProgress: 0,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, orgId));

  return { success: true };
}

export async function getDecryptedStripeKey(orgId: string): Promise<string | null> {
  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, orgId),
    columns: {
      stripeApiKeyEncrypted: true,
      stripeApiKeyIv: true,
      stripeApiKeyTag: true,
    },
  });

  if (!org?.stripeApiKeyEncrypted || !org.stripeApiKeyIv || !org.stripeApiKeyTag) {
    return null;
  }

  try {
    return decrypt(org.stripeApiKeyEncrypted, org.stripeApiKeyIv, org.stripeApiKeyTag);
  } catch (err) {
    return null;
  }
}

export async function disconnectStripe(orgId: string): Promise<{ success: boolean }> {
  await db
    .update(organizations)
    .set({
      stripeApiKeyEncrypted: null,
      stripeApiKeyIv: null,
      stripeApiKeyTag: null,
      stripeConnectedAt: null,
      stripeSyncStatus: 'none',
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, orgId));

  return { success: true };
}
