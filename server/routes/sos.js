const router = require('express').Router();
const auth = require('../middleware/auth');
const Contact = process.env.MOCK_MODE === '1' ? null : require('../models/Contact');
const store = process.env.MOCK_MODE === '1' ? require('../utils/store') : null;
const { sendAlert } = require('../utils/notifications');
const { sendSMS } = require('../utils/twilio');

router.use(auth);

router.post('/trigger', async (req, res) => {
  const { lat, lng } = req.body || {};
  const contacts = process.env.MOCK_MODE === '1'
    ? store.listContactsByUser(req.user.id)
    : await Contact.find({ userId: req.user.id });
  const phones = contacts.map((c) => c.phone);
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const liveLink = `${clientOrigin}/share/${req.user.id}`;
  const googleLink = typeof lat === 'number' && typeof lng === 'number' ? `https://maps.google.com/?q=${lat},${lng}` : '';
  const locationPart = googleLink ? ` Location: ${googleLink}` : '';
  const message = `SOS ALERT! I need help.${locationPart} Track: ${liveLink}`;

  const fallbackEmail = process.env.FALLBACK_ALERT_EMAIL;
  try {
    const results = [];
    if (phones.length) {
      for (const p of phones) {
        // Only attempt to send if the phone number exists
        if (p) {
          results.push(sendSMS(p, message));
        }
      }
      if (results.length) {
        const settled = await Promise.allSettled(results);
        
        // Log individual failures but don't crash the whole request
        settled.forEach((result, index) => {
          if (result.status === 'rejected') {
            const err = result.reason;
            console.error(`[Twilio Error] Message ${index} failed: code=${err.code} status=${err.status} message=${err.message}`);
          } else {
            console.log(`[Twilio OK] Message ${index} sent:`, result.value);
          }
        });
      }
    }
    if (fallbackEmail) {
      await sendAlert({ to: fallbackEmail, message });
    }
    res.json({ 
      ok: true, 
      notified: phones.length, 
      liveLink,
      details: `Alert sent to ${phones.length} contacts via SMS` 
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
