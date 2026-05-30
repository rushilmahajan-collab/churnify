import { pgTable, uuid, varchar, text, integer, timestamptz } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { customers } from './customers';
import { users } from './users';

export const alerts = pgTable('alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),

  alertType: varchar('alert_type', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  severity: varchar('severity', { length: 20 }).default('medium'),

  // State management
  status: varchar('status', { length: 20 }).default('active'),
  acknowledgedBy: uuid('acknowledged_by').references(() => users.id),
  acknowledgedAt: timestamptz('acknowledged_at'),
  resolvedAt: timestamptz('resolved_at'),
  dismissedAt: timestamptz('dismissed_at'),

  // Context
  healthScoreAtAlert: integer('health_score_at_alert'),
  mrrAtRisk: integer('mrr_at_risk'),

  // Deduplication
  dedupKey: varchar('dedup_key', { length: 255 }),

  createdAt: timestamptz('created_at').defaultNow(),
});
