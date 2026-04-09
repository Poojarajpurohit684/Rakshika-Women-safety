const router = require('express').Router();
const Location = process.env.MOCK_MODE === '1' ? null : require('../models/Location');
const store = process.env.MOCK_MODE === '1' ? require('../utils/store') : null;

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  if (process.env.MOCK_MODE === '1') {
    const latest = store.latestLocation(userId)
    if (!latest) return res.json(null);
    return res.json({
      lat: latest.lat,
      lng: latest.lng,
      accuracy: latest.accuracy,
      at: latest.createdAt,
    });
  }
  const latest = await Location.findOne({ userId }).sort({ createdAt: -1 });
  if (!latest) return res.json(null);
  res.json({
    lat: latest.lat,
    lng: latest.lng,
    accuracy: latest.accuracy,
    at: latest.createdAt,
  });
});

module.exports = router;
