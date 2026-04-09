import { motion } from 'framer-motion'

/** Compact SVG scenes — mobile-first, no external assets */

export function IllustrationAware() {
  return (
    <svg viewBox="0 0 280 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="aware-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="100%" stopColor="#0a0008" />
        </linearGradient>
        <radialGradient id="aware-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,248,220,0.35)" />
          <stop offset="100%" stopColor="rgba(255,248,220,0)" />
        </radialGradient>
      </defs>
      <rect width="280" height="200" fill="url(#aware-sky)" />
      <circle cx="220" cy="48" r="28" fill="url(#aware-moon)" />
      <motion.path
        d="M40 160 L120 120 L200 140 L260 130"
        fill="none"
        stroke="rgba(123,47,247,0.35)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      {/* Street */}
      <ellipse cx="140" cy="175" rx="100" ry="12" fill="rgba(0,0,0,0.35)" />
      {/* Woman */}
      <g transform="translate(118, 108)">
        <motion.circle
          cx="22"
          cy="12"
          r="10"
          fill="rgba(255,230,250,0.95)"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path
          d="M22 22 L22 52 M12 32 L32 32 M16 52 L12 68 M28 52 L32 68"
          stroke="rgba(233,30,140,0.9)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      {/* Alert eye — floating */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="56" cy="56" r="22" fill="rgba(233,30,140,0.15)" stroke="rgba(233,30,140,0.45)" strokeWidth="1.5" />
        <ellipse cx="56" cy="56" rx="10" ry="7" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
        <circle cx="58" cy="56" r="3" fill="#fff" />
      </motion.g>
    </svg>
  )
}

export function IllustrationLocation() {
  return (
    <svg viewBox="0 0 280 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="map-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1030" />
          <stop offset="100%" stopColor="#0a0008" />
        </linearGradient>
      </defs>
      <rect width="280" height="200" rx="16" fill="url(#map-bg)" />
      {/* Grid */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`g-${i}`}
          x1={40 + i * 50}
          y1="30"
          x2={20 + i * 55}
          y2="180"
          stroke="rgba(123,47,247,0.12)"
          strokeWidth="1"
        />
      ))}
      <path
        d="M50 140 Q100 80 160 100 T250 60"
        fill="none"
        stroke="rgba(233,30,140,0.25)"
        strokeWidth="2"
        strokeDasharray="6 8"
      />
      {/* Pin + ripples */}
      <g transform="translate(140, 95)">
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="0"
            cy="0"
            r={12 + i * 18}
            fill="none"
            stroke="rgba(233,30,140,0.45)"
            strokeWidth="1.5"
            initial={{ opacity: 0.6, scale: 0.6 }}
            animate={{ opacity: 0, scale: 1.4 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              delay: i * 0.55,
              ease: 'easeOut',
            }}
          />
        ))}
        <path
          d="M0 -8 C-10 -8 -14 2 -14 10 C-14 22 0 38 0 38 S14 22 14 10 C14 2 10 -8 0 -8Z"
          fill="#e91e8c"
          opacity="0.95"
        />
        <circle cx="0" cy="6" r="4" fill="#fff" />
      </g>
    </svg>
  )
}

export function IllustrationSOS() {
  return (
    <svg viewBox="0 0 280 200" className="h-full w-full" aria-hidden>
      <rect width="280" height="200" fill="#0a0008" />
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx="140"
          cy="100"
          r={40 + i * 28}
          fill="none"
          stroke="rgba(239,68,68,0.35)"
          strokeWidth="2"
          initial={{ opacity: 0.8, scale: 0.85 }}
          animate={{ opacity: 0, scale: 1.15 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.45,
            ease: 'easeOut',
          }}
        />
      ))}
      <motion.rect
        x="95"
        y="70"
        width="90"
        height="90"
        rx="22"
        fill="url(#sos-grad)"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="2"
        animate={{
          filter: [
            'drop-shadow(0 0 12px rgba(239,68,68,0.6))',
            'drop-shadow(0 0 28px rgba(233,30,140,0.85))',
            'drop-shadow(0 0 12px rgba(239,68,68,0.6))',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <defs>
        <linearGradient id="sos-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <text
        x="140"
        y="128"
        textAnchor="middle"
        fill="#fff"
        fontSize="22"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.15em"
      >
        SOS
      </text>
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '140px 100px' }}
      >
        <path
          d="M140 40 L140 55"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.g>
    </svg>
  )
}

