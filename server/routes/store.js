import express from 'express';
import {
	getStoreCategory,
	getStoreWorkflow,
	listStoreCategories,
	requestDownloadToken,
	downloadWorkflow,
	getPurchaseStatus,
	handleStripeWebhook,
	getWorkflowInstructions,
	downloadWorkflowInstructions,
} from '../controllers/storeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (browsing)
router.get('/categories', listStoreCategories);
router.get('/categories/:categorySlug', getStoreCategory);
router.get('/workflows/:categorySlug/:workflowFile', getStoreWorkflow);

// Protected route: request a one-time download token
router.post('/download-token/:workflowId', authenticateToken, requestDownloadToken);

// Protected route: check purchase status for current user
router.get('/purchase-status/:workflowId', authenticateToken, getPurchaseStatus);

// Protected route: fetch instructions markdown (requires purchase)
router.get('/instructions/:workflowId', authenticateToken, getWorkflowInstructions);

// Stripe webhook (no auth) - records purchases for entitlements
router.post('/stripe/webhook', handleStripeWebhook);

// Download route: uses token (no auth header needed, but token is one-time + expires)
router.get('/download/:token', downloadWorkflow);

// Download instructions route: uses token (one-time + expires)
router.get('/download-instructions/:token', downloadWorkflowInstructions);

export default router;
