import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamptz,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),

  // Stripe connection
  stripeAccountId: varchar('stripe_account_id', { length: 255 }),
  stripeApiKeyEncrypted: text('stripe_api_key_encrypted'),
  stripeApiKeyIv: varchar('stripe_api_key_iv', { length: 64 }),
  stripeApiKeyTag: varchar('stripe_api_key_tag', { length: 64 }),
  stripeConnectedAt: timestamptz('stripe_connected_at'),
  stripeLastSyncedAt: timestamptz('stripe_last_synced_at'),
  stripeSyncStatus: varchar('stripe_sync_status', { length: 50 }).default('none'),
  stripeSyncProgress: integer('stripe_sync_progress').default(0),
  stripeSyncError: text('stripe_sync_error'),
  stripeWebhookSecret: varchar('stripe_webhook_secret', { length: 255 }),

  // Plan & billing
  plan: varchar('plan', { length: 50 }).default('free'),
  trialEndsAt: timestamptz('trial_ends_at'),

  // Email settings
  emailFromName: varchar('email_from_name', { length: 255 }),
  emailReplyTo: varchar('email_reply_to', { length: 255 }),
  emailFooterHtml: text('email_footer_html'),

  // Preferences
  settings: jsonb('settings').default({
    timezone: 'UTC',
    alertDigestEnabled: true,
    alertDigestTime: '09:00',
    alertInstantEnabled: true,
    alertSeverityThreshold: 'warning',
    healthScoreWeights: {},
  }),

  createdAt: timestamptz('created_at').defaultNow(),
  updatedAt: timestamptz('updated_at').defaultNow(),
});
