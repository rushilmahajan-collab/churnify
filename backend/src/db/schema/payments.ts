import { pgTable, uuid, varchar, integer, text, timestamptz } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { customers } from './customers';

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  stripeChargeId: varchar('stripe_charge_id', { length: 255 }),
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),

  amount: integer('amount').notNull(),
  amountRefunded: integer('amount_refunded').default(0),
  currency: varchar('currency', { length: 10 }).default('usd'),
  status: varchar('status', { length: 50 }).notNull(),

  // Failure details
  failureCode: varchar('failure_code', { length: 100 }),
  failureMessage: varchar('failure_message', { length: 500 }),
  failureDeclineCode: varchar('failure_decline_code', { length: 100 }),

  // Invoice details
  invoiceNumber: varchar('invoice_number', { length: 100 }),
  invoicePeriodStart: timestamptz('invoice_period_start'),
  invoicePeriodEnd: timestamptz('invoice_period_end'),

  // Plan at time of payment
  planName: varchar('plan_name', { length: 255 }),
  planAmount: integer('plan_amount'),

  paidAt: timestamptz('paid_at'),
  createdAt: timestamptz('created_at').defaultNow(),
});
