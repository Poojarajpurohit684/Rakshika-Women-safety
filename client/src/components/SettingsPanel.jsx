function SettingsPanel({ autoSos, setAutoSos, notifications, setNotifications, fakeCall, setFakeCall, ringtoneOptions }) {
  return (
    <section id="settings" className="glass card fade-in-up">
      <h2>Settings</h2>
      <div className="settings-grid">
        <label>
          Auto-SOS Timer (seconds)
          <input
            type="number"
            min="3"
            max="20"
            value={autoSos}
            onChange={(e) => setAutoSos(Number(e.target.value))}
          />
        </label>
        <label>
          Fake Call Name
          <input
            value={fakeCall.name}
            onChange={(e) => setFakeCall((prev) => ({ ...prev, name: e.target.value }))}
          />
        </label>
        <label>
          Fake Call Ringtone
          <select
            value={fakeCall.ringtone}
            onChange={(e) => setFakeCall((prev) => ({ ...prev, ringtone: e.target.value }))}
          >
            {ringtoneOptions.map((ringtone) => (
              <option key={ringtone}>{ringtone}</option>
            ))}
          </select>
        </label>
        <label className="toggle-inline">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
          Enable Notifications
        </label>
      </div>
    </section>
  )
}

export default SettingsPanel
