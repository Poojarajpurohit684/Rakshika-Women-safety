const router = require('express').Router();
const auth = require('../middleware/auth');
const Contact = process.env.MOCK_MODE === '1' ? null : require('../models/Contact');
const store = process.env.MOCK_MODE === '1' ? require('../utils/store') : null;

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

module.exports = router;
