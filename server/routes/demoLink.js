import express from 'express';
import twilio from 'twilio';

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER || '+18446608065';
const client = twilio(accountSid, authToken);

/**
 * POST /api/demo-link/send
 * Body: { phone: string }
 * Sends the demo form link via SMS to the user
 */
router.post('/send', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Missing phone number' });
  }
  try {
    const message = 'Here is your demo link: https://viktron.ai/demo-form';
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: phone,
    });
    return res.json({ success: true, messageId: result.sid });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
