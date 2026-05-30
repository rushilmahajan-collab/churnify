import Queue from 'bull';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
};

export const stripeSyncQueue = new Queue('stripe-sync', { redis: redisConfig });
export const healthScoreQueue = new Queue('health-score', { redis: redisConfig });
export const campaignQueue = new Queue('campaign-send', { redis: redisConfig });
export const emailQueue = new Queue('email-send', { redis: redisConfig });
export const snapshotQueue = new Queue('daily-snapshot', { redis: redisConfig });

export async function initQueues() {
  // TODO: Set up queue processors and error handlers
}
