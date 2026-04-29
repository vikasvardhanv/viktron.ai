import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import leadsRoutes from './routes/leads.js';
import leadAgentRoutes from './routes/leadAgent.js';
import demosRoutes from './routes/demos.js';
import storeRoutes from './routes/store.js';
import smsRoutes from './routes/sms.js';
import demoLinkRoutes from './routes/demoLink.js';
import schedulingRoutes from './routes/scheduling.js';
import slackRoutes from './routes/slack.js';
import agentRoutes from './routes/agent.js';
import compatRoutes from './routes/compat.js';
import { startScheduler } from './utils/schedulerService.js';
import { syncLocalSkillsToStore } from './utils/skillLoader.js';
import { ensureTaskQueueTables, logQueueMode } from './utils/taskQueue.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    // Only log API requests to reduce noise
    if (req.originalUrl.startsWith('/api')) {
      logger.request(req, res.statusCode, duration);
    }
  });

  next();
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for SPA
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://viktron.ai',
  'https://www.viktron.ai',
  'https://analytics.viktron.ai',
].filter(Boolean);

app.use(cors({
  origin: isProduction
    ? (origin, callback) => {
        if (!origin) return callback(null, true);
        const isExplicitAllowed = allowedOrigins.includes(origin);
        const isViktronSubdomain = /^https:\/\/([a-z0-9-]+\.)?viktron\.ai$/i.test(origin);
        if (isExplicitAllowed || isViktronSubdomain) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      }
    : true, // Allow all in development
  credentials: true,
}));

// Rate limiting — applied before routes
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again in 15 minutes.' },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again in an hour.' },
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/contact', contactLimiter);
app.use('/api/leads', contactLimiter);

// Body parsing
// Keep a copy of raw JSON body for Stripe webhook signature verification.
app.use(express.json({
  limit: '1mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/lead-agent', leadAgentRoutes);
app.use('/api/demos', demosRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/scheduling', schedulingRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/demo-link', demoLinkRoutes);
app.use('/api/channels/slack', slackRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api', compatRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Serve static files in production
if (isProduction) {
  const distPath = path.join(__dirname, '..', 'dist');

  // Serve static files
  app.use(express.static(distPath));

  // Handle SPA routing - send all non-API requests to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled server error', {
    message: err.message,
    stack: err.stack?.split('\n').slice(0, 3).join(' | '),
    url: req.originalUrl,
    method: req.method,
    body: req.body ? JSON.stringify(req.body).substring(0, 200) : undefined,
  });

  res.status(500).json({
    success: false,
    message: isProduction
      ? 'An unexpected error occurred'
      : err.message
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION - Server shutting down', {
    message: err.message,
    stack: err.stack?.split('\n').slice(0, 5).join(' | '),
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED REJECTION', {
    reason: reason?.toString(),
  });
});

app.listen(PORT, () => {
  logger.startup('Server started', {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
  });
  startScheduler();

  // Log database connection status
  logger.startup('Database URL configured', {
    hasDbUrl: !!process.env.DATABASE_URL,
    dbHost: process.env.DATABASE_URL?.match(/@([^:]+):/)?.[1]?.substring(0, 10) + '...' || 'not set',
  });
});

void ensureTaskQueueTables()
  .then(() => logQueueMode())
  .catch((error) => {
    logger.warn('Task queue initialization failed', {
      message: error.message,
    });
  });

void syncLocalSkillsToStore('default')
  .catch((error) => {
    logger.warn('Initial skill sync failed', {
      message: error.message,
    });
  });

export default app;
