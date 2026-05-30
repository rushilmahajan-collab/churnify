import { pgTable, uuid, varchar, boolean, timestamptz, integer, unique } from 'drizzle-orm/pg-core';
import { campaigns } from './campaigns';
import { customers } from './customers';
import { organizations } from './organizations';

export const campaignSends = pgTable(
  'campaign_sends',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    campaignId: uuid('campaign_id')
      .notNull()
      .references(() => campaigns.id, { onDelete: 'cascade' }),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),

    // Email delivery tracking
    resendEmailId: varchar('resend_email_id', { length: 255 }),
    status: varchar('status', { length: 50 }).default('pending'),

    // Timestamps
    queuedAt: timestamptz('queued_at'),
    sentAt: timestamptz('sent_at'),
    deliveredAt: timestamptz('delivered_at'),
    openedAt: timestamptz('opened_at'),
    clickedAt: timestamptz('clicked_at'),
    bouncedAt: timestamptz('bounced_at'),
    failedAt: timestamptz('failed_at'),

    // Failure details
    failureReason: varchar('failure_reason', { length: 500 }),
    bounceType: varchar('bounce_type', { length: 50 }),

    // Offer tracking
    offerRedeemed: boolean('offer_redeemed').default(false),
    offerRedeemedAt: timestamptz('offer_redeemed_at'),

    // Retention tracking
    customerHealthAtSend: integer('customer_health_at_send'),
    customerRetained: boolean('customer_retained'),

    createdAt: timestamptz('created_at').defaultNow(),
  },
  (table) => ({
    uniq: unique().on(table.campaignId, table.customerId),
  })
);
