const router = require('express').Router();
const auth = require('../middleware/auth');
const Location = process.env.MOCK_MODE === '1' ? null : require('../models/Location');
const store = process.env.MOCK_MODE === '1' ? require('../utils/store') : null;

router.use(auth);

router.post('/update', async (req, res) => {
  const { lat, lng, accuracy, isLive } = req.body || {};
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Invalid coordinates' });
    }
  if (process.env.MOCK_MODE === '1') {
    const loc = store.createLocation({ userId: req.user.id, lat, lng, accuracy, isLive: isLive !== false })
    return res.json({ ok: true, id: loc._id });
  }
  const loc = await Location.create({
    userId: req.user.id,
    lat,
    lng,
    accuracy,
    isLive: isLive !== false,
  });
  res.json({ ok: true, id: loc._id });
});

router.get('/latest', async (req, res) => {
  if (process.env.MOCK_MODE === '1') {
    const latest = store.latestLocation(req.user.id)
    if (!latest) return res.json(null);
    return res.json({ lat: latest.lat, lng: latest.lng, accuracy: latest.accuracy, at: latest.createdAt });
  }
  const latest = await Location.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
  if (!latest) return res.json(null);
  res.json({
    lat: latest.lat,
    lng: latest.lng,
    accuracy: latest.accuracy,
    at: latest.createdAt,
  });
});

module.exports = router;
