import crypto from 'node:crypto';
import { query } from '../config/database.js';

const parseClientReferenceId = (value) => {
  // Expected format: <userId>:<workflowId>
  if (!value || typeof value !== 'string') return null;
  const parts = value.split(':');
  if (parts.length !== 2) return null;
  const [userId, workflowId] = parts;
  // Basic UUID v4-ish validation (kept permissive)
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuid.test(userId) || !uuid.test(workflowId)) return null;
  return { userId, workflowId };
};

// Generate a secure random token
const generateDownloadToken = () => crypto.randomBytes(32).toString('hex');

// Token validity duration (5 minutes)
const TOKEN_VALIDITY_MS = 5 * 60 * 1000;

export const listStoreCategories = async (req, res) => {
  try {
    const result = await query(
      `SELECT
          category_slug AS slug,
          category_title AS title,
          COUNT(*)::int AS count
        FROM store_workflows
        WHERE is_active = TRUE
        GROUP BY category_slug, category_title
        ORDER BY category_title ASC`
    );

    // Store catalog changes infrequently; allow short browser/proxy caching.
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load store categories',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

export const getStoreCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    if (!categorySlug) {
      return res.status(400).json({ success: false, message: 'categorySlug is required' });
    }

    const result = await query(
      `SELECT
          category_slug,
          category_title,
          workflow_slug,
          name,
          file_name,
          description,
          integrations,
          price_cents,
          currency
        FROM store_workflows
        WHERE is_active = TRUE AND category_slug = $1
        ORDER BY name ASC`,
      [categorySlug]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const categoryTitle = result.rows[0].category_title;
    const workflows = result.rows.map((row) => ({
      categorySlug: row.category_slug,
      categoryTitle: row.category_title,
      workflowSlug: row.workflow_slug,
      name: row.name,
      fileName: row.file_name,
      description: row.description || '',
      integrations: Array.isArray(row.integrations) ? row.integrations : [],
      priceCents: row.price_cents,
      currency: row.currency,
    }));

    // Store catalog changes infrequently; allow short browser/proxy caching.
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');

    res.json({
      success: true,
      data: {
        slug: categorySlug,
        title: categoryTitle,
        count: workflows.length,
        workflows,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load store category',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

export const getStoreWorkflow = async (req, res) => {
  try {
    const { categorySlug, workflowFile } = req.params;
    if (!categorySlug || !workflowFile) {
      return res.status(400).json({
        success: false,
        message: 'categorySlug and workflowFile are required',
      });
    }

    const fileName = decodeURIComponent(workflowFile);

    const result = await query(
      `SELECT
          id,
          category_slug,
          category_title,
          workflow_slug,
          name,
          file_name,
          description,
          integrations,
          price_cents,
          currency,
          workflow_json IS NOT NULL AS has_json,
          instructions_md IS NOT NULL AS has_instructions
        FROM store_workflows
        WHERE is_active = TRUE AND category_slug = $1 AND file_name = $2
        LIMIT 1`,
      [categorySlug, fileName]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found',
      });
    }

    // Store catalog changes infrequently; allow short browser/proxy caching.
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        category: {
          slug: row.category_slug,
          title: row.category_title,
        },
        workflow: {
          id: row.id,
          categorySlug: row.category_slug,
          categoryTitle: row.category_title,
          workflowSlug: row.workflow_slug,
          name: row.name,
          fileName: row.file_name,
          description: row.description || '',
          integrations: Array.isArray(row.integrations) ? row.integrations : [],
          priceCents: row.price_cents,
          currency: row.currency,
          hasJson: row.has_json,
          hasInstructions: row.has_instructions,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load store workflow',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

export const getWorkflowInstructions = async (req, res) => {
  try {
    const { workflowId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!workflowId) {
      return res.status(400).json({ success: false, message: 'workflowId is required' });
    }

    const purchaseResult = await query(
      `SELECT 1
       FROM store_purchases
       WHERE user_id = $1 AND workflow_id = $2 AND status = 'paid'
       LIMIT 1`,
      [userId, workflowId]
    );

    if (!purchaseResult.rows.length) {
      return res.status(402).json({
        success: false,
        message: 'Purchase required to access instructions',
      });
    }

    const wfResult = await query(
      `SELECT instructions_md
       FROM store_workflows
       WHERE id = $1 AND is_active = TRUE
       LIMIT 1`,
      [workflowId]
    );

    if (!wfResult.rows.length) {
      return res.status(404).json({ success: false, message: 'Workflow not found' });
    }

    const instructions = wfResult.rows[0].instructions_md;
    if (!instructions) {
      return res.status(404).json({ success: false, message: 'Instructions not available' });
    }

    res.json({
      success: true,
      data: {
        instructionsMd: instructions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load instructions',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

export const getPurchaseStatus = async (req, res) => {
  try {
    const { workflowId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!workflowId) {
      return res.status(400).json({ success: false, message: 'workflowId is required' });
    }

    const result = await query(
      `SELECT 1
       FROM store_purchases
       WHERE user_id = $1 AND workflow_id = $2 AND status = 'paid'
       LIMIT 1`,
      [userId, workflowId]
    );

    res.json({
      success: true,
      data: {
        purchased: !!result.rows.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check purchase status',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

// Request a secure download token (requires auth)
export const requestDownloadToken = async (req, res) => {
  try {
    const { workflowId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!workflowId) {
      return res.status(400).json({ success: false, message: 'workflowId is required' });
    }

    // Verify workflow exists and has at least one downloadable artifact
    const wfResult = await query(
      `SELECT id, name,
              workflow_json IS NOT NULL AS has_json,
              instructions_md IS NOT NULL AS has_instructions
       FROM store_workflows
       WHERE id = $1 AND is_active = TRUE
       LIMIT 1`,
      [workflowId]
    );

    if (!wfResult.rows.length) {
      return res.status(404).json({ success: false, message: 'Workflow not found' });
    }

    if (!wfResult.rows[0].has_json && !wfResult.rows[0].has_instructions) {
      return res.status(404).json({ success: false, message: 'Download not available' });
    }

    // Verify user purchased this workflow
    const purchaseResult = await query(
      `SELECT 1
       FROM store_purchases
       WHERE user_id = $1 AND workflow_id = $2 AND status = 'paid'
       LIMIT 1`,
      [userId, workflowId]
    );

    if (!purchaseResult.rows.length) {
      return res.status(402).json({
        success: false,
        message: 'Purchase required to download this workflow',
      });
    }

    // Generate token
    const token = generateDownloadToken();
    const expiresAt = new Date(Date.now() + TOKEN_VALIDITY_MS);

    await query(
      `INSERT INTO store_download_tokens (user_id, workflow_id, token, expires_at) VALUES ($1, $2, $3, $4)`,
      [userId, workflowId, token, expiresAt]
    );

    res.json({
      success: true,
      data: {
        token,
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate download token',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

export const handleStripeWebhook = async (req, res) => {
  // Stripe webhook signature verification requires raw body bytes.
  // We store raw bytes on req.rawBody in server/index.js.
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey || !webhookSecret) {
      return res.status(500).json({ success: false, message: 'Stripe webhook not configured' });
    }

    const sig = req.headers['stripe-signature'];
    if (!sig) {
      return res.status(400).json({ success: false, message: 'Missing Stripe signature' });
    }

    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(secretKey);

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
      return res.status(400).json({ success: false, message: `Invalid signature: ${err.message}` });
    }

    if (event.type !== 'checkout.session.completed') {
      return res.json({ received: true });
    }

    const session = event.data.object;
    if (session?.payment_status !== 'paid') {
      return res.json({ received: true });
    }

    const parsed = parseClientReferenceId(session?.client_reference_id);
    if (!parsed) {
      // If client_reference_id isn't set or doesn't match expected format,
      // we can't map this purchase to a user/workflow entitlement.
      return res.json({ received: true });
    }

    const { userId, workflowId } = parsed;

    await query(
      `INSERT INTO store_purchases (
        user_id,
        workflow_id,
        stripe_session_id,
        stripe_payment_intent,
        stripe_customer_id,
        email,
        amount_total_cents,
        currency,
        status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'paid')
      ON CONFLICT (user_id, workflow_id)
      DO UPDATE SET
        stripe_session_id = COALESCE(EXCLUDED.stripe_session_id, store_purchases.stripe_session_id),
        stripe_payment_intent = COALESCE(EXCLUDED.stripe_payment_intent, store_purchases.stripe_payment_intent),
        stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, store_purchases.stripe_customer_id),
        email = COALESCE(EXCLUDED.email, store_purchases.email),
        amount_total_cents = COALESCE(EXCLUDED.amount_total_cents, store_purchases.amount_total_cents),
        currency = COALESCE(EXCLUDED.currency, store_purchases.currency),
        status = 'paid'`,
      [
        userId,
        workflowId,
        session?.id || null,
        session?.payment_intent || null,
        session?.customer || null,
        session?.customer_details?.email || session?.customer_email || null,
        typeof session?.amount_total === 'number' ? session.amount_total : null,
        session?.currency ? String(session.currency).toUpperCase() : null,
      ]
    );

    return res.json({ received: true });
  } catch (error) {
    // Always return 200-ish for webhook reliability, unless signature failed.
    return res.status(200).json({ received: true });
  }
};

// Download workflow JSON using a secure token (no direct URL guessing)
export const downloadWorkflow = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Download token required' });
    }

    // Look up token
    const tokenResult = await query(
      `SELECT dt.id AS token_id, dt.workflow_id, dt.expires_at, dt.used_at, sw.name, sw.file_name, sw.workflow_json
       FROM store_download_tokens dt
       JOIN store_workflows sw ON sw.id = dt.workflow_id
       WHERE dt.token = $1
       LIMIT 1`,
      [token]
    );

    if (!tokenResult.rows.length) {
      return res.status(404).json({ success: false, message: 'Invalid or expired download token' });
    }

    const row = tokenResult.rows[0];

    // Check expiration
    if (new Date(row.expires_at) < new Date()) {
      return res.status(410).json({ success: false, message: 'Download token has expired' });
    }

    // Mark token as used (one-time use)
    if (row.used_at) {
      return res.status(410).json({ success: false, message: 'Download token already used' });
    }

    await query(`UPDATE store_download_tokens SET used_at = NOW() WHERE id = $1`, [row.token_id]);

    // Return JSON file as download
    const jsonContent = row.workflow_json;
    if (!jsonContent) {
      return res.status(404).json({ success: false, message: 'Workflow file not available' });
    }

    const safeFileName = row.file_name.replace(/[^a-zA-Z0-9_\-.]/g, '_');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(jsonContent, null, 2));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Download failed',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

export const downloadWorkflowInstructions = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Download token required' });
    }

    const tokenResult = await query(
      `SELECT dt.id AS token_id, dt.workflow_id, dt.expires_at, dt.used_at,
              sw.name, sw.file_name, sw.instructions_md
       FROM store_download_tokens dt
       JOIN store_workflows sw ON sw.id = dt.workflow_id
       WHERE dt.token = $1
       LIMIT 1`,
      [token]
    );

    if (!tokenResult.rows.length) {
      return res.status(404).json({ success: false, message: 'Invalid or expired download token' });
    }

    const row = tokenResult.rows[0];

    if (new Date(row.expires_at) < new Date()) {
      return res.status(410).json({ success: false, message: 'Download token has expired' });
    }

    if (row.used_at) {
      return res.status(410).json({ success: false, message: 'Download token already used' });
    }

    await query(`UPDATE store_download_tokens SET used_at = NOW() WHERE id = $1`, [row.token_id]);

    const instructions = row.instructions_md;
    if (!instructions) {
      return res.status(404).json({ success: false, message: 'Instructions not available' });
    }

    const baseName = String(row.file_name || 'workflow.json').replace(/\.json$/i, '');
    const safeFileName = `${baseName}`.replace(/[^a-zA-Z0-9_\-.]/g, '_') + '.md';
    res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.send(String(instructions));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Download failed',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};
