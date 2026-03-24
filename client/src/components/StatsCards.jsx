function StatsCards({ historyCount, tracking }) {
  return (
    <section className="stats-grid fade-in-up" id="home">
      <article className="glass stat-card">
        <p>Total Alerts Sent</p>
        <h3>{historyCount}</h3>
      </article>
      <article className="glass stat-card">
        <p>Last Location Shared</p>
        <h3>Anna Nagar, Chennai</h3>
      </article>
      <article className="glass stat-card">
        <p>Active Tracking Status</p>
        <h3>{tracking ? 'Active' : 'Paused'}</h3>
      </article>
    </section>
  )
}

export default StatsCards
