import { useMemo, useState } from 'react';
import {
  BellRing,
  CircleUserRound,
  Clock3,
  MapPin,
  Moon,
  PhoneCall,
  Plus,
  ShieldAlert,
  Signal,
  Sun,
  Trash2,
  Wifi,
  BatteryCharging,
  Radio,
  Pencil,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = ['Home', 'Emergency', 'Contacts', 'History', 'Settings'];
const initialContacts = [
  { id: 1, name: 'Asha (Sister)', phone: '+91 90000 10001' },
  { id: 2, name: 'Priya (Friend)', phone: '+91 90000 10002' },
];

const historySeed = [
  { id: 1, type: 'SOS Triggered', time: 'Today • 10:42 AM' },
  { id: 2, type: 'Location Shared', time: 'Yesterday • 08:10 PM' },
  { id: 3, type: 'Panic Mode Enabled', time: '22 Feb • 11:14 PM' },
];

function App() {
  const [theme, setTheme] = useState('dark');
  const [sosActive, setSosActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [contacts, setContacts] = useState(initialContacts);
  const [history, setHistory] = useState(historySeed);
  const [tracking, setTracking] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [panicMode, setPanicMode] = useState(false);
  const [contactDraft, setContactDraft] = useState({ name: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  const stats = useMemo(
    () => [
      { label: 'Total Alerts Sent', value: history.filter((item) => item.type.includes('SOS')).length + 12, icon: ShieldAlert },
      { label: 'Last Location Shared', value: '2 mins ago', icon: MapPin },
      { label: 'Tracking Status', value: tracking ? 'Active' : 'Paused', icon: Radio },
    ],
    [history, tracking]
  );

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const triggerSOS = () => {
    setShowConfirm(false);
    setSosActive(true);
    setHistory((prev) => [
      { id: Date.now(), type: 'SOS Triggered', time: new Date().toLocaleString() },
      ...prev,
    ]);
  };

  const saveContact = () => {
    if (!contactDraft.name || !contactDraft.phone) return;
    if (editingId) {
      setContacts((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...contactDraft } : item)));
      setEditingId(null);
    } else {
      setContacts((prev) => [{ id: Date.now(), ...contactDraft }, ...prev]);
    }
    setContactDraft({ name: '', phone: '' });
  };

  const editContact = (contact) => {
    setEditingId(contact.id);
    setContactDraft({ name: contact.name, phone: contact.phone });
  };

  const deleteContact = (id) => setContacts((prev) => prev.filter((item) => item.id !== id));

  return (
    <div className={`app ${theme}`}>
      <div className="ambient-glow" />
      <header className="navbar glass-card">
        <div className="logo">SOS Shield</div>
        <nav>
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
        <div className="actions">
          <button onClick={toggleTheme} className="icon-btn" aria-label="Theme toggle">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="profile-btn">
            <CircleUserRound size={18} />
            Rashika
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero glass-card">
          <div>
            <p className="kicker">Women Safety Command Center</p>
            <h1>Premium SOS Protection for every moment.</h1>
            <p>Modern safety panel with fast emergency response, live location, and intelligent panic workflows.</p>
            <div className="status-row">
              <span className={`status-dot ${sosActive ? 'alert' : 'safe'}`} />
              {sosActive ? 'Alert Active' : 'Safe'}
            </div>
          </div>

          <div className={`sos-zone ${sosActive ? 'active' : ''}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={sosActive ? { boxShadow: ['0 0 0px #ff4f87', '0 0 40px #ff4f87', '0 0 0px #ff4f87'] } : {}}
              transition={{ repeat: sosActive ? Infinity : 0, duration: 1.5 }}
              onClick={() => setShowConfirm(true)}
              className="sos-btn"
            >
              SOS
            </motion.button>
            <span>Hold 5 sec Auto-SOS enabled</span>
            {sosActive && <div className="siren" aria-label="siren animation" />}
          </div>
        </section>

        <section className="grid-layout">
          <article className="glass-card stats-panel">
            <h2>Safety Dashboard</h2>
            <div className="stats-grid">
              {stats.map(({ label, value, icon: Icon }) => (
                <motion.div key={label} className="stat-card" whileHover={{ y: -4 }}>
                  <Icon size={18} />
                  <p>{label}</p>
                  <h3>{value}</h3>
                </motion.div>
              ))}
            </div>
          </article>

          <article id="contacts" className="glass-card panel">
            <h2>Emergency Contacts</h2>
            <div className="contact-form">
              <input
                placeholder="Contact Name"
                value={contactDraft.name}
                onChange={(event) => setContactDraft((prev) => ({ ...prev, name: event.target.value }))}
              />
              <input
                placeholder="Phone Number"
                value={contactDraft.phone}
                onChange={(event) => setContactDraft((prev) => ({ ...prev, phone: event.target.value }))}
              />
              <button onClick={saveContact}>
                <Plus size={16} />
                {editingId ? 'Update' : 'Add'} Contact
              </button>
            </div>
            <div className="contact-list">
              {contacts.map((contact) => (
                <div key={contact.id} className="contact-item">
                  <div>
                    <h4>{contact.name}</h4>
                    <p>{contact.phone}</p>
                  </div>
                  <div className="row-actions">
                    <button onClick={() => editContact(contact)} aria-label="Edit contact">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteContact(contact.id)} aria-label="Delete contact">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card panel">
            <h2>Live Location & Device Status</h2>
            <div className="map-placeholder">Google Maps live preview placeholder</div>
            <div className="device-strip">
              <span>
                <BatteryCharging size={16} /> 82%
              </span>
              <span>
                <Wifi size={16} /> Strong
              </span>
              <span>
                <Signal size={16} /> 5G
              </span>
            </div>
            <label className="switch-row">
              Real-time tracking
              <input type="checkbox" checked={tracking} onChange={() => setTracking((prev) => !prev)} />
            </label>
          </article>

          <article id="history" className="glass-card panel">
            <h2>Emergency History</h2>
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <BellRing size={14} />
                <div>
                  <strong>{item.type}</strong>
                  <p>
                    <Clock3 size={12} /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </article>

          <article id="settings" className="glass-card panel settings">
            <h2>Settings</h2>
            <label className="switch-row">
              Notifications
              <input type="checkbox" checked={notifications} onChange={() => setNotifications((prev) => !prev)} />
            </label>
            <label className="switch-row">
              Panic mode (auto SMS + location)
              <input type="checkbox" checked={panicMode} onChange={() => setPanicMode((prev) => !prev)} />
            </label>
            <div className="fake-call">
              <h4>Fake Call Customization</h4>
              <input placeholder="Caller Name" defaultValue="Mom" />
              <select defaultValue="classic">
                <option value="classic">Classic Ring</option>
                <option value="siren">Emergency Siren</option>
                <option value="silent">Silent Vibrate</option>
              </select>
              <button>
                <PhoneCall size={15} /> Save Fake Call Setup
              </button>
            </div>
          </article>
        </section>
      </main>

      <AnimatePresence>
        {showConfirm && (
          <motion.div className="modal-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="modal glass-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <h3>Trigger Emergency Alert?</h3>
              <p>This will notify emergency contacts and share live location immediately.</p>
              <div className="modal-actions">
                <button className="ghost" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
                <button onClick={triggerSOS}>Confirm SOS</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
