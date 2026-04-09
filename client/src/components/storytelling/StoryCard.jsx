import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import {
  Eye,
  MapPin,
  ShieldAlert,
  Phone,
  HeartHandshake,
} from 'lucide-react'
import { StoryIllustration } from './StoryIllustrations.jsx'

const ICONS = {
  breathing: Eye,
  gps: MapPin,
  sos: ShieldAlert,
  phone: Phone,
  particles: HeartHandshake,
}

function BreathingGlow({ reduced }) {
  if (reduced) return null
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      aria-hidden
      animate={{
        boxShadow: [
          'inset 0 0 40px rgba(233,30,140,0.12), 0 0 0 0 rgba(233,30,140,0)',
          'inset 0 0 60px rgba(123,47,247,0.18), 0 0 32px rgba(233,30,140,0.15)',
          'inset 0 0 40px rgba(233,30,140,0.12), 0 0 0 0 rgba(233,30,140,0)',
        ],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function StoryCard({ story, isActive, onTapFeedback }) {
  const reduce = useReducedMotion()
  const [burst, setBurst] = useState(false)
  const Icon = ICONS[story.variant] || Eye

  const px = useMotionValue(0)
  const smoothPx = useSpring(px, { stiffness: 320, damping: 28 })
  const bgX = useTransform(smoothPx, (v) => v * 0.35)
  const fgX = useTransform(smoothPx, (v) => v * -0.55)

  const handleMove = (clientX, rect) => {
    if (!rect || reduce) return
    const nx = (clientX - rect.left) / rect.width - 0.5
    px.set(nx * 24)
  }

  return (
    <motion.article
      role="group"
      aria-roledescription="slide"
      aria-label={`${story.title}. ${story.body}`}
      className="relative flex w-[min(82vw,320px)] shrink-0 flex-col overflow-hidden rounded-[26px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.07)] shadow-[0_28px_56px_-16px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.08)_inset,0_0_60px_-20px_rgba(233,30,140,0.25)] backdrop-blur-2xl"
      style={{ minHeight: 'min(58vh, 420px)', zIndex: isActive ? 2 : 1 }}
      animate={{
        scale: isActive ? 1.05 : 0.94,
        opacity: isActive ? 1 : 0.72,
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      onPointerMove={(e) => {
        if (!isActive) return
        handleMove(e.clientX, e.currentTarget.getBoundingClientRect())
      }}
      onPointerLeave={() => px.set(0)}
      whileTap={
        reduce
          ? undefined
          : {
              scale: 0.97,
              transition: { type: 'spring', stiffness: 500, damping: 28 },
            }
      }
      onPointerDown={() => {
        onTapFeedback?.()
        if (!reduce) {
          setBurst(true)
          window.setTimeout(() => setBurst(false), 380)
        }
      }}
    >
      {burst && !reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          initial={{ opacity: 0.55, scale: 0.92 }}
          animate={{ opacity: 0, scale: 1.35 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          style={{
            background:
              'radial-gradient(circle at 50% 35%, rgba(233,30,140,0.45) 0%, rgba(123,47,247,0.15) 45%, transparent 70%)',
          }}
          aria-hidden
        />
      )}
      {!reduce && story.variant === 'breathing' && <BreathingGlow reduced={false} />}

      {/* Inner parallax layers */}
      <motion.div
        className="pointer-events-none absolute -inset-8 opacity-90"
        style={{ x: bgX }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: story.bgBlob }}
        />
      </motion.div>

      <div className="relative flex flex-1 flex-col p-5 pt-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[rgba(255,255,255,0.78)]">
            {story.microLabel}
          </p>
          <motion.div
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.1)] shadow-[0_8px_28px_rgba(233,30,140,0.35)]"
            animate={
              reduce
                ? {}
                : {
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      '0 8px 24px rgba(233,30,140,0.25)',
                      '0 10px 32px rgba(123,47,247,0.35)',
                      '0 8px 24px rgba(233,30,140,0.25)',
                    ],
                  }
            }
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon className="h-5 w-5 text-[#ff4da6]" strokeWidth={2.25} aria-hidden />
          </motion.div>
        </div>

        <motion.div
          className="relative mb-4 aspect-[5/3] w-full overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.1)] bg-[#0a0008]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          style={{ x: fgX }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0008]/92" />
          <div className="h-full w-full [&_svg]:max-h-full">
            <StoryIllustration variant={story.variant} />
          </div>
        </motion.div>

        <h3
          className="mb-2 font-[system-ui,-apple-system,sans-serif] text-[1.35rem] font-extrabold leading-tight tracking-tight text-[#fafafa]"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}
        >
          {story.title}
        </h3>
        <p className="text-[0.95rem] leading-relaxed text-[rgba(255,255,255,0.9)]">{story.body}</p>
      </div>

      {/* Edge gloss */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.35)] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-4 bottom-0 h-24 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(233,30,140,0.12)_0%,transparent_70%)] opacity-80"
        aria-hidden
      />
    </motion.article>
  )
}
