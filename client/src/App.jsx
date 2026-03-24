import { useMemo, useState } from 'react'
import ContactsManager from './components/ContactsManager'
import Navbar from './components/Navbar'
import SettingsPanel from './components/SettingsPanel'
import SOSPanel from './components/SOSPanel'
import StatsCards from './components/StatsCards'
import { initialContacts, initialHistory, ringtoneOptions } from './data/seed'

function App() {
  const [theme, setTheme] = useState('dark')
  const [status, setStatus] = useState('Safe')
  const [showModal, setShowModal] = useState(false)
  const [tracking, setTracking] = useState(true)
  const [panicMode, setPanicMode] = useState(false)
  const [contacts, setContacts] = useState(initialContacts)
  const [history, setHistory] = useState(initialHistory)
  const [notifications, setNotifications] = useState(true)
  const [autoSos, setAutoSos] = useState(5)
  const [fakeCall, setFakeCall] = useState({ name: 'Office Desk', ringtone: ringtoneOptions[0] })

  const batteryLevel = useMemo(() => `${Math.round(70 + Math.random() * 20)}%`, [])

  const triggerSOS = () => {
    setShowModal(false)
    setStatus('Alert Active')
    setHistory((prev) => [
      { id: Date.now(), type: panicMode ? 'Panic Mode Triggered' : 'SOS Triggered', time: new Date().toLocaleString() },
      ...prev,
    ])
  }

  return (
    <main className={`app theme-${theme}`}>
      <Navbar theme={theme} toggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))} />

      <div className="layout">
        <StatsCards historyCount={history.length} tracking={tracking} />

        <SOSPanel
          status={status}
          onTrigger={() => setShowModal(true)}
          tracking={tracking}
          setTracking={setTracking}
          panicMode={panicMode}
          setPanicMode={setPanicMode}
        />

        <section className="split-grid">
          <section id="history" className="glass card fade-in-up">
            <h2>Emergency History</h2>
            <div className="timeline">
              {history.map((event) => (
                <article key={event.id} className="timeline-item">
                  <p>{event.type}</p>
                  <small>{event.time}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="glass card fade-in-up">
            <h2>Live Location Preview</h2>
            <div className="map-placeholder">Google Maps Integration Placeholder</div>
            <div className="status-grid">
              <p>📶 Network: Strong LTE</p>
              <p>🔋 Battery: {batteryLevel}</p>
              <p>📍 Sharing: {tracking ? 'On' : 'Off'}</p>
            </div>
          </section>
        </section>

        <ContactsManager contacts={contacts} setContacts={setContacts} />

        <SettingsPanel
          autoSos={autoSos}
          setAutoSos={setAutoSos}
          notifications={notifications}
          setNotifications={setNotifications}
          fakeCall={fakeCall}
          setFakeCall={setFakeCall}
          ringtoneOptions={ringtoneOptions}
        />
      </div>

      {status !== 'Safe' && <div className="siren-overlay" />}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal glass">
            <h3>Confirm Emergency Alert</h3>
            <p>This action will notify your emergency contacts with live location.</p>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button className="danger" onClick={triggerSOS}>
                Trigger SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
