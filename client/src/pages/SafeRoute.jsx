import { useEffect, useState, useCallback, useRef } from 'react'
import Map from '../components/Map'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert, MapPin, Navigation, Home, Users,
  PhoneCall, RefreshCw, Shield, Siren, Bus,
  AlertTriangle, LocateFixed, Star, CheckCircle2
} from 'lucide-react'
import { api } from '../api'

const FILTERS = [
  { id: 'all',         label: 'All',      icon: Shield },
  { id: 'police',      label: 'Police',   icon: Siren },
  { id: 'hospital',    label: 'Hospital', icon: ShieldAlert },
  { id: 'bus_station', label: 'Bus Stop', icon: Bus },
]

const TYPE_STYLES = {
  police:      { gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', bg: 'rgba(59,130,246,0.12)', text: '#60a5fa' },
  hospital:    { gradient: 'linear-gradient(135deg, #10b981, #059669)', bg: 'rgba(16,185,129,0.12)', text: '#34d399' },
  bus_station: { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', bg: 'rgba(245,158,11,0.12)', text: '#fbbf24' },
}
const TYPE_ICONS = { police: Siren, hospital: ShieldAlert, bus_station: Bus }
const TYPE_MARKER_COLORS = { police: '#60a5fa', hospital: '#34d399', bus_station: '#fbbf24' }

// Default to New Delhi if GPS unavailable
const DEFAULT_POS = { lat: 28.6139, lng: 77.2090 }

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function fetchPlacesForType(lat, lng, type) {
  try {
    const { data } = await api.get(`/places/nearby?lat=${lat}&lng=${lng}&radius=5000&type=${type}`)
    if (data.error) throw new Error(data.error)
    return (data.results || []).map(r => ({
      id: r.place_id,
      lat: r.geometry.location.lat,
      lng: r.geometry.location.lng,
      name: r.name,
      address: r.vicinity || '',
      rating: r.rating,
      type,
      distance: getDistance(lat, lng, r.geometry.location.lat, r.geometry.location.lng),
    }))
  } catch (e) {
    console.warn(`[SafeZones] Failed for ${type}:`, e.message)
    return []
  }
}

export default function SafeRoute() {
  const [pos, setPos]           = useState(null)
  const [gpsAccurate, setGpsAccurate] = useState(false)
  const [posError, setPosError] = useState('')
  const [locating, setLocating] = useState(true)
  const [places, setPlaces]     = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [filter, setFilter]     = useState('all')
  const autoFetched             = useRef(false)

  const getLocation = useCallback(() => {
    setLocating(true)
    setPosError('')
    if (!navigator.geolocation) {
      // No GPS — use default and let user search
      setPos(DEFAULT_POS)
      setLocating(false)
      setPosError('GPS not available — showing default location (New Delhi)')
      return
    }
    // Try high-accuracy first
    navigator.geolocation.getCurrentPosition(
      p => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude })
        setGpsAccurate(true)
        setLocating(false)
      },
      () => {
        // High-accuracy failed — try low-accuracy
        navigator.geolocation.getCurrentPosition(
          p => {
            setPos({ lat: p.coords.latitude, lng: p.coords.longitude })
            setGpsAccurate(false)
            setLocating(false)
          },
          e => {
            // Both failed — fall back to default so the button still works
            setPos(DEFAULT_POS)
            setLocating(false)
            if (e.code === 1) {
              setPosError('Location permission denied — showing default location. Allow location for accurate results.')
            } else {
              setPosError('Could not get GPS — showing default location. Tap "Find Safe Places" to search.')
            }
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
        )
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
    )
  }, [])

  useEffect(() => { getLocation() }, [getLocation])

  // Auto-fetch once we have any position
  useEffect(() => {
    if (pos && !autoFetched.current && !loading) {
      autoFetched.current = true
      runSearch(pos)
    }
  }, [pos])

  const runSearch = useCallback(async (coords) => {
    const loc = coords || pos || DEFAULT_POS
    setLoading(true)
    setError('')
    setPlaces([])

    const allResults = []
    let anySuccess = false

    for (const type of ['police', 'hospital', 'bus_station']) {
      const results = await fetchPlacesForType(loc.lat, loc.lng, type)
      allResults.push(...results)
      if (results.length > 0) {
        anySuccess = true
        setPlaces([...allResults].sort((a, b) => a.distance - b.distance))
      }
    }

    if (!anySuccess) {
      setError('No places found nearby. Check your location or try again.')
    }
    setLoading(false)
  }, [pos])

  const filtered = filter === 'all' ? places : places.filter(p => p.type === filter)
  const activePos = pos || DEFAULT_POS

  return (
    <div className="min-h-screen pb-28">

      {/* Header */}
      <header className="page-header">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-primary-content">
              Safe <span className="text-gradient">Zones</span>
            </h1>
            <p className="text-xs font-medium mt-0.5 text-muted-content">
              Police · Hospitals · Bus stops within 5km
            </p>
          </div>
          {/* GPS status */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0"
            style={{
              background: gpsAccurate ? 'rgba(16,185,129,0.12)' : locating ? 'rgba(245,158,11,0.10)' : 'rgba(255,255,255,0.07)',
              border: `1px solid ${gpsAccurate ? 'rgba(16,185,129,0.25)' : locating ? 'rgba(245,158,11,0.20)' : 'rgba(255,255,255,0.12)'}`,
              color: gpsAccurate ? '#34d399' : locating ? '#fbbf24' : 'rgba(255,255,255,0.60)',
            }}>
            {locating
              ? <><RefreshCw className="w-3 h-3 animate-spin" /> Locating</>
              : gpsAccurate
              ? <><CheckCircle2 className="w-3 h-3" /> GPS</>
              : <><LocateFixed className="w-3 h-3" /> Approx</>
            }
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-0.5 scrollbar-none">
          {FILTERS.map(({ id, label, icon: Icon }) => {
            const count = id === 'all' ? places.length : places.filter(p => p.type === id).length
            return (
              <button key={id} onClick={() => setFilter(id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                style={filter === id
                  ? { background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', color: '#fff', boxShadow: '0 4px 12px rgba(233,30,140,0.30)' }
                  : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(233,30,140,0.14)', color: 'rgba(255,255,255,0.75)' }
                }>
                <Icon className="w-3.5 h-3.5" />
                {label}
                {count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black"
                    style={{ background: filter === id ? 'rgba(255,255,255,0.25)' : 'rgba(233,30,140,0.20)', color: filter === id ? '#fff' : '#ff4da6' }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </header>

      <div className="p-4 sm:p-5 space-y-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0 lg:items-start max-w-5xl mx-auto">

        {/* Map */}
        <div className="rounded-2xl overflow-hidden lg:sticky lg:top-32 lg:col-start-1"
          style={{ height: 'max(300px, 42vh)', border: '1px solid rgba(233,30,140,0.14)' }}>
          <Map
            center={[activePos.lat, activePos.lng]}
            markers={[
              { lat: activePos.lat, lng: activePos.lng, color: '#e91e8c' },
              ...filtered.map(p => ({ lat: p.lat, lng: p.lng, color: TYPE_MARKER_COLORS[p.type] || '#e91e8c' }))
            ]}
          />
        </div>

        {/* Right column */}
        <div className="space-y-3 lg:col-start-2">

          {/* GPS warning (non-blocking) */}
          {posError && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-3.5 rounded-2xl border"
              style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.20)' }}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-content leading-relaxed">{posError}</p>
                <button onClick={getLocation} className="mt-1.5 text-xs font-bold" style={{ color: '#fbbf24' }}>
                  Retry GPS →
                </button>
              </div>
            </motion.div>
          )}

          {/* API error */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl border"
              style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.20)' }}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#f87171' }} />
              <p className="text-xs text-muted-content">{error}</p>
            </div>
          )}

          {/* Search button — always enabled */}
          <button onClick={() => runSearch()} disabled={loading} className="btn-primary w-full">
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Searching nearby...</>
              : <><MapPin className="w-4 h-4" /> {places.length ? 'Refresh Places' : 'Find Safe Places'}</>
            }
          </button>

          {/* Result count */}
          {places.length > 0 && !loading && (
            <p className="text-xs font-semibold text-center text-muted-content">
              {filtered.length} place{filtered.length !== 1 ? 's' : ''} found
              {!gpsAccurate && posError ? ' (approximate location)' : ''}
            </p>
          )}

          {/* Loading skeleton */}
          {loading && places.length === 0 && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 rounded-lg w-3/4" style={{ background: 'rgba(255,255,255,0.08)' }} />
                      <div className="h-2.5 rounded-lg w-1/2" style={{ background: 'rgba(255,255,255,0.05)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Place cards */}
          <AnimatePresence>
            {filtered.map((p, i) => {
              const style = TYPE_STYLES[p.type] || { gradient: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', bg: 'rgba(233,30,140,0.12)', text: '#ff4da6' }
              const TypeIcon = TYPE_ICONS[p.type] || MapPin
              return (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="card p-4"
                  style={i === 0 ? { boxShadow: '0 0 0 1px rgba(16,185,129,0.30), 0 4px 24px rgba(0,0,0,0.45)' } : {}}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: style.bg }}>
                      <TypeIcon className="w-5 h-5" style={{ color: style.text }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm truncate text-primary-content">{p.name}</h4>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full text-white shrink-0"
                          style={{ background: style.gradient }}>
                          {p.type.replace('_', ' ')}
                        </span>
                        {i === 0 && <span className="badge badge-success shrink-0">Nearest</span>}
                      </div>
                      {p.address && <p className="text-xs mt-0.5 truncate text-muted-content">{p.address}</p>}
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs font-semibold" style={{ color: '#34d399' }}>
                          {p.distance < 1 ? `${Math.round(p.distance * 1000)}m away` : `${p.distance.toFixed(1)}km away`}
                        </span>
                        {p.rating && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(251,191,36,0.85)' }}>
                            <Star className="w-3 h-3" style={{ fill: 'rgba(251,191,36,0.65)' }} />
                            {p.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                      target="_blank" rel="noreferrer"
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 hover:scale-105 active:scale-95"
                      style={{ background: 'rgba(233,30,140,0.09)', border: '1px solid rgba(233,30,140,0.18)', color: 'rgba(233,30,140,0.80)' }}
                      aria-label={`Navigate to ${p.name}`}>
                      <Navigation className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Empty state */}
          {filtered.length === 0 && !loading && !error && (
            <div className="glass-card text-center py-12">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(123,47,247,0.15))' }}>
                <MapPin className="w-7 h-7" style={{ color: 'rgba(233,30,140,0.70)' }} />
              </div>
              <p className="text-sm font-bold text-secondary-content">
                {loading ? 'Searching...' : 'Tap "Find Safe Places"'}
              </p>
              <p className="text-xs mt-1 text-muted-content">Police stations, hospitals and bus stops near you</p>
            </div>
          )}
        </div>
      </div>

      {/* Navbar */}
      <nav className="nav-bar" role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-item"><Home className="w-5 h-5" /><span>Home</span></Link>
        <Link to="/contacts" className="nav-item"><Users className="w-5 h-5" /><span>Circle</span></Link>
        <Link to="/safe-route" className="nav-item active">
          <ShieldAlert className="w-5 h-5" /><span>SafeZones</span>
          <div className="w-4 h-0.5 rounded-full mt-0.5" style={{ background: '#e91e8c' }} />
        </Link>
        <Link to="/fake-call" className="nav-item"><PhoneCall className="w-5 h-5" /><span>FakeCall</span></Link>
      </nav>
    </div>
  )
}
