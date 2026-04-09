const nodemailer = require('nodemailer');

async function sendAlert({ to, message }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('[Notification Stub] Would send alert to:', to, 'message:', message);
    return { ok: true, stub: true };
  }
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });
  const info = await transporter.sendMail({
    from: fromEmail,
    to: Array.isArray(to) ? to.join(',') : to,
    subject: 'SOS Alert - Rakshika',
    text: message,
  });
  return { ok: true, id: info.messageId };
}

module.exports = { sendAlert };

