import express from 'express';
import twilio from 'twilio';

const router = express.Router();

// Load from environment or config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER || '+18446608065';

const client = twilio(accountSid, authToken);

/**
 * POST /api/sms/send
 * Body: { to: string, message: string }
 * Sends an SMS to the user with the provided message
 */
router.post('/send', async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ success: false, error: 'Missing to or message' });
  }
  try {
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to,
    });
    return res.json({ success: true, messageId: result.sid });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