export function IllustrationPhone() {
  return (
    <svg viewBox="0 0 280 200" className="h-full w-full" aria-hidden>
      <rect width="280" height="200" fill="#0f0618" />
      <motion.g
        animate={{ x: [0, 2, -2, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
      >
        <rect x="88" y="32" width="104" height="168" rx="20" fill="#1a0a2e" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <rect x="96" y="44" width="88" height="120" rx="8" fill="rgba(10,0,8,0.85)" />
        <text x="140" y="95" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="13" fontWeight="600" fontFamily="system-ui">
          Incoming call
        </text>
        <text x="140" y="118" textAnchor="middle" fill="rgba(233,30,140,0.95)" fontSize="18" fontWeight="700" fontFamily="system-ui">
          Rakshika
        </text>
        <circle cx="110" cy="152" r="18" fill="rgba(34,197,94,0.9)" />
        <circle cx="170" cy="152" r="18" fill="rgba(239,68,68,0.85)" />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`ring-${i}`}
          cx="140"
          cy="100"
          r={55 + i * 22}
          fill="none"
          stroke="rgba(233,30,140,0.25)"
          strokeWidth="1.5"
          initial={{ opacity: 0.5, scale: 0.92 }}
          animate={{ opacity: 0, scale: 1.1 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeOut',
          }}
        />
      ))}
    </svg>
  )
}

export function IllustrationCommunity() {
  const particles = [
    { x: 40, y: 50, d: 0 },
    { x: 220, y: 44, d: 0.3 },
    { x: 180, y: 140, d: 0.6 },
    { x: 70, y: 150, d: 0.9 },
    { x: 130, y: 30, d: 1.2 },
  ]
  return (
    <svg viewBox="0 0 280 200" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="comm-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(123,47,247,0.35)" />
          <stop offset="100%" stopColor="rgba(10,0,8,0)" />
        </radialGradient>
      </defs>
      <rect width="280" height="200" fill="#0a0008" />
      <ellipse cx="140" cy="90" rx="120" ry="70" fill="url(#comm-glow)" />
      {/* Figures */}
      <g opacity="0.95">
        <ellipse cx="100" cy="118" rx="18" ry="8" fill="rgba(0,0,0,0.25)" />
        <circle cx="100" cy="88" r="14" fill="rgba(255,230,250,0.95)" />
        <path d="M100 102 L100 118 M88 108 L112 108" stroke="rgba(233,30,140,0.85)" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="140" cy="122" rx="22" ry="9" fill="rgba(0,0,0,0.28)" />
        <circle cx="140" cy="86" r="16" fill="rgba(255,230,250,0.98)" />
        <path d="M140 102 L140 122 M124 112 L156 112 M132 122 L128 138 M148 122 L152 138" stroke="#7b2ff7" strokeWidth="2.8" strokeLinecap="round" />
        <ellipse cx="182" cy="118" rx="18" ry="8" fill="rgba(0,0,0,0.25)" />
        <circle cx="182" cy="88" r="14" fill="rgba(255,230,250,0.95)" />
        <path d="M182 102 L182 118" stroke="rgba(233,30,140,0.75)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="rgba(233,30,140,0.65)"
          animate={{ y: [p.y, p.y - 14, p.y], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: p.d, ease: 'easeInOut' }}
        />
      ))}
      <motion.path
        d="M60 160 Q140 120 220 160"
        fill="none"
        stroke="rgba(123,47,247,0.25)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0.3 }}
        animate={{ pathLength: [0.3, 1, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export function StoryIllustration({ variant }) {
  switch (variant) {
    case 'breathing':
      return <IllustrationAware />
    case 'gps':
      return <IllustrationLocation />
    case 'sos':
      return <IllustrationSOS />
    case 'phone':
      return <IllustrationPhone />
    case 'particles':
      return <IllustrationCommunity />
    default:
      return <IllustrationAware />
  }
}
