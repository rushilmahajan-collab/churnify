import { pgTable, uuid, varchar, timestamptz } from 'drizzle-orm/pg-core';

export const magicLinks = pgTable('magic_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 500 }).unique().notNull(),
  expiresAt: timestamptz('expires_at').notNull(),
  usedAt: timestamptz('used_at'),
  createdAt: timestamptz('created_at').defaultNow(),
});
