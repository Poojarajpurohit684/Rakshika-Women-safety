const router = require('express').Router();
const axios = require('axios');
const auth = require('../middleware/auth');

const OSM_TAGS = {
  police:      [['amenity', 'police']],
  hospital:    [['amenity', 'hospital'], ['amenity', 'clinic'], ['amenity', 'doctors']],
  bus_station: [['highway', 'bus_stop'], ['amenity', 'bus_station']],
};

function buildOverpassQuery(lat, lng, radius, type) {
  const tags = OSM_TAGS[type] || [['amenity', type]];
  const parts = tags.map(([k, v]) =>
    `node["${k}"="${v}"](around:${radius},${lat},${lng});
  way["${k}"="${v}"](around:${radius},${lat},${lng});`
  ).join('\n  ');
  return `[out:json][timeout:25];\n(\n  ${parts}\n);\nout center 30;`;
}

function typeLabel(type) {
  return { police: 'Police Station', hospital: 'Hospital', bus_station: 'Bus Stop' }[type] || type;
}

// Multiple Overpass mirrors — try each until one works
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

async function queryOverpass(query) {
  for (const url of OVERPASS_MIRRORS) {
    try {
      const { data } = await axios.post(url, query, {
        headers: { 'Content-Type': 'text/plain' },
        timeout: 20000,
      });
      return data;
    } catch (e) {
      console.warn(`[places] mirror ${url} failed:`, e.message);
    }
  }
  throw new Error('All Overpass mirrors failed');
}

// Test route — no auth
router.get('/test', async (req, res) => {
  const { lat = 21.1702, lng = 72.8311, type = 'hospital' } = req.query;
  try {
    const query = buildOverpassQuery(lat, lng, 5000, type);
    const data = await queryOverpass(query);
    res.json({ count: data.elements?.length, first: data.elements?.[0]?.tags?.name });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.use(auth);

router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 5000, type } = req.query;

  if (!lat || !lng || !type) {
    return res.status(400).json({ error: 'lat, lng, and type are required' });
  }

  try {
    const query = buildOverpassQuery(lat, lng, radius, type);
    const data = await queryOverpass(query);

    const results = (data.elements || []).map(el => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      return {
        place_id: `osm_${el.id}`,
        name: el.tags?.name || el.tags?.['name:en'] || typeLabel(type),
        vicinity: [el.tags?.['addr:street'], el.tags?.['addr:city']].filter(Boolean).join(', ') || '',
        rating: null,
        geometry: { location: { lat: elLat, lng: elLng } },
      };
    }).filter(r => r.geometry.location.lat && r.geometry.location.lng);

    console.log(`[places/osm] ${type} → ${results.length} results`);
    res.json({ status: 'OK', results });
  } catch (e) {
    console.error('[places/osm] error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
