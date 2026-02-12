/**
 * Twilio SMS Service
 * Handles SMS sending functionality using Twilio
 */

// Twilio Configuration - These credentials are loaded from environment or stored securely
const TWILIO_CONFIG = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN',
  phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER || '+12025551234',
};

export interface SMSMessage {
  to: string;
  message: string;
  subject?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  status: 'pending' | 'sent' | 'failed';
}

/**
 * Send SMS via Twilio
 * In production, this should be called from your backend
 * The backend will handle the Twilio API call securely
 */
export const sendSMS = async (smsData: SMSMessage): Promise<SMSResponse> => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || '/api';

    // Call your backend endpoint that handles Twilio SMS
    const response = await fetch(`${API_URL}/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('viktron_auth_token') || ''}`,
      },
      body: JSON.stringify({
        to: smsData.to,
        message: smsData.message,
        subject: smsData.subject,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to send SMS',
        status: 'failed',
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.messageId,
      status: 'sent',
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while sending SMS',
      status: 'failed',
    };
  }
};

/**
 * Send bulk SMS
 * Send SMS to multiple recipients
 */
export const sendBulkSMS = async (messages: SMSMessage[]): Promise<SMSResponse[]> => {
  try {
    const results = await Promise.all(
      messages.map(msg => sendSMS(msg))
    );
    return results;
  } catch (error) {
    console.error('Bulk SMS sending error:', error);
    return messages.map(() => ({
      success: false,
      error: 'Failed to send SMS',
      status: 'failed' as const,
    }));
  }
};

/**
 * Format phone number for SMS
 * Ensures phone number is in E.164 format (+1234567890)
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // If it starts with 1 (US/Canada), add +
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }

  // If it's 10 digits, assume US and add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }

  // If it already starts with country code pattern, add +
  if (cleaned.length > 10 && !phone.startsWith('+')) {
    return `+${cleaned}`;
  }

  return phone;
};

/**
 * Validate phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const formatted = formatPhoneNumber(phone);
  // E.164 format validation: +1234567890 (+ followed by 10-15 digits)
  return /^\+\d{10,15}$/.test(formatted);
};

/**
 * Get Twilio configuration (for frontend display purposes)
 * Note: Auth token should NEVER be exposed to frontend in production
 */
export const getTwilioConfig = () => {
  return {
    accountSid: TWILIO_CONFIG.accountSid,
    phoneNumber: TWILIO_CONFIG.phoneNumber,
    // DO NOT return authToken to frontend
  };
};
