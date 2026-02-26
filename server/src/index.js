import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let contacts = [
  { id: 1, name: 'Asha (Sister)', phone: '+91 90000 10001' },
  { id: 2, name: 'Priya (Friend)', phone: '+91 90000 10002' },
];

let history = [
  { id: 1, type: 'SOS Triggered', time: 'Today • 10:42 AM' },
  { id: 2, type: 'Location Shared', time: 'Yesterday • 08:10 PM' },
];

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/contacts', (_req, res) => res.json(contacts));
app.post('/api/contacts', (req, res) => {
  const contact = { id: Date.now(), ...req.body };
  contacts = [contact, ...contacts];
  res.status(201).json(contact);
});
app.put('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.map((contact) => (contact.id === id ? { ...contact, ...req.body } : contact));
  res.json({ success: true });
});
app.delete('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);
  res.json({ success: true });
});

app.get('/api/history', (_req, res) => res.json(history));
app.post('/api/history', (req, res) => {
  const event = { id: Date.now(), ...req.body };
  history = [event, ...history];
  res.status(201).json(event);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Rashika safety server running on ${port}`);
});
