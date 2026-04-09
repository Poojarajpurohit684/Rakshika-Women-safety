import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiBase } from '../auth'
import Map from '../components/Map'
import { MapPin, RefreshCw, Shield, Clock, Lock } from 'lucide-react'

export default function Share() {
  const { userId }          = useParams()
  const [loc, setLoc]       = useState(null)
  const [status, setStatus] = useState('loading')
  const [lastFetch, setLastFetch] = useState(null)

  async function load() {
    try {
      const res  = await fetch(`${apiBase()}/share/${userId}`)
      const data = await res.json()
      setLoc(data)
      setStatus('ok')
      setLastFetch(new Date())
    } catch (e) {
      setStatus(e.message || 'error')
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [userId])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5"
      style={{ background: 'linear-gradient(160deg, #0a0008 0%, #110014 60%, #0d0015 100%)' }}>

      {/* Background orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: 'rgba(233,30,140,0.12)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: 'rgba(123,47,247,0.12)' }} />
      </div>

      <div className="w-full max-w-md space-y-5 relative z-10">

        {/* Brand header */}
        <div className="text-center space-y-3">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', boxShadow: '0 8px 24px rgba(233,30,140,0.35)' }}
          >
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Live Location</h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Shared securely via Rakshika
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="glass-card space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <RefreshCw className="w-7 h-7 animate-spin" style={{ color: '#e91e8c' }} />
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.60)' }}>Fetching location...</p>
            </div>
          )}

          {status !== 'loading' && status !== 'ok' && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.12)' }}>
                <MapPin className="w-6 h-6" style={{ color: 'rgba(248,113,113,0.70)' }} />
              </div>
              <p className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>Location unavailable</p>
              <p className="text-xs text-center max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{status}</p>
            </div>
          )}

          {status === 'ok' && loc && (
            <>
              {/* Status bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: '#34d399', boxShadow: '0 0 6px #10b981' }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#34d399' }}>Live</span>
                </div>
                {lastFetch && (
                  <div className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: 'rgba(255,255,255,0.45)' }}>
                    <Clock className="w-3 h-3" />
                    {lastFetch.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden"
                style={{ height: '260px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Map
                  center={[loc.lat, loc.lng]}
                  markers={[{ lat: loc.lat, lng: loc.lng, color: '#e91e8c' }]}
                />
              </div>

              {/* Coordinates */}
              <div className="flex items-center gap-2 px-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(233,30,140,0.70)' }} />
                <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2" style={{ color: 'rgba(255,255,255,0.28)' }}>
          <Lock className="w-3 h-3" />
          <p className="text-[10px] font-semibold uppercase tracking-widest">
            Rakshika Safety · End-to-End Encrypted
          </p>
        </div>
      </div>
    </div>
  )
}
