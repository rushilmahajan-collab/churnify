import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import dotenv from 'dotenv';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Routes
import { authRoutes } from './routes/auth.routes';
import { orgRoutes } from './routes/org.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { customerRoutes } from './routes/customers.routes';
import { alertRoutes } from './routes/alerts.routes';
import { campaignRoutes } from './routes/campaigns.routes';
import { templateRoutes } from './routes/templates.routes';
import { webhookRoutes } from './routes/webhooks.routes';

// Jobs
import { initQueues } from './jobs/queue';
import { initScheduler } from './jobs/scheduler';

dotenv.config();

const app = express();

// --- Global Middleware ---
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(pinoHttp({ logger }));

// Webhooks need raw body for signature verification — mount BEFORE json parser
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// JSON body parsing for all other routes
app.use(express.json({ limit: '10mb' }));

// --- Health check (unauthenticated) ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Auth routes (unauthenticated) ---
app.use('/api/auth', authRoutes);

// --- Protected routes ---
app.use('/api/org', authMiddleware, orgRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/customers', authMiddleware, customerRoutes);
app.use('/api/alerts', authMiddleware, alertRoutes);
app.use('/api/campaigns', authMiddleware, campaignRoutes);
app.use('/api/templates', authMiddleware, templateRoutes);

// --- Error handling ---
app.use(errorHandler);

// --- Start ---
const PORT = parseInt(process.env.PORT || '3001', 10);

async function start() {
  try {
    app.listen(PORT, () => {
      logger.info(`RetainIQ API running on port ${PORT}`);
      initQueues();
      initScheduler();
    });
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
}

start();
