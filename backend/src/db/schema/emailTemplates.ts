import { pgTable, uuid, varchar, text, boolean, integer, timestamptz } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 255 }).notNull(),
  templateType: varchar('template_type', { length: 50 }).notNull(),

  subject: varchar('subject', { length: 255 }).notNull(),
  bodyHtml: text('body_html').notNull(),
  previewText: varchar('preview_text', { length: 255 }),

  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),

  // Usage stats
  timesUsed: integer('times_used').default(0),
  lastUsedAt: timestamptz('last_used_at'),

  createdAt: timestamptz('created_at').defaultNow(),
  updatedAt: timestamptz('updated_at').defaultNow(),
});
