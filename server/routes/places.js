const router = require('express').Router();
const axios = require('axios');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/nearby', async (req, res) => {
  console.log('Received /nearby request with query:', req.query);
  const { lat, lng, radius, type } = req.query;
  const key = process.env.GOOGLE_MAPS_KEY || process.env.VITE_GOOGLE_MAPS_KEY;

  if (!key) {
    console.error('Google Maps API key not configured on server');
    return res.status(500).json({ error: 'Google Maps API key not configured on server' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${key}`;
    console.log('Proxying to Google Places API:', url);
    const response = await axios.get(url);
    console.log('Received response from Google Places API. Status:', response.status);
    console.log('Response Body Summary:', {
      status: response.data.status,
      resultsCount: response.data.results?.length,
      errorMessage: response.data.error_message
    });
    res.json(response.data);
  } catch (e) {
    console.error('Google Places Proxy Error:', e.message);
    res.status(500).json({ error: 'Failed to fetch from Google Places' });
  }
});

module.exports = router;
