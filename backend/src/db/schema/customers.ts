import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamptz,
  boolean,
  jsonb,
  numeric,
  unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { organizations } from './organizations';

export const customers = pgTable(
  'customers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).notNull(),

    // Identity
    email: varchar('email', { length: 255 }),
    name: varchar('name', { length: 255 }),

    // Subscription state
    subscriptionStatus: varchar('subscription_status', { length: 50 }),
    subscriptionId: varchar('subscription_id', { length: 255 }),
    currentPlanName: varchar('current_plan_name', { length: 255 }),
    currentPlanId: varchar('current_plan_id', { length: 255 }),
    currentMrr: integer('current_mrr').default(0),
    currency: varchar('currency', { length: 10 }).default('usd'),
    billingInterval: varchar('billing_interval', { length: 20 }),
    subscriptionStartDate: timestamptz('subscription_start_date'),
    subscriptionCancelDate: timestamptz('subscription_cancel_date'),
    subscriptionCanceledAt: timestamptz('subscription_canceled_at'),
    trialStartDate: timestamptz('trial_start_date'),
    trialEndDate: timestamptz('trial_end_date'),
    currentPeriodStart: timestamptz('current_period_start'),
    currentPeriodEnd: timestamptz('current_period_end'),

    // Health scoring
    healthScore: integer('health_score').default(100),
    healthStatus: varchar('health_status', { length: 20 }).default('healthy'),
    healthTrend: varchar('health_trend', { length: 20 }).default('stable'),
    healthUpdatedAt: timestamptz('health_updated_at'),
    previousHealthScore: integer('previous_health_score'),
    previousHealthStatus: varchar('previous_health_status', { length: 20 }),
    riskFactors: jsonb('risk_factors').default([]),

    // Engagement signals
    totalPayments: integer('total_payments').default(0),
    successfulPayments: integer('successful_payments').default(0),
    failedPayments: integer('failed_payments').default(0),
    totalRevenue: integer('total_revenue').default(0),
    lastPaymentDate: timestamptz('last_payment_date'),
    lastPaymentAmount: integer('last_payment_amount'),
    lastFailedPaymentDate: timestamptz('last_failed_payment_date'),
    lastFailedReason: varchar('last_failed_reason', { length: 255 }),
    paymentFrequencyDays: numeric('payment_frequency_days', { precision: 10, scale: 2 }),
    daysSinceLastPayment: integer('days_since_last_payment'),

    // Plan movement
    hasDowngraded: boolean('has_downgraded').default(false),
    lastDowngradeDate: timestamptz('last_downgrade_date'),
    downgradeCount: integer('downgrade_count').default(0),
    hasUpgraded: boolean('has_upgraded').default(false),
    lastUpgradeDate: timestamptz('last_upgrade_date'),
    upgradeCount: integer('upgrade_count').default(0),

    // Refund tracking
    totalRefunds: integer('total_refunds').default(0),
    totalRefundAmount: integer('total_refund_amount').default(0),
    lastRefundDate: timestamptz('last_refund_date'),

    // Dispute tracking
    totalDisputes: integer('total_disputes').default(0),
    lastDisputeDate: timestamptz('last_dispute_date'),

    // User-added metadata
    tags: text('tags').array().default(sql`'{}'`),
    notes: text('notes'),

    // Stripe raw metadata
    stripeMetadata: jsonb('stripe_metadata').default({}),
    stripeCreatedAt: timestamptz('stripe_created_at'),

    // Campaign tracking
    lastCampaignSentAt: timestamptz('last_campaign_sent_at'),
    totalCampaignsSent: integer('total_campaigns_sent').default(0),
    totalCampaignsOpened: integer('total_campaigns_opened').default(0),

    createdAt: timestamptz('created_at').defaultNow(),
    updatedAt: timestamptz('updated_at').defaultNow(),
  },
  (table) => ({
    uniq: unique().on(table.orgId, table.stripeCustomerId),
  })
);
