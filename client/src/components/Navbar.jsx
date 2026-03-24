import { navLinks } from '../data/seed'

function Navbar({ theme, toggleTheme }) {
  return (
    <header className="navbar glass">
      <div className="logo-wrap">
        <div className="logo-dot" />
        <span className="logo-title">SOS Shield</span>
      </div>
      <nav>
        <ul className="nav-list">
          {navLinks.map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`}>{link}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="nav-actions">
        <button className="chip-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <details className="profile-menu">
          <summary>👩 RK</summary>
          <div className="menu-dropdown glass">
            <button>My Profile</button>
            <button>Emergency Preferences</button>
            <button>Sign Out</button>
          </div>
        </details>
      </div>
    </header>
  )
}

export default Navbar
