import { sendSMS, formatPhoneNumber, isValidPhoneNumber } from './twilioService';

/**
 * Sends the demo form link to the user's phone via SMS
 * @param phone - User's phone number (any format)
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function sendDemoLink(phone: string): Promise<{ success: boolean; error?: string }> {
  const formatted = formatPhoneNumber(phone);
  if (!isValidPhoneNumber(formatted)) {
    return { success: false, error: 'Invalid phone number' };
  }
  const message = 'Here is your demo link: https://viktron.ai/demo-form';
  const result = await sendSMS({ to: formatted, message });
  return { success: result.success, error: result.error };
}
