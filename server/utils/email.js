const parseRecipientList = (value) => {
  return (value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

export const getContactNotificationRecipients = () => {
  const configured = parseRecipientList(process.env.CONTACT_NOTIFY_EMAILS);
  if (configured.length > 0) return configured;

  return ['info@viktron.ai', 'tech@viktron.ai'];
};

const escapeText = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const sendContactNotificationEmail = async ({
  leadId,
  name,
  email,
  company,
  service,
  message,
}) => {
  const recipients = getContactNotificationRecipients();
  const from = process.env.CONTACT_FROM_EMAIL || 'Viktron <info@viktron.ai>';

  const subject = `Viktron.ai: New Website Inquiry${service ? ` (${service})` : ''} from ${name}`;

  // Plain-text fallback (for deliverability)
  const text = [
    'Viktron.ai - New Contact Form Submission',
    '--------------------------------------------',
    `Lead ID: ${leadId ?? 'N/A'}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || 'N/A'}`,
    `Interested In: ${service || 'N/A'}`,
    '',
    'Message:',
    message,
    '',
    '---',
    'This message was sent from the Viktron.ai website contact form.',
    'If you did not expect this, please disregard.',
  ].join('\n');

  // Professional HTML template
  const html = `
    <div style="font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; padding: 32px; color: #0f172a;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; overflow: hidden;">
        <tr>
          <td style="background: linear-gradient(90deg, #38bdf8 0%, #a78bfa 100%); padding: 24px 32px;">
            <h1 style="margin: 0; color: #fff; font-size: 2rem; font-weight: 700; letter-spacing: 1px;">Viktron.ai</h1>
            <p style="margin: 0; color: #e0e7ef; font-size: 1rem;">New Contact Form Submission</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px;">
            <h2 style="margin-top: 0; color: #0f172a; font-size: 1.25rem;">Contact Details</h2>
            <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 24px;">
              <tr><td style="padding: 6px 0; font-weight: 600; width: 140px;">Lead ID</td><td style="padding: 6px 0;">${escapeText(leadId ?? 'N/A')}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Name</td><td style="padding: 6px 0;">${escapeText(name)}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeText(email)}" style="color: #38bdf8; text-decoration: underline;">${escapeText(email)}</a></td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Company</td><td style="padding: 6px 0;">${escapeText(company || 'N/A')}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: 600;">Interested In</td><td style="padding: 6px 0;">${escapeText(service || 'N/A')}</td></tr>
            </table>
            <h3 style="margin-bottom: 8px; color: #0ea5e9;">Message</h3>
            <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; color: #334155; font-size: 1rem;">${escapeText(message)}</div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0 16px;" />
            <p style="color: #64748b; font-size: 0.95rem;">This message was sent from the <a href="https://viktron.ai" style="color: #38bdf8;">Viktron.ai</a> website contact form.<br>If you did not expect this, please disregard.</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const sendViaModal = async () => {
    const endpoint = process.env.CONTACT_EMAIL_MODAL_ENDPOINT;
    const sheet_url = process.env.CONTACT_EMAIL_MODAL_SHEET_URL;
    const baseTemplateUrl = process.env.CONTACT_EMAIL_MODAL_TEMPLATE_URL;

    if (!sheet_url) {
      throw new Error('Modal email configured but missing CONTACT_EMAIL_MODAL_SHEET_URL');
    }
    if (!baseTemplateUrl) {
      throw new Error('Modal email configured but missing CONTACT_EMAIL_MODAL_TEMPLATE_URL');
    }

    const limit = Number(process.env.CONTACT_EMAIL_MODAL_LIMIT || recipients.length || 2);
    const dry_run = String(process.env.CONTACT_EMAIL_MODAL_DRY_RUN || 'false') === 'true';
    const validate = String(process.env.CONTACT_EMAIL_MODAL_VALIDATE || 'true') !== 'false';

    const {
      extractGoogleDocIdFromUrl,
      extractGoogleSheetIdFromUrl,
      copyDocTemplateAndInjectDetails,
      appendSubmissionToSheet,
      ensureRecipientsSheetAndValues,
    } = await import('./googleModalAssets.js');
    const { sendViaModalEmailApi } = await import('./modalEmailApi.js');

    // 1) Append to shared sheet (Submissions tab)
    const spreadsheetId = extractGoogleSheetIdFromUrl(sheet_url);
    if (!spreadsheetId) {
      throw new Error('CONTACT_EMAIL_MODAL_SHEET_URL must be a Google Sheets URL like https://docs.google.com/spreadsheets/d/<id>/edit');
    }

    const createdAt = new Date().toISOString();

    try {
      // Ensure the sheet contains a Recipients tab for generic Modal sends
      await ensureRecipientsSheetAndValues({
        spreadsheetId,
        recipients,
      });

      await appendSubmissionToSheet({
        spreadsheetId,
        values: [
          createdAt,
          leadId ?? '',
          name,
          email,
          company || '',
          service || '',
          message,
        ],
      });
    } catch (googleError) {
      const msg = googleError?.message || String(googleError);
      throw new Error(
        `Google write failed (Sheet/Recipients/Submissions). Ensure GOOGLE_SERVICE_ACCOUNT_JSON is set and that the service account has Editor access to the Sheet and the template Doc. Details: ${msg}`
      );
    }

    // 2) Copy the template doc and inject details
    const templateDocId = extractGoogleDocIdFromUrl(baseTemplateUrl);
    if (!templateDocId) {
      throw new Error('CONTACT_EMAIL_MODAL_TEMPLATE_URL must be a Google Docs URL like https://docs.google.com/document/d/<id>/edit');
    }

    const titleSuffix = `${(leadId ?? 'contact').toString()} ${createdAt.replace(/[:.]/g, '-')}`;
    const docTitle = `Contact Message ${titleSuffix}`;
    const detailsText = [
      'New contact form submission',
      `Lead ID: ${leadId ?? 'N/A'}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || 'N/A'}`,
      `Interested In: ${service || 'N/A'}`,
      '',
      'Message:',
      message,
    ].join('\n');

    let docUrl;
    try {
      const result = await copyDocTemplateAndInjectDetails({
        templateDocId,
        title: docTitle,
        detailsText,
      });
      docUrl = result.docUrl;
    } catch (docError) {
      const msg = docError?.message || String(docError);
      throw new Error(
        `Google Doc copy/fill failed. Ensure the service account has access to the template doc and Drive API is enabled. Details: ${msg}`
      );
    }

    // 3) Call Modal email API (exact body shape)
    return await sendViaModalEmailApi({
      endpoint,
      sheet_url,
      template_url: docUrl,
      limit,
      dry_run,
      validate,
    });
  };

  // SMTP Provider (Nodemailer) - for any SMTP server (Gmail, Outlook, etc.)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const nodemailer = await import('nodemailer');
    const connectionTimeout = parseInt(process.env.SMTP_CONNECTION_TIMEOUT_MS || '10000', 10);
    const greetingTimeout = parseInt(process.env.SMTP_GREETING_TIMEOUT_MS || '10000', 10);
    const socketTimeout = parseInt(process.env.SMTP_SOCKET_TIMEOUT_MS || '15000', 10);
    
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      connectionTimeout,
      greetingTimeout,
      socketTimeout,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: from,
      to: recipients.join(', '),
      subject: subject,
      text: text,
      html: html,
      replyTo: email,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent via SMTP:', info.messageId);
      return { provider: 'smtp', messageId: info.messageId };
    } catch (smtpError) {
      if (process.env.CONTACT_EMAIL_MODAL_ENDPOINT) {
        try {
          return await sendViaModal();
        } catch (modalError) {
          throw new Error(`SMTP error: ${smtpError.message}. Modal fallback failed: ${modalError.message}`);
        }
      }
      throw new Error(`SMTP error: ${smtpError.message}`);
    }
  }

  // Provider: Modal (sheet + template)
  // Keep the Modal API body generic: {sheet_url, template_url, limit, dry_run, validate}.
  // We handle "fill the sheet" + "copy/fill the doc" separately before calling Modal.
  if (process.env.CONTACT_EMAIL_MODAL_ENDPOINT) {
    return await sendViaModal();
  }

  if (process.env.SENDGRID_API_KEY) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: recipients.map((addr) => ({ email: addr })),
            subject,
          },
        ],
        from: (() => {
          // Accept either "Name <email>" or plain email.
          const match = from.match(/^(.*)<([^>]+)>\s*$/);
          if (match) {
            return { name: match[1].trim(), email: match[2].trim() };
          }
          return { email: from };
        })(),
        reply_to: { email },
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`SendGrid error: ${response.status} ${errText}`);
    }

    return { provider: 'sendgrid' };
  }

  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject,
        text,
        html,
        reply_to: email,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Resend error: ${response.status} ${errText}`);
    }

    return { provider: 'resend' };
  }

  throw new Error('No email provider configured. Set CONTACT_EMAIL_MODAL_ENDPOINT (recommended) or SENDGRID_API_KEY or RESEND_API_KEY or SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS).');
};
