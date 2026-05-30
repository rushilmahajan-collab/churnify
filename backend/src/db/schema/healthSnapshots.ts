import {
  pgTable,
  uuid,
  varchar,
  integer,
  jsonb,
  date,
  timestamptz,
  unique,
} from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { customers } from './customers';

export const healthSnapshots = pgTable(
  'health_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),

    score: integer('score').notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    riskFactors: jsonb('risk_factors').default([]),
    mrrAtSnapshot: integer('mrr_at_snapshot'),

    snapshotDate: date('snapshot_date').notNull(),
    createdAt: timestamptz('created_at').defaultNow(),
  },
  (table) => ({
    uniq: unique().on(table.customerId, table.snapshotDate),
  })
);
