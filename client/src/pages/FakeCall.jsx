import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Phone, PhoneOff, User, Home, Users,
  ShieldAlert, PhoneCall as PhoneCallIcon,
  ArrowLeft, UserRound, PersonStanding, Clock
} from 'lucide-react'

export default function FakeCall() {
  const [incoming, setIncoming]   = useState(false)
  const [talking, setTalking]     = useState(false)
  const [timer, setTimer]         = useState(0)
  const [callerName, setCallerName] = useState('Papa')
  const [callerType, setCallerType] = useState('papa')
  const [delay, setDelay]         = useState(0)
  const [countdown, setCountdown] = useState(null)

  const interval  = useRef(null)
  const ringtone  = useRef(null)

  const callers = [
    { id: 'papa',  label: 'Papa',  icon: UserRound },
    { id: 'mummy', label: 'Mummy', icon: PersonStanding },
  ]

  const delays = [
    { value: 0,  label: 'Now' },
    { value: 10, label: '10s' },
    { value: 30, label: '30s' },
    { value: 60, label: '1m' },
  ]

  const scripts = {
    papa:  ['Beta main bahar hoon, 2 minute mein pahunch raha hoon.', 'Hello beta, main gate pe hoon. Jaldi aao.'],
    mummy: ['Beta main paas hoon, tension mat lo.', 'Phone pe raho, main aa rahi hoon.'],
  }

  function start() {
    if (delay > 0) {
      setCountdown(delay)
      const t = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(t); setCountdown(null); triggerCall(); return 0 }
          return prev - 1
        })
      }, 1000)
    } else {
      triggerCall()
    }
  }

  function triggerCall() {
    setIncoming(true)
    ringtone.current = new Audio('https://www.soundjay.com/phone/phone-calling-1.mp3')
    ringtone.current.loop = true
    ringtone.current.play().catch(() => {})
  }

  function answer() {
    setIncoming(false)
    setTalking(true)
    ringtone.current?.pause()
    interval.current = setInterval(() => setTimer(t => t + 1), 1000)
    const script = scripts[callerType][Math.floor(Math.random() * scripts[callerType].length)]
    if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(script)
      u.lang = 'hi-IN'
      window.speechSynthesis.speak(u)
    }
  }

  function end() {
    setIncoming(false); setTalking(false); setTimer(0); setCountdown(null)
    ringtone.current?.pause()
    clearInterval(interval.current)
    window.speechSynthesis?.cancel()
  }

  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  /* ── TALKING SCREEN ── */
  if (talking) return (
    <div className="fixed inset-0 flex flex-col items-center justify-between py-20 px-6"
      style={{ background: 'linear-gradient(180deg, #0a0008 0%, #110014 100%)' }}>
      <div className="text-center space-y-4 mt-8">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.20), rgba(123,47,247,0.20))', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <User className="w-12 h-12" style={{ color: 'rgba(255,255,255,0.65)' }} />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-white">{callerName}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#34d399' }} />
            <p className="text-sm font-semibold font-mono" style={{ color: '#34d399' }}>{fmt(timer)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 mb-4">
        <button
          onClick={end}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
          style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 8px 24px rgba(239,68,68,0.40)' }}
          aria-label="End call"
        >
          <PhoneOff className="text-white w-7 h-7" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>End Call</span>
      </div>
    </div>
  )

  /* ── INCOMING CALL SCREEN ── */
  if (incoming) return (
    <div className="fixed inset-0 flex flex-col items-center justify-between py-20 px-6"
      style={{ background: 'linear-gradient(180deg, #0a0008 0%, #110014 100%)' }}>
      <div className="text-center space-y-5 mt-8">
        <div className="relative flex items-center justify-center mx-auto w-32 h-32">
          <div className="absolute inset-0 rounded-full border-2 animate-ping"
            style={{ borderColor: 'rgba(233,30,140,0.25)' }} />
          <div className="absolute inset-3 rounded-full border"
            style={{ borderColor: 'rgba(233,30,140,0.35)', animation: 'pulseRing 1.8s ease-out infinite' }} />
          <div className="w-24 h-24 rounded-full flex items-center justify-center z-10"
            style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(123,47,247,0.15))', border: '1px solid rgba(255,255,255,0.10)' }}>
            <User className="w-12 h-12" style={{ color: 'rgba(255,255,255,0.65)' }} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{callerName}</h2>
          <p className="text-sm font-medium mt-1 animate-pulse" style={{ color: 'rgba(255,255,255,0.55)' }}>Incoming call</p>
        </div>
      </div>

      <div className="flex gap-20 mb-6">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={end}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 8px 24px rgba(239,68,68,0.35)' }}
            aria-label="Decline call"
          >
            <PhoneOff className="text-white w-7 h-7" />
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.50)' }}>Decline</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={answer}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.35)' }}
            aria-label="Accept call"
          >
            <Phone className="text-white w-7 h-7" />
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.50)' }}>Accept</span>
        </div>
      </div>
    </div>
  )

  /* ── MAIN UI ── */
  return (
    <div className="min-h-screen pb-28">

      {/* Header */}
      <header className="page-header">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors text-muted-content hover:text-primary-content"
            style={{ background: 'rgba(233,30,140,0.07)', border: '1px solid rgba(233,30,140,0.14)' }}
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-primary-content">Fake Call</h1>
            <p className="text-xs font-medium text-muted-content">Trigger a decoy call to escape</p>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-5 max-w-sm mx-auto space-y-5 mt-5">

        {/* Caller selection */}
        <div className="glass-card space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-content">Who's calling?</p>
          <div className="grid grid-cols-2 gap-2.5">
            {callers.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setCallerType(id); setCallerName(label) }}
                className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={callerType === id
                  ? { background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', color: '#ffffff', border: 'none', boxShadow: '0 4px 16px rgba(233,30,140,0.30)' }
                  : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(233,30,140,0.14)', color: 'rgba(255,255,255,0.75)' }
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Delay selection */}
        <div className="glass-card space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-content">Call delay</p>
          <div className="grid grid-cols-4 gap-2">
            {delays.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setDelay(value)}
                className="py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={delay === value
                  ? { background: 'rgba(233,30,140,0.15)', color: '#ff4da6', border: '1px solid rgba(233,30,140,0.35)' }
                  : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(233,30,140,0.12)', color: 'rgba(255,255,255,0.70)' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger button */}
        <button onClick={start} className="btn-primary w-full py-4 text-base">
          <Phone className="w-5 h-5" />
          {countdown !== null ? (
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Calling in {countdown}s...
            </span>
          ) : (
            'Trigger Fake Call'
          )}
        </button>

        {/* Info note */}
        <p className="text-center text-xs font-medium px-4 text-muted-content">
          A realistic incoming call will appear on your screen. Answer to hear a voice message.
        </p>
      </div>

      {/* Navbar */}
      <nav className="nav-bar" role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-item"><Home className="w-5 h-5" /><span>Home</span></Link>
        <Link to="/contacts" className="nav-item"><Users className="w-5 h-5" /><span>Circle</span></Link>
        <Link to="/safe-route" className="nav-item"><ShieldAlert className="w-5 h-5" /><span>SafeZones</span></Link>
        <Link to="/fake-call" className="nav-item active"><PhoneCallIcon className="w-5 h-5" /><span>FakeCall</span></Link>
      </nav>
    </div>
  )
}
