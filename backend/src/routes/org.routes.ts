import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db } from '../config/database';
import { organizations } from '../db/schema';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';
import { connectStripe, disconnectStripe } from '../services/stripe/connection.service';
import { performInitialSync, getSyncProgress } from '../services/stripe/sync.service';
import { stripeSyncQueue } from '../jobs/queue';
import { eq } from 'drizzle-orm';

const router = Router();

// GET /api/org
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, req.orgId!),
    });

    if (!org) {
      return next(new AppError('NOT_FOUND', 'Organization not found', 404));
    }

    sendSuccess(res, org);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/org
const updateOrgSchema = z.object({
  name: z.string().optional(),
  emailFromName: z.string().optional(),
  emailReplyTo: z.string().optional(),
  emailFooterHtml: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

router.patch('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateOrgSchema.parse(req.body);

    const org = await db
      .update(organizations)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, req.orgId!))
      .returning();

    sendSuccess(res, org[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/org/connect-stripe
const connectStripeSchema = z.object({
  apiKey: z.string().min(1),
});

router.post('/connect-stripe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apiKey } = connectStripeSchema.parse(req.body);

    await connectStripe(req.orgId!, apiKey);

    // Queue initial sync job
    const job = await stripeSyncQueue.add(
      'initial-sync',
      { orgId: req.orgId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 60000 },
      }
    );

    sendSuccess(res, { connected: true, syncJobId: job.id });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/org/disconnect-stripe
router.delete('/disconnect-stripe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await disconnectStripe(req.orgId!);
    sendSuccess(res, { success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/org/sync-status
router.get('/sync-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await getSyncProgress(req.orgId!);
    sendSuccess(res, progress);
  } catch (err) {
    next(err);
  }
});

// POST /api/org/sync
router.post('/sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await stripeSyncQueue.add(
      'manual-sync',
      { orgId: req.orgId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 60000 },
      }
    );

    sendSuccess(res, { syncJobId: job.id });
  } catch (err) {
    next(err);
  }
});

export { router as orgRoutes };
