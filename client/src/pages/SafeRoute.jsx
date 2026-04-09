import { useEffect, useState } from 'react'
import Map from '../components/Map'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert, MapPin, Navigation, Home, Users,
  PhoneCall, RefreshCw, Star, Shield, Siren, Bus
} from 'lucide-react'
import { api } from '../api'

const FILTERS = [
  { id: 'all',         label: 'All',      icon: Shield },
  { id: 'police',      label: 'Police',   icon: Siren },
  { id: 'hospital',    label: 'Hospital', icon: ShieldAlert },
  { id: 'bus_station', label: 'Bus Stop', icon: Bus },
]

const TYPE_STYLES = {
  police:      { gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', bg: 'rgba(59,130,246,0.12)',   text: '#60a5fa' },
  hospital:    { gradient: 'linear-gradient(135deg, #10b981, #059669)', bg: 'rgba(16,185,129,0.12)',   text: '#34d399' },
  bus_station: { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', bg: 'rgba(245,158,11,0.12)',   text: '#fbbf24' },
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export default function SafeRoute() {
  const [pos, setPos]       = useState(null)
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(p =>
      setPos({ lat: p.coords.latitude, lng: p.coords.longitude })
    )
  }, [])

  async function loadNearby() {
    if (!pos) return
    setLoading(true)
    let results = []
    for (const t of ['police', 'hospital', 'bus_station']) {
      const { data } = await api.get(`/places/nearby?lat=${pos.lat}&lng=${pos.lng}&radius=2000&type=${t}`)
      const mapped = (data.results || []).map(r => ({
        id: r.place_id,
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng,
        name: r.name,
        address: r.vicinity,
        rating: r.rating,
        type: t,
        distance: getDistance(pos.lat, pos.lng, r.geometry.location.lat, r.geometry.location.lng),
      }))
      results.push(...mapped)
    }
    results.sort((a, b) => a.distance - b.distance)
    setPlaces(results)
    setLoading(false)
  }

  const filtered = filter === 'all' ? places : places.filter(p => p.type === filter)

  return (
    <div className="min-h-screen pb-28">

      {/* Header */}
      <header className="page-header">
        <h1 className="text-2xl font-black tracking-tight text-primary-content">
          Safe <span className="text-gradient">Zones</span>
        </h1>
        <p className="text-xs font-medium mt-0.5 text-muted-content">Find nearby help — police, hospitals, bus stops</p>

        {/* Filter pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-0.5 scrollbar-none">
          {FILTERS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={filter === id
                ? { background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', color: '#ffffff', boxShadow: '0 4px 12px rgba(233,30,140,0.30)' }
                : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(233,30,140,0.14)', color: 'rgba(255,255,255,0.75)' }
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="p-4 sm:p-5 space-y-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0 lg:items-start max-w-5xl mx-auto">

        {/* Map */}
        <div className="rounded-2xl overflow-hidden lg:sticky lg:top-32 lg:col-start-1"
          style={{ height: '280px', border: '1px solid rgba(233,30,140,0.14)' }}>
          <Map
            center={pos ? [pos.lat, pos.lng] : null}
            markers={filtered.map(p => ({ lat: p.lat, lng: p.lng }))}
          />
        </div>

        {/* Right column */}
        <div className="space-y-3 lg:col-start-2">
          {/* Load button */}
          <button onClick={loadNearby} disabled={loading || !pos} className="btn-primary w-full">
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Searching nearby...</>
              : <><MapPin className="w-4 h-4" /> {places.length ? 'Refresh' : 'Find Safe Places'}</>
            }
          </button>

          {!pos && (
            <p className="text-center text-xs font-medium text-muted-content">
              Waiting for your location...
            </p>
          )}

          {/* Place list */}
          <AnimatePresence>
            {filtered.map((p, i) => {
              const style = TYPE_STYLES[p.type] || { gradient: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', bg: 'rgba(233,30,140,0.12)', text: '#ff4da6' }
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-4"
                  style={i === 0 ? { boxShadow: '0 0 0 1px rgba(16,185,129,0.30), 0 4px 24px rgba(0,0,0,0.45)' } : {}}
                >
                  <div className="flex items-start gap-3">
                    {/* Type icon */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: style.bg }}>
                      <MapPin className="w-4 h-4" style={{ color: style.text }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm truncate text-primary-content">{p.name}</h4>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full text-white shrink-0"
                          style={{ background: style.gradient }}>
                          {p.type.replace('_', ' ')}
                        </span>
                        {i === 0 && (
                          <span className="badge badge-success shrink-0">Nearest</span>
                        )}
                      </div>
                      {p.address && (
                        <p className="text-xs mt-0.5 truncate text-muted-content">{p.address}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs font-semibold" style={{ color: '#34d399' }}>
                          {p.distance < 1
                            ? `${Math.round(p.distance * 1000)}m away`
                            : `${p.distance.toFixed(1)}km away`
                          }
                        </span>
                        {p.rating && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(251,191,36,0.85)' }}>
                            <Star className="w-3 h-3" style={{ fill: 'rgba(251,191,36,0.65)' }} />
                            {p.rating}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Navigate */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0"
                      style={{ background: 'rgba(233,30,140,0.09)', border: '1px solid rgba(233,30,140,0.18)', color: 'rgba(233,30,140,0.80)' }}
                      aria-label={`Navigate to ${p.name}`}
                    >
                      <Navigation className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {places.length === 0 && !loading && (
            <div className="glass-card text-center py-10">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-muted-content" />
              <p className="text-sm font-medium text-secondary-content">No places loaded yet</p>
              <p className="text-xs mt-1 text-muted-content">Tap "Find Safe Places" to search nearby</p>
            </div>
          )}
        </div>
      </div>

      {/* Navbar */}
      <nav className="nav-bar" role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-item"><Home className="w-5 h-5" /><span>Home</span></Link>
        <Link to="/contacts" className="nav-item"><Users className="w-5 h-5" /><span>Circle</span></Link>
        <Link to="/safe-route" className="nav-item active"><ShieldAlert className="w-5 h-5" /><span>SafeZones</span></Link>
        <Link to="/fake-call" className="nav-item"><PhoneCall className="w-5 h-5" /><span>FakeCall</span></Link>
      </nav>
    </div>
  )
}
