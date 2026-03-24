function SOSPanel({ status, onTrigger, tracking, setTracking, panicMode, setPanicMode }) {
  return (
    <section id="emergency" className="glass card sos-panel fade-in-up">
      <div className="status-row">
        <h2>Emergency Center</h2>
        <span className={`status-pill ${status === 'Safe' ? 'safe' : 'alert'}`}>
          {status}
        </span>
      </div>
      <button className={`sos-button ${status !== 'Safe' ? 'active' : ''}`} onClick={onTrigger}>
        SOS
      </button>
      <p className="hint">Hold for 5 seconds in settings mode for auto activation.</p>
      <div className="toggles-grid">
        <label className="toggle-card">
          <input
            type="checkbox"
            checked={tracking}
            onChange={(e) => setTracking(e.target.checked)}
          />
          <span>Real-time Tracking</span>
        </label>
        <label className="toggle-card">
          <input
            type="checkbox"
            checked={panicMode}
            onChange={(e) => setPanicMode(e.target.checked)}
          />
          <span>Panic Mode (SMS + Location)</span>
        </label>
      </div>
    </section>
  )
}

export default SOSPanel
