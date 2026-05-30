import { pgTable, uuid, varchar, text, boolean, timestamptz } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  passwordHash: varchar('password_hash', { length: 255 }),
  emailVerified: boolean('email_verified').default(false),
  emailVerifiedAt: timestamptz('email_verified_at'),
  lastLoginAt: timestamptz('last_login_at'),
  createdAt: timestamptz('created_at').defaultNow(),
  updatedAt: timestamptz('updated_at').defaultNow(),
});
