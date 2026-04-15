const router = require('express').Router();
const auth = require('../middleware/auth');
const Contact = process.env.MOCK_MODE === '1' ? null : require('../models/Contact');
const store = process.env.MOCK_MODE === '1' ? require('../utils/store') : null;
const { sendSMS } = require('../utils/twilio');

router.use(auth);

router.get('/', async (req, res) => {
  if (process.env.MOCK_MODE === '1') {
    return res.json(store.listContactsByUser(req.user.id));
  }
  const items = await Contact.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Missing fields' });
  if (process.env.MOCK_MODE === '1') {
    const created = store.createContact({ userId: req.user.id, name, phone });
    return res.json(created);
  }
  const created = await Contact.create({ userId: req.user.id, name, phone });
  res.json(created);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (process.env.MOCK_MODE === '1') {
    store.deleteContact(req.user.id, id);
    return res.json({ ok: true });
  }
  await Contact.deleteOne({ _id: id, userId: req.user.id });
  res.json({ ok: true });
});

// POST /contacts/:id/verify — send a test SMS to confirm the number works
router.post('/:id/verify', async (req, res) => {
  try {
    const contact = process.env.MOCK_MODE === '1'
      ? store.listContactsByUser(req.user.id).find(c => c._id === req.params.id)
      : await Contact.findOne({ _id: req.params.id, userId: req.user.id });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    const msg = `Hi ${contact.name}! You've been added as an emergency contact on Rakshika safety app. You'll receive SOS alerts if needed.`;
    await sendSMS(contact.phone, msg);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
