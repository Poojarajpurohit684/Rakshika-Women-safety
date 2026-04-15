import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Users, MapPin, X, ChevronRight, Zap } from 'lucide-react'

const STEPS = [
  {
    icon: Zap,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    title: 'One-Tap SOS',
    desc: 'Hold the red SOS button for 0.5s to start a 5-second countdown. Your GPS location is sent to all trusted contacts instantly via SMS.',
    tip: 'Practice it now so you know how it works in an emergency.'
  },
  {
    icon: Users,
    color: '#e91e8c',
    gradient: 'linear-gradient(135deg, #e91e8c, #7b2ff7)',
    title: 'Add Trusted Contacts',
    desc: 'Go to Circle and add family or friends. They\'ll receive your SOS alerts with a live tracking link — no app needed on their end.',
    tip: 'Add at least 2 contacts for reliable emergency coverage.'
  },
  {
    icon: MapPin,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    title: 'Find Safe Zones',
    desc: 'The SafeZones tab shows nearby police stations, hospitals, and bus stops within 2 km. Tap any result to get directions instantly.',
    tip: 'Check your area now so you know where to go before you need it.'
  },
]

export default function OnboardingTour({ onDone }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const Icon = current.icon

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else onDone()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-end justify-center pb-8 px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-sm rounded-3xl overflow-hidden"
          style={{ background: '#110014', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {/* Top gradient bar */}
          <div className="h-1.5 w-full" style={{ background: current.gradient }} />

          <div className="p-6">
            {/* Step indicators */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div key={i} className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? '24px' : '8px',
                      background: i <= step ? current.color : 'rgba(255,255,255,0.15)'
                    }} />
                ))}
              </div>
              <button onClick={onDone}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
              style={{ background: current.gradient, boxShadow: `0 8px 24px ${current.color}40` }}>
              <Icon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h2 className="text-xl font-black text-white mb-2">{current.title}</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.70)' }}>
              {current.desc}
            </p>

            {/* Tip */}
            <div className="rounded-xl p-3 mb-6"
              style={{ background: `${current.color}15`, border: `1px solid ${current.color}25` }}>
              <p className="text-xs font-semibold" style={{ color: current.color }}>
                💡 {current.tip}
              </p>
            </div>

            {/* Button */}
            <button onClick={next}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
              style={{ background: current.gradient, boxShadow: `0 4px 16px ${current.color}40` }}
            >
              {step < STEPS.length - 1 ? (
                <><span>Next</span><ChevronRight className="w-4 h-4" /></>
              ) : (
                <><Shield className="w-4 h-4" /><span>I'm Ready</span></>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
