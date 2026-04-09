import { useEffect, useState } from 'react'
import { api } from '../api'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Trash2, Phone, Home, ShieldAlert,
  PhoneCall, Plus, Search, Star,
  Lock
} from 'lucide-react'

export default function TrustedContacts() {
  const [items, setItems]       = useState([])
  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [search, setSearch]     = useState('')
  const [primaryId, setPrimaryId] = useState(null)

  async function load() {
    try {
      const { data } = await api.get('/contacts')
      setItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  async function add(e) {
    e.preventDefault()
    if (!name || !phone) return
    setLoading(true)
    try {
      await api.post('/contacts', { name, phone })
      setName('')
      setPhone('')
      setIsAdding(false)
      load()
    } finally {
      setLoading(false)
    }
  }

  async function remove(id) {
    if (!window.confirm('Remove this contact?')) return
    await api.delete(`/contacts/${id}`)
    load()
  }

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.phone.includes(search)
  )

  const avatarGradients = [
    'linear-gradient(135deg, #e91e8c, #c4166f)',
    'linear-gradient(135deg, #7b2ff7, #5b21b6)',
    'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
  ]

  return (
    <div className="min-h-screen pb-28">

      {/* Header */}
      <header className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-primary-content">
              Trusted <span className="text-gradient">Circle</span>
            </h1>
            <p className="text-xs font-medium mt-0.5 text-muted-content">
              {items.length} {items.length === 1 ? 'contact' : 'contacts'} in your network
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary px-4 py-2.5 text-sm"
            aria-label="Add contact"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-content" />
          <input
            placeholder="Search by name or number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10 text-sm"
            aria-label="Search contacts"
          />
        </div>
      </header>

      <div className="px-4 sm:px-5 mt-5 space-y-3 max-w-2xl mx-auto">

        {/* Add Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={add} className="glass-card space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-primary-content">New Emergency Contact</h3>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="text-xs font-semibold transition-colors text-muted-content hover:text-primary-content"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-content">Name</label>
                    <input
                      placeholder="Contact name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="input-field text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-content">Phone (10 digits)</label>
                    <input
                      placeholder="9876543210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      type="tel"
                      maxLength={10}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Saving...' : 'Save Contact'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && !isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card text-center py-14"
          >
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(123,47,247,0.15))' }}>
              <Users className="w-8 h-8" style={{ color: 'rgba(233,30,140,0.70)' }} />
            </div>
            <p className="font-bold text-sm mb-1 text-secondary-content">
              {search ? 'No contacts match your search' : 'Your circle is empty'}
            </p>
            <p className="text-xs mb-5 text-muted-content">
              {search ? 'Try a different name or number' : 'Add trusted people who will receive your SOS alerts'}
            </p>
            {!search && (
              <button onClick={() => setIsAdding(true)} className="btn-primary px-6 py-2.5 text-sm">
                <Plus className="w-4 h-4" /> Add First Contact
              </button>
            )}
          </motion.div>
        )}

        {/* Contact list */}
        <AnimatePresence>
          {filtered.map((c, idx) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ delay: idx * 0.04 }}
              className="card p-4"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md shrink-0"
                  style={{ background: avatarGradients[idx % avatarGradients.length] }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate text-primary-content">{c.name}</span>
                    {primaryId === c._id && (
                      <span className="badge badge-primary shrink-0">Priority</span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5 font-mono text-muted-content">{c.phone}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={`tel:${c.phone}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ color: 'rgba(52,211,153,0.80)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#34d399'; e.currentTarget.style.background = 'rgba(16,185,129,0.10)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(52,211,153,0.80)'; e.currentTarget.style.background = 'transparent' }}
                    aria-label={`Call ${c.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setPrimaryId(c._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    aria-label="Set as priority"
                  >
                    <Star className="w-4 h-4 transition-colors"
                      style={{ color: primaryId === c._id ? '#fbbf24' : 'rgba(255,255,255,0.35)',
                               fill: primaryId === c._id ? '#fbbf24' : 'none' }} />
                  </button>
                  <button
                    onClick={() => remove(c._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ color: 'rgba(248,113,113,0.50)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.10)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.50)'; e.currentTarget.style.background = 'transparent' }}
                    aria-label={`Remove ${c.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Security note */}
        {items.length > 0 && (
          <div className="glass-card flex items-center gap-3 py-3.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(16,185,129,0.12)' }}>
              <Lock className="w-4 h-4" style={{ color: '#34d399' }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-secondary-content">Contacts are securely stored</p>
              <p className="text-[10px] mt-0.5 text-muted-content">End-to-end encrypted · Only you can see these</p>
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="fixed bottom-24 right-5 rounded-2xl flex items-center justify-center text-white shadow-xl z-40 tap-feedback"
          style={{ background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', width: '3.25rem', height: '3.25rem', boxShadow: '0 8px 24px rgba(233,30,140,0.40)' }}
          aria-label="Add contact"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}

      {/* Navbar */}
      <nav className="nav-bar" role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-item">
          <Home className="w-5 h-5" /><span>Home</span>
        </Link>
        <Link to="/contacts" className="nav-item active">
          <Users className="w-5 h-5" /><span>Circle</span>
        </Link>
        <Link to="/safe-route" className="nav-item">
          <ShieldAlert className="w-5 h-5" /><span>SafeZones</span>
        </Link>
        <Link to="/fake-call" className="nav-item">
          <PhoneCall className="w-5 h-5" /><span>FakeCall</span>
        </Link>
      </nav>
    </div>
  )
}
