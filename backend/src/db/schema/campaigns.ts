import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamptz,
  jsonb,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { organizations } from './organizations';
import { users } from './users';

export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  createdBy: uuid('created_by').references(() => users.id),

  name: varchar('name', { length: 255 }).notNull(),
  campaignType: varchar('campaign_type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).default('draft'),

  // Targeting criteria
  targetHealthStatus: varchar('target_health_status', { length: 20 }),
  targetSubscriptionStatus: varchar('target_subscription_status', { length: 50 }),
  targetMinMrr: integer('target_min_mrr'),
  targetMaxMrr: integer('target_max_mrr'),
  targetCustomerIds: jsonb('target_customer_ids').default([]),
  targetTags: text('target_tags').array().default(sql`'{}'`),

  // Email content
  templateId: uuid('template_id'),
  emailSubject: varchar('email_subject', { length: 255 }).notNull(),
  emailBodyHtml: text('email_body_html').notNull(),
  emailPreviewText: varchar('email_preview_text', { length: 255 }),

  // Offer details
  offerType: varchar('offer_type', { length: 50 }),
  offerValue: varchar('offer_value', { length: 100 }),
  offerCode: varchar('offer_code', { length: 100 }),
  offerExpiresDays: integer('offer_expires_days'),

  // Scheduling
  scheduledAt: timestamptz('scheduled_at'),
  startedAt: timestamptz('started_at'),
  completedAt: timestamptz('completed_at'),

  // Results
  totalTargeted: integer('total_targeted').default(0),
  totalSent: integer('total_sent').default(0),
  totalDelivered: integer('total_delivered').default(0),
  totalOpened: integer('total_opened').default(0),
  totalClicked: integer('total_clicked').default(0),
  totalBounced: integer('total_bounced').default(0),
  totalSaved: integer('total_saved').default(0),
  revenueSaved: integer('revenue_saved').default(0),

  createdAt: timestamptz('created_at').defaultNow(),
  updatedAt: timestamptz('updated_at').defaultNow(),
});
