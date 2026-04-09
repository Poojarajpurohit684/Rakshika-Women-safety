let client = null

function ensureClient() {
  if (client) return client
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!sid || !token) return null
  // eslint-disable-next-line global-require
  const twilio = require('twilio')
  client = twilio(sid, token)
  return client
}

/**
 * Normalizes phone numbers to E.164 format.
 * Defaults to +91 (India) if no country code is provided for 10-digit numbers.
 */
function normalizePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return phone.startsWith('+') ? phone : `+${cleaned}`;
}

/**
 * Extracts a 10-digit Indian mobile number from any format.
 * Fast2SMS requires plain 10-digit numbers without country code.
 */
function toIndianMobile(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) return cleaned.slice(2);
  if (cleaned.length === 10) return cleaned;
  return cleaned;
}

async function sendSMS(to, body) {
  const fast2smsKey = process.env.FAST2SMS_API_KEY;

  // Use Fast2SMS if API key is set (works on Indian numbers without upgrade)
  if (fast2smsKey) {
    const mobile = toIndianMobile(to);
    console.log(`[Fast2SMS] Sending to ${mobile}`);
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: fast2smsKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message: body,
        route: 'q',
        numbers: mobile,
        flash: '0',
      }),
    });
    const data = await res.json();
    if (!data.return) throw new Error(`Fast2SMS error: ${JSON.stringify(data)}`);
    console.log(`[Fast2SMS] Sent successfully to ${mobile}`);
    return { ok: true, provider: 'fast2sms' };
  }

  // Fallback: Twilio SMS
  const c = ensureClient();
  const from = process.env.TWILIO_FROM_SMS || process.env.TWILIO_PHONE_NUMBER;
  const normalizedTo = normalizePhone(to);

  if (!c || !from) {
    console.log('\n--- TWILIO SMS STUB (no credentials) ---');
    console.log(`TO: ${normalizedTo}`);
    console.log(`BODY: ${body}`);
    console.log('-----------------------\n');
    return { ok: true, stub: true };
  }
  console.log(`[SMS] Sending to ${normalizedTo} from ${from}`);
  const msg = await c.messages.create({ from, to: normalizedTo, body });
  console.log(`[SMS] Sent successfully, SID: ${msg.sid}`);
  return { ok: true, sid: msg.sid };
}

async function sendWhatsApp(to, body) {
  const c = ensureClient()
  const from = process.env.TWILIO_FROM_WHATSAPP || process.env.TWILIO_PHONE_NUMBER
  const normalizedTo = normalizePhone(to);

  if (!c || !from) {
    console.log('\n--- TWILIO WHATSAPP STUB ---');
    console.log(`TO: whatsapp:${normalizedTo}`);
    console.log(`BODY: ${body}`);
    console.log('----------------------------\n');
    return { ok: true, stub: true }
  }
  
  const fromWhatsApp = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`;
  const toWhatsApp = normalizedTo.startsWith('whatsapp:') ? normalizedTo : `whatsapp:${normalizedTo}`;
  
  const res = await c.messages.create({ from: fromWhatsApp, to: toWhatsApp, body })
  return { ok: true, sid: res.sid }
}

module.exports = { sendSMS, sendWhatsApp }

