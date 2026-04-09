const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rakshika';

app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://192.168.0.0:5173', // or your PC LAN address
  process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // mobile apps/tools
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
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

