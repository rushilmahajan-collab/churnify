import { pgTable, uuid, varchar, text, timestamptz, jsonb, integer } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { customers } from './customers';

export const subscriptionEvents = pgTable('subscription_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  stripeEventId: varchar('stripe_event_id', { length: 255 }).unique(),

  eventType: varchar('event_type', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),

  // Before/after state
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),

  // Financial impact
  revenueImpact: integer('revenue_impact'),

  occurredAt: timestamptz('occurred_at').defaultNow(),
  createdAt: timestamptz('created_at').defaultNow(),
});
