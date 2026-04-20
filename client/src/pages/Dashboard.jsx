import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../AuthContext'
import { api } from '../api'
import Map from '../components/Map'
import { WomenSafetySection } from '../components/WomenSafetySection.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert, MapPin, MessageSquare, Home, Users, PhoneCall, Shield,
  Volume2, VolumeX, Send, RefreshCw, Clock,
  Bell, CheckCircle2, AlertTriangle, Zap, X, Moon, Sun, Car, Ambulance,
  UserRound, TriangleAlert, HeartHandshake, Baby, Navigation, Wifi, WifiOff,
  ChevronRight, Activity, Lock
} from 'lucide-react'

/* ─────────────────────────────────────────
   Geolocation hook — unchanged logic
───────────────────────────────────────── */
function useGeolocation() {
  const [pos, setPos] = useState(null)
  const [error, setError] = useState('')
  const watchId = useRef(null)

  function getOnce() {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return }
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      (e) => setError(e.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }

  function startWatch(onUpdate) {
    if (watchId.current) return
    watchId.current = navigator.geolocation.watchPosition(
      (p) => {
        const coords = { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }
        setPos(coords); onUpdate?.(coords)
      },
      (e) => setError(e.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    )
  }

  function stopWatch() {
    if (watchId.current) { navigator.geolocation.clearWatch(watchId.current); watchId.current = null }
  }

  useEffect(() => () => stopWatch(), [])
  return { pos, error, getOnce, startWatch, stopWatch }
}

/* ─────────────────────────────────────────
   Chat Assistant — unchanged logic, new UI
───────────────────────────────────────── */
function ChatAssistant({ onShare, onSOS, isDark }) {
  const [open, setOpen] = useState(false)
  const [log, setLog] = useState([{ role: 'assistant', text: 'Hi! I\'m Rakshika. Ask me anything about your safety.' }])
  const [input, setInput] = useState('')
  const [isVoice, setIsVoice] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('Gemini')
  const chatEndRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [log])

  function speak(text) {
    if (!window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 1.0; u.pitch = 1.1
    window.speechSynthesis.speak(u)
  }

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const userMsg = { role: 'user', text }
    setLog(prev => [...prev, userMsg]); setInput(''); setLoading(true)
    const lower = text.toLowerCase()
    let localHandled = false
    if (lower.includes('location') || lower.includes('share')) { onShare?.(); localHandled = true }
    else if (lower.includes('sos') || lower.includes('alert') || lower.includes('emergency')) { onSOS?.(); localHandled = true }
    else if (lower.includes('police') || lower.includes('hospital') || lower.includes('safe') || lower.includes('zone')) { setTimeout(() => navigate('/safe-route'), 2000); localHandled = true }
    else if (lower.includes('fake') || lower.includes('call') || lower.includes('phone')) { setTimeout(() => navigate('/fake-call'), 2000); localHandled = true }
    if (localHandled) {
      setLog(prev => [...prev, { role: 'assistant', text: 'On it! Handling that for you right now.' }])
      setAiStatus('offline'); setLoading(false); return
    }
    try {
      setAiStatus('Gemini')
      const history = [...log, userMsg].map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] }))
      const { data } = await api.post('/chat', { message: text, history })
      const reply = data?.reply || "I'm having trouble right now, please try again."
      setLog(prev => [...prev, { role: 'assistant', text: reply }])
      if (isVoice) speak(reply)
    } catch {
      setAiStatus('fallback')
      const fallback = "Can't reach AI right now, but I'm here. Ask me to send SOS, share location, or find safe zones."
      setLog(prev => [...prev, { role: 'assistant', text: fallback }])
      if (isVoice) speak(fallback)
    } finally { setLoading(false) }
  }

  const triggerBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)'
  const triggerBorder = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(59,130,246,0.12)'

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all tap-feedback"
        style={{ background: triggerBg, borderColor: triggerBorder }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', boxShadow: '0 4px 12px rgba(233,30,140,0.30)' }}>
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold text-primary-content">Ask Rakshika</p>
          <p className="text-xs mt-0.5 text-muted-content">AI safety assistant · Gemini powered</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#34d399' }} />
          <ChevronRight className="w-4 h-4 text-muted-content" />
        </div>
      </button>

      {/* Full-screen chat overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[200] flex flex-col"
            style={{ background: isDark ? '#0a0008' : '#faf5ff' }}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 pt-14 pb-4 border-b"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(59,130,246,0.10)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)' }}>
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-sm text-primary-content">Rakshika AI</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#34d399' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#34d399' }}>{aiStatus}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsVoice(!isVoice)}
                  className="p-2.5 rounded-xl transition-all"
                  style={{
                    background: isVoice ? 'rgba(233,30,140,0.15)' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.06)'),
                    color: isVoice ? '#e91e8c' : (isDark ? 'rgba(255,255,255,0.70)' : 'rgba(15,23,42,0.72)')
                  }}
                >
                  {isVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button onClick={() => setOpen(false)}
                  className="p-2.5 rounded-xl transition-all"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.06)',
                    color: isDark ? 'rgba(255,255,255,0.70)' : 'rgba(15,23,42,0.72)'
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {log.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                    m.role === 'assistant' ? 'rounded-tl-sm' : 'rounded-tr-sm'
                  }`}
                    style={m.role === 'assistant' ? {
                      background: isDark ? 'rgba(255,255,255,0.07)' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(59,130,246,0.10)'}`,
                      color: isDark ? 'rgba(255,255,255,0.92)' : '#1a0a2e'
                    } : {
                      background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(233,30,140,0.25)'
                    }}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.07)' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(59,130,246,0.10)'}`
                    }}> 
                    {[0,1,2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: '#e91e8c' }}
                        animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-8 pt-3 border-t flex gap-2"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(59,130,246,0.10)' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && send()}
                placeholder="Ask anything about your safety..."
                className="input-field flex-1 !py-3.5 !text-sm"
              />
              <button onClick={send} disabled={loading}
                className="btn-primary !px-4 !py-3.5 shrink-0 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─────────────────────────────────────────
   Dashboard — main component
───────────────────────────────────────── */
export default function Dashboard() {
  const { auth, setAuth } = useContext(AuthContext)
  const navigate = useNavigate()
  const { pos, error, getOnce, startWatch, stopWatch } = useGeolocation()
  const [status, setStatus] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [sosCountdown, setSosCountdown] = useState(0)
  const [showError, setShowError] = useState(false)
  const [isDark, setIsDark] = useState(() => { document.body.classList.add('dark'); return true })
  const [checkInTime, setCheckInTime] = useState(0)
  const [checkInActive, setCheckInActive] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome Back', message: 'Your location is being tracked', type: 'success', time: 'now' }
  ])
  const [contactsCount, setContactsCount] = useState(0)
  const [isSOSPressed, setIsSOSPressed] = useState(false)
  const [screenShake, setScreenShake] = useState(false)
  const countdownTimer = useRef(null)
  const checkInTimerRef = useRef(null)
  const longPressTimer = useRef(null)
  const lastUpdate = useRef(0)

  useEffect(() => { getOnce() }, [])
  useEffect(() => {
    if (isDark) document.body.classList.add('dark')
    else document.body.classList.remove('dark')
  }, [isDark])

  useEffect(() => {
    if (checkInActive && checkInTime > 0) {
      checkInTimerRef.current = setInterval(() => {
        setCheckInTime(prev => {
          if (prev <= 1) { clearInterval(checkInTimerRef.current); setCheckInActive(false); triggerSOS(); return 0 }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(checkInTimerRef.current)
  }, [checkInActive])

  function startCheckIn(mins) { setCheckInTime(mins * 60); setCheckInActive(true); setStatus(`Check-in: ${mins}m`) }
  function cancelCheckIn() { clearInterval(checkInTimerRef.current); setCheckInActive(false); setCheckInTime(0); setStatus('Check-in cancelled') }
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  useEffect(() => {
    if (error) { setShowError(true); const t = setTimeout(() => setShowError(false), 6000); return () => clearTimeout(t) }
  }, [error])

  async function handleLocationUpdate(coords) {
    const now = Date.now()
    if (now - lastUpdate.current < 10000) return
    lastUpdate.current = now
    try {
      await api.post('/location/update', { ...coords, isLive: true })
      setStatus(`Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`)
    } catch { setStatus('Update failed') }
  }

  function toggleSharing() {
    if (isSharing) { stopWatch(); setIsSharing(false); setStatus('Sharing stopped') }
    else { startWatch(handleLocationUpdate); setIsSharing(true); setStatus('Live sharing') }
  }

  async function triggerSOS() {
    let coords = { lat: pos?.lat, lng: pos?.lng }
    if (!coords.lat || !coords.lng) {
      try {
        const p = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
        )
        coords = { lat: p.coords.latitude, lng: p.coords.longitude }
      } catch (err) { console.warn('Geolocation failed for SOS', err) }
    }
    try {
      const { data } = await api.post('/sos/trigger', coords)
      if (data.notified === 0) { setStatus('SOS Sent (No Contacts!)'); alert('SOS Sent! However, you have no emergency contacts saved in your circle.') }
      else { setStatus(`SOS → ${data.notified} Guardians`); alert(`EMERGENCY SOS SENT! Notified ${data.notified} guardians with your location.`) }
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.message
      setStatus(`SOS Failed`); alert(`SOS FAILED: ${errorMsg}. Please call emergency services manually.`)
    }
  }

  function startSOSCountdown() {
    if (sosCountdown > 0) return
    setSosCountdown(5)
    countdownTimer.current = setInterval(() => {
      setSosCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownTimer.current); triggerSOS(); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  function cancelSOS() { clearInterval(countdownTimer.current); setSosCountdown(0); setStatus('SOS Cancelled') }

  function handleSOSPressStart() {
    setIsSOSPressed(true)
    longPressTimer.current = setTimeout(() => {
      setScreenShake(true); startSOSCountdown(); setTimeout(() => setScreenShake(false), 500)
    }, 500)
  }

  function handleSOSPressEnd() {
    setIsSOSPressed(false)
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  useEffect(() => {
    const fetchContacts = async () => {
      try { const { data } = await api.get('/contacts'); setContactsCount(data.length) }
      catch { /* silent */ }
    }
    fetchContacts()
  }, [])

  const clearNotifications = () => setNotifications([])
  const handleLogout = () => {
    localStorage.removeItem('rakshika_token'); localStorage.removeItem('rakshika_user')
    setAuth(null); navigate('/login'); setShowProfile(false)
  }

  const safetyScore = Math.min(60 + contactsCount * 10, 100)

  const HELPLINES = [
    { num: '112', label: 'Emergency', icon: TriangleAlert, from: '#f97316', to: '#ea580c' },
    { num: '100',  label: 'Police',    icon: Car,           from: '#ef4444', to: '#dc2626' },
    { num: '108',  label: 'Ambulance', icon: Ambulance,     from: '#10b981', to: '#059669' },
    { num: '1091', label: 'Women',     icon: UserRound,     from: '#8b5cf6', to: '#7c3aed' },
    { num: '181',  label: 'Domestic',  icon: HeartHandshake,from: '#e91e8c', to: '#c4166f' },
    { num: '1098', label: 'Child',     icon: Baby,          from: '#06b6d4', to: '#0891b2' },
  ]

  const panelBg     = isDark ? '#110014' : '#ffffff'
  const panelBorder = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(59,130,246,0.14)'
  const panelCls    = `absolute right-0 top-[68px] rounded-3xl shadow-2xl border z-50 overflow-hidden`

  return (
    <div className={`dashboard-shell min-h-screen pb-28 ${screenShake ? 'animate-shake' : ''}`}>

      {/* ══════════════════════════════════════
          HEADER
      ══════════════════════════════════════ */}
      <div className="page-header mb-0">
        <div className="flex items-center justify-between gap-4">
          {/* Brand + greeting */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', boxShadow: '0 4px 16px rgba(233,30,140,0.35)' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-content">Rakshika</p>
                <span className="badge badge-primary">Premium</span>
              </div>
              <h1 className="text-lg font-black leading-none text-primary-content">
                Hey, <span className="gradient-text">{auth?.user?.name?.split(' ')[0] || 'there'}</span>
              </h1>
              <p className="text-[11px] text-muted-content">Fast action, calm confidence, premium safety.</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 relative">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.08)' }}
            >
              {isDark
                ? <Sun className="w-4 h-4" style={{ color: '#fbbf24' }} />
                : <Moon className="w-4 h-4" style={{ color: '#7b2ff7' }} />
              }
            </motion.button>

            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl flex items-center justify-center relative transition-all"
              style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.08)',
                       color: isDark ? 'rgba(255,255,255,0.80)' : 'rgba(15,23,42,0.72)' }}
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
                  style={{ background: '#e91e8c' }} />
              )}
            </motion.button>

            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowProfile(!showProfile)}
              className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center text-white font-black text-sm shadow-md"
              style={{ background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', boxShadow: '0 4px 12px rgba(233,30,140,0.30)' }}
            >
              {auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </motion.button>

            {/* Notifications panel */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  className={`${panelCls} w-80 max-h-72 overflow-y-auto`}
                  style={{ background: panelBg, borderColor: panelBorder }}
                >
                  <div className="px-4 py-3.5 border-b flex justify-between items-center sticky top-0"
                    style={{ borderColor: panelBorder, background: panelBg }}>
                    <span className="font-black text-sm text-primary-content">Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={clearNotifications} className="text-[11px] font-bold" style={{ color: '#2563eb' }}>Clear all</button>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    {notifications.length === 0
                      ? <p className="text-center text-xs py-5 text-muted-content">All clear</p>
                      : notifications.map(n => (
                        <div key={n.id} className={`p-3 rounded-xl border-l-[3px]`}
                          style={{
                            background: n.type === 'success'
                              ? (isDark ? 'rgba(16,185,129,0.10)' : 'rgba(16,185,129,0.06)')
                              : (isDark ? 'rgba(239,68,68,0.10)' : 'rgba(239,68,68,0.06)'),
                            borderLeftColor: n.type === 'success' ? '#10b981' : '#ef4444'
                          }}>
                          <p className="font-bold text-xs text-primary-content">{n.title}</p>
                          <p className="text-[11px] mt-0.5 text-muted-content">{n.message}</p>
                        </div>
                      ))
                    }
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile panel */}
            <AnimatePresence>
              {showProfile && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  className={`${panelCls} w-68`}
                  style={{ background: panelBg, borderColor: panelBorder }}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)' }}>
                        {auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-black text-sm text-primary-content">{auth?.user?.name || 'User'}</p>
                        <p className="text-[11px] mt-0.5 text-muted-content">{auth?.user?.email || ''}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-xl p-3 text-center"
                        style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.05)' }}>
                        <p className="text-lg font-black" style={{ color: '#e91e8c' }}>{contactsCount}</p>
                        <p className="text-[10px] mt-0.5 text-muted-content">Contacts</p>
                      </div>
                      <div className="rounded-xl p-3 text-center"
                        style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.05)' }}>
                        <p className="text-lg font-black" style={{ color: '#34d399' }}>{safetyScore}%</p>
                        <p className="text-[10px] mt-0.5 text-muted-content">Safety</p>
                      </div>
                    </div>
                    <Link to="/contacts" onClick={() => setShowProfile(false)}
                      className="block w-full py-2.5 rounded-xl text-center font-bold text-sm mb-2 transition-all text-primary-content"
                      style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.06)' }}
                    >Manage Contacts</Link>
                    <button onClick={handleLogout}
                      className="w-full py-2.5 rounded-xl text-center font-bold text-sm transition-all"
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}
                    >Sign Out</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          HERO — SOS + status strip
      ══════════════════════════════════════ */}
      <div className="dashboard-hero glass-card relative overflow-hidden px-5 pt-8 pb-10"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #1a0028 0%, #0a0008 100%)'
            : 'linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)'
        }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[70px]"
            style={{ background: isDark ? 'rgba(239,68,68,0.18)' : 'rgba(59,130,246,0.12)' }} />
          <div className="absolute top-8 left-1/4 w-48 h-48 rounded-full blur-[60px]"
            style={{ background: isDark ? 'rgba(233,30,140,0.12)' : 'rgba(59,130,246,0.10)' }} />
          <div className="absolute top-8 right-1/4 w-48 h-48 rounded-full blur-[60px]"
            style={{ background: isDark ? 'rgba(123,47,247,0.12)' : 'rgba(14,165,233,0.10)' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Status pill */}
          <div className="status-pill">
            <Activity className="w-3.5 h-3.5" style={{ color: '#34d399' }} />
            <span>Shield Active</span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#34d399' }} />
          </div>

          {/* Premium metrics */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="hero-metrics w-full">
            <div className="hero-metric">
              <span className="metric-label">Guardians</span>
              <div className="metric-value">{contactsCount}</div>
              <span className="metric-sub">In your safety circle</span>
            </div>
            <div className="hero-metric">
              <span className="metric-label">Safety Score</span>
              <div className="metric-value">{safetyScore}%</div>
              <span className="metric-sub">Higher = stronger shield</span>
            </div>
            <div className="hero-metric">
              <span className="metric-label">Live Tracking</span>
              <div className="metric-value">
                {isSharing
                  ? <><Wifi className="w-4 h-4" style={{ color: "#34d399" }} /><span>Active</span></>
                  : <><WifiOff className="w-4 h-4" style={{ color: "rgba(255,255,255,0.45)" }} /><span>Paused</span></>
                }
              </div>
              <span className="metric-sub">Tap Share to update guardians</span>
            </div>
          </motion.div>
          <AnimatePresence mode="wait">
            {sosCountdown > 0 ? (
              <motion.div key="countdown" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-5"
              >
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 192 192">
                    <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(239,68,68,0.12)" strokeWidth="8" />
                    <motion.circle cx="96" cy="96" r="88" fill="none" stroke="#ef4444" strokeWidth="8"
                      strokeLinecap="round" strokeDasharray="553"
                      initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: 553 }}
                      transition={{ duration: 5, ease: 'linear' }}
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-6xl font-black leading-none" style={{ color: '#f87171' }}>{sosCountdown}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: 'rgba(248,113,113,0.70)' }}>Sending</span>
                  </div>
                </div>
                <button onClick={cancelSOS} className="btn-secondary flex items-center gap-2 !px-8">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </motion.div>
            ) : (
              <motion.div key="sos-btn" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="relative flex items-center justify-center"
              >
                {/* Outer pulse rings */}
                {[56, 48, 40].map((size, i) => (
                  <motion.div key={i}
                    className="absolute rounded-full"
                    style={{ width: `${size * 4}px`, height: `${size * 4}px`, border: '1px solid rgba(239,68,68,0.20)' }}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.3 }}
                  />
                ))}
                <motion.button
                  onTouchStart={handleSOSPressStart} onTouchEnd={handleSOSPressEnd}
                  onMouseDown={handleSOSPressStart} onMouseUp={handleSOSPressEnd} onMouseLeave={handleSOSPressEnd}
                  whileTap={{ scale: 0.93 }}
                  animate={{ boxShadow: isSOSPressed ? '0 0 60px rgba(239,68,68,0.8), 0 0 120px rgba(239,68,68,0.3)' : '0 0 32px rgba(239,68,68,0.45), 0 0 64px rgba(239,68,68,0.15)' }}
                  className="relative w-44 h-44 rounded-full flex flex-col items-center justify-center select-none z-10"
                  style={{ background: 'radial-gradient(circle at 35% 35%, #f87171, #ef4444 50%, #b91c1c)' }}
                >
                  <span className="text-white text-4xl font-black tracking-wider">SOS</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>Hold to send</span>
                  {isSOSPressed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{ background: 'rgba(239,68,68,0.70)' }}
                    >
                      <span className="text-white text-lg font-black">HOLD...</span>
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs font-bold uppercase tracking-widest"
            style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.72)' }}
          >
            Hold 0.5s · Alerts all guardians
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN SCROLL CONTENT
      ══════════════════════════════════════ */}
      <div className="px-4 pt-5 space-y-4 max-w-2xl mx-auto">

        {/* ── LIVE LOCATION CARD ── */}
        <div className="card !p-0 overflow-hidden">
          {/* Map */}
          <div className="relative h-[220px]">
            <Map center={pos ? [pos.lat, pos.lng] : null} markers={pos ? [{ lat: pos.lat, lng: pos.lng, color: '#EF4444' }] : []} />
            {/* Overlay pills */}
            <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-xl border shadow-lg pointer-events-auto"
                style={{
                  background: isDark ? 'rgba(10,0,8,0.80)' : 'rgba(255,255,255,0.90)',
                  borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(59,130,246,0.18)'
                }}>
                <div className="w-1.5 h-1.5 rounded-full"
                  style={{ background: isSharing ? '#34d399' : (isDark ? 'rgba(255,255,255,0.40)' : 'rgba(15,23,42,0.30)') }} />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-content">
                  {status || (isSharing ? 'Live' : 'Paused')}
                </span>
              </div>
              <button onClick={getOnce}
                className="p-2 rounded-xl backdrop-blur-xl border shadow-lg pointer-events-auto transition-all active:rotate-180 duration-500 hover:scale-105"
                style={{
                  background: isDark ? 'rgba(10,0,8,0.80)' : 'rgba(255,255,255,0.90)',
                  borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(59,130,246,0.18)',
                  color: isDark ? 'rgba(255,255,255,0.70)' : 'rgba(15,23,42,0.72)'
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Location footer */}
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-t"
            style={{
              background: isDark ? 'rgba(26,10,46,0.70)' : 'rgba(255,255,255,0.98)',
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.10)'
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: isSharing ? 'rgba(16,185,129,0.15)' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)') }}>
                <Navigation className="w-4 h-4"
                  style={{ color: isSharing ? '#34d399' : (isDark ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.72)') }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-primary-content">
                  {isSharing ? 'Sharing live location' : 'Location sharing off'}
                </p>
                <p className="text-[11px] mt-0.5 truncate text-muted-content">
                  {pos ? `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` : 'Detecting…'}
                </p>
              </div>
            </div>
            <button onClick={toggleSharing}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all shrink-0 ${
                isSharing ? '' : 'btn-primary !py-2 !px-4 !text-[11px]'
              }`}
              style={isSharing ? {
                background: 'rgba(16,185,129,0.15)',
                color: '#34d399',
                border: '1px solid rgba(16,185,129,0.30)'
              } : {}}
            >
              {isSharing ? <><WifiOff className="w-3.5 h-3.5" /> Stop</> : <><Wifi className="w-3.5 h-3.5" /> Share</>}
            </button>
          </div>
        </div>

        {/* ── QUICK ACTIONS ROW ── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { to: '/safe-route', icon: ShieldAlert, label: 'SafeZones', iconColor: '#1d4ed8',   darkBg: 'rgba(59,130,246,0.12)', lightBg: 'rgba(59,130,246,0.09)' },
            { to: '/fake-call',  icon: PhoneCall,   label: 'Fake Call',  iconColor: '#9d4edd',   darkBg: 'rgba(123,47,247,0.12)', lightBg: 'rgba(123,47,247,0.09)' },
            { to: '/contacts',   icon: Users,       label: 'Circle',     iconColor: '#fbbf24',   darkBg: 'rgba(245,166,35,0.14)', lightBg: 'rgba(245,166,35,0.12)' },
            { to: '/share',      icon: MapPin,      label: 'Share',      iconColor: '#34d399',   darkBg: 'rgba(16,185,129,0.12)', lightBg: 'rgba(16,185,129,0.09)' },
          ].map(({ to, icon: Icon, label, iconColor, darkBg, lightBg }) => (
            <Link key={to} to={to}
              className="action-card card !p-0 flex flex-col items-center gap-2 py-4 transition-all tap-feedback"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: isDark ? darkBg : lightBg }}>
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight text-center leading-tight px-1"
                style={{ color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.78)' }}>{label}</span>
            </Link>
          ))}
        </div>

        {/* ── WOMEN’S SAFETY & AWARENESS (India) ── */}
        <WomenSafetySection isDark={isDark} />

        {/* ── SAFETY CHECK-IN ── */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.12)' }}>
                <Clock className="w-4 h-4" style={{ color: '#1d4ed8' }} />
              </div>
              <div>
                <p className="section-heading">Safety Check-in</p>
                <p className="text-[10px] mt-0.5 text-muted-content">Auto-SOS when timer expires</p>
              </div>
            </div>
            {checkInActive && (
              <span className="px-2.5 py-1 text-[10px] font-black rounded-full border animate-pulse"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', borderColor: 'rgba(16,185,129,0.25)' }}>
                LIVE
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {checkInActive ? (
              <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-4"
              >
                <div className="flex-1 rounded-2xl p-4 text-center border"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)',
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(148,163,184,0.20)'
                  }}
                >
                  <div className="text-4xl font-black tabular-nums tracking-tighter text-primary-content">
                    {formatTime(checkInTime)}
                  </div>
                  <p className="text-[10px] mt-1 uppercase tracking-widest text-muted-content">remaining</p>
                </div>
                <button onClick={cancelCheckIn}
                  className="flex flex-col items-center gap-1.5 px-5 py-4 rounded-2xl transition-all border"
                  style={{
                    background: isDark ? 'rgba(16,185,129,0.10)' : 'rgba(16,185,129,0.08)',
                    borderColor: isDark ? 'rgba(16,185,129,0.22)' : 'rgba(16,185,129,0.25)',
                    color: '#34d399'
                  }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">Safe</span>
                </button>
              </motion.div>
            ) : (
              <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-3 gap-2"
              >
                {[15, 30, 60].map(mins => (
                  <button key={mins} onClick={() => startCheckIn(mins)}
                    className="flex flex-col items-center gap-1 py-3.5 rounded-2xl border transition-all tap-feedback"
                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.12)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.40)'
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.05)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.12)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <span className="text-2xl font-black text-primary-content">{mins}</span>
                    <span className="text-[10px] font-bold uppercase text-muted-content">min</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── AI ASSISTANT ── */}
        <ChatAssistant onShare={() => !isSharing && toggleSharing()} onSOS={startSOSCountdown} isDark={isDark} />

        {/* ── EMERGENCY HELPLINES ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="section-heading">Emergency Helplines</p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-content">One tap</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {HELPLINES.map(({ num, label, icon: Icon, from, to }) => (
              <button key={num} onClick={() => window.open(`tel:${num}`)}
                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                className="flex items-center gap-3 p-3.5 rounded-2xl text-white hover:scale-[1.02] active:scale-[0.97] transition-all shadow-lg"
              >
                <Icon className="w-5 h-5 shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-black text-sm leading-none">{num}</div>
                  <div className="text-[10px] mt-0.5 truncate" style={{ opacity: 0.80 }}>{label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── SAFETY TIP ── */}
        <div className="relative overflow-hidden rounded-2xl p-5 border glass-card"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #1a0a2e 0%, #110014 100%)'
              : 'linear-gradient(135deg, #eff6ff 0%, #eef4ff 100%)',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.15)'
          }}
        >
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: isDark ? 'rgba(245,166,35,0.15)' : 'rgba(245,166,35,0.18)' }}>
              <Zap className="w-4 h-4" style={{ color: '#fbbf24' }} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest mb-1 block"
                style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.72)' }}>Safety Tip</span>
              <p className="text-sm font-semibold leading-relaxed"
                style={{ color: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.88)' }}>
                Always share your ride details with a trusted contact before entering a taxi or cab.
              </p>
            </div>
          </div>
          <Lock className="absolute -bottom-3 -right-3 w-20 h-20 rotate-12"
            style={{ color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.08)' }} />
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] pb-2 text-faint-content">
          Rakshika v2.0
        </p>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM NAV
      ══════════════════════════════════════ */}
      <div className="fixed bottom-3 left-3 right-3 z-50">
        <nav className="nav-bar">
          {[
            { to: '/',           icon: Home,       label: 'Home',     active: true  },
            { to: '/contacts',   icon: Users,      label: 'Circle',   active: false },
            { to: '/safe-route', icon: ShieldAlert,label: 'Zones',    active: false },
            { to: '/fake-call',  icon: PhoneCall,  label: 'FakeCall', active: false },
          ].map(({ to, icon: Icon, label, active }) => (
            <Link key={to} to={to} className={`nav-item ${active ? 'active' : ''}`}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold">{label}</span>
                {active && <div className="w-4 h-0.5 rounded-full mt-0.5" style={{ background: '#2563eb' }} />}
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>

      {/* ══════════════════════════════════════
          ERROR TOAST
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {showError && error && (
          <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            className="fixed top-4 left-4 right-4 text-white px-4 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 z-[300] border"
            style={{ background: '#ef4444', borderColor: 'rgba(239,68,68,0.40)' }}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="text-sm font-semibold leading-snug">
                {error.toLowerCase().includes('denied')
                  ? 'Location blocked — allow it in browser settings to use safety features.'
                  : error}
              </span>
            </div>
            <button onClick={() => setShowError(false)} className="p-1 rounded-lg transition-colors hover:bg-white/15 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
