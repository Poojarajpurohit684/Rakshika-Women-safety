const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rakshika';

app.use(express.json());

// ── CORS ──────────────────────────────────────────────────────
// In production on Render, CLIENT_ORIGIN must be set in the
// Render dashboard environment variables for the server service.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  // Accept any Render subdomain automatically
  /\.onrender\.com$/,
  // Explicit client origin from env
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Check string matches
    const allowed = allowedOrigins.some(o => {
      if (typeof o === 'string') return o === origin;
      if (o instanceof RegExp) return o.test(origin);
      return false;
    });
    if (allowed) return callback(null, true);
    console.warn('[CORS] Blocked origin:', origin);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
if (process.env.MOCK_MODE !== '1') {
  mongoose
    .connect(MONGO_URI, { autoIndex: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
    });
} else {
  console.log('Running in MOCK_MODE (In-memory storage active)');
}

app.get('/', (_req, res) => {
  res.json({ name: 'Rakshika', status: 'ok' });
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/contacts', require('./routes/contacts'));
app.use('/location', require('./routes/location'));
app.use('/sos', require('./routes/sos'));
app.use('/share', require('./routes/share'));
app.use('/places', require('./routes/places'));
app.use('/chat', require('./routes/chat'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

