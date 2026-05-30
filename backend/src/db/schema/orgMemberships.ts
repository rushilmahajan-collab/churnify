import { pgTable, uuid, varchar, timestamptz, unique } from 'drizzle-orm/pg-core';
import { users } from './users';
import { organizations } from './organizations';

export const orgMemberships = pgTable(
  'org_memberships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 50 }).default('member'),
    invitedBy: uuid('invited_by').references(() => users.id),
    invitedAt: timestamptz('invited_at'),
    acceptedAt: timestamptz('accepted_at'),
    createdAt: timestamptz('created_at').defaultNow(),
  },
  (table) => ({
    uniq: unique().on(table.userId, table.orgId),
  })
);
