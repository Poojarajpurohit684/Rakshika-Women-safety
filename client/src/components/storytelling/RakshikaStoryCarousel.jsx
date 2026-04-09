import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion'
import { STORY_CARDS } from './storyData.js'
import { StoryCard } from './StoryCard.jsx'

const GAP = 16

function triggerHaptic(pattern = 12) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern)
    } catch {
      /* ignore */
    }
  }
}

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.055] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }}
      aria-hidden
    />
  )
}

/**
 * Premium mobile-first storytelling carousel for Rakshika.
 *
 * @param {object} props
 * @param {() => void} [props.onComplete] — primary CTA ("Got it")
 * @param {() => void} [props.onLearnMore] — secondary CTA
 * @param {string} [props.className]
 * @param {boolean} [props.showBrand=true] — show Rakshika title row
 */
export function RakshikaStoryCarousel({
  onComplete,
  onLearnMore,
  className = '',
  showBrand = true,
}) {
  const reduce = useReducedMotion()
  const containerRef = useRef(null)
  const [cw, setCw] = useState(360)
  const [active, setActive] = useState(0)
  const x = useMotionValue(0)

  const cardW = Math.min(cw * 0.82, 320)
  const pad = Math.max(0, (cw - cardW) / 2)
  const step = cardW + GAP
  const maxOffset = -(STORY_CARDS.length - 1) * step

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setCw(w)
    })
    ro.observe(el)
    setCw(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])

  const lastStepRef = useRef(null)
  /** Re-align x only when slide width (step) changes — avoids cancelling spring snaps on active change */
  useEffect(() => {
    if (lastStepRef.current === null) {
      lastStepRef.current = step
      x.set(-active * step)
      return
    }
    if (lastStepRef.current !== step) {
      lastStepRef.current = step
      x.set(-active * step)
    }
  }, [step, active, x])

  const snapTo = useCallback(
    (index) => {
      const i = Math.max(0, Math.min(STORY_CARDS.length - 1, index))
      setActive(i)
      animate(x, -i * step, {
        type: 'spring',
        stiffness: 400,
        damping: 38,
        mass: 0.85,
      })
      triggerHaptic(10)
    },
    [step, x]
  )

  const current = STORY_CARDS[active]

  const handleDragEnd = (_, info) => {
    const projected = x.get() + info.velocity.x * 0.2
    let next = Math.round(-projected / step)
    next = Math.max(0, Math.min(STORY_CARDS.length - 1, next))
    snapTo(next)
  }

  return (
    <section
      data-rakshika-story
      className={`relative isolate min-h-[100dvh] w-full overflow-hidden ${className}`}
      style={{
        backgroundColor: '#0a0008',
        color: 'rgba(248, 250, 252, 0.96)',
      }}
      aria-roledescription="carousel"
      aria-label="Rakshika safety tips"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          snapTo(active - 1)
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          snapTo(active + 1)
        }
      }}
    >
      {/* Premium top accent + mesh (explicit colors — not affected by body.dark text hacks) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-[#e91e8c]/70 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% -20%, rgba(233,30,140,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 90% 60% at 100% 30%, rgba(123,47,247,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 0% 70%, rgba(233,30,140,0.08) 0%, transparent 45%)
          `,
        }}
        aria-hidden
      />

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -left-1/4 top-0 h-[55vh] w-[90vw] rounded-full blur-[100px]"
          animate={
            reduce
              ? {}
              : {
                  background: [
                    `radial-gradient(circle, ${current.bgBlob} 0%, transparent 65%)`,
                    `radial-gradient(circle, rgba(123,47,247,0.2) 0%, transparent 65%)`,
                    `radial-gradient(circle, ${current.bgBlob} 0%, transparent 65%)`,
                  ],
                  x: [0, 12, 0],
                  y: [0, 8, 0],
                }
          }
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-1/4 bottom-0 h-[50vh] w-[85vw] rounded-full blur-[90px]"
          style={{
            background: `radial-gradient(circle, ${current.accentTo}33 0%, transparent 62%)`,
          }}
          animate={reduce ? {} : { opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0008] to-transparent"
          aria-hidden
        />
      </div>

      <GrainOverlay />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col px-4 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))]">
        {showBrand && (
          <motion.header
            className="mb-7 text-center"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[rgba(255,255,255,0.55)]">
              Welcome to
            </p>
            <h1 className="bg-gradient-to-r from-[#ff4da6] via-[#e91e8c] to-[#c4a5ff] bg-clip-text font-[system-ui] text-[1.65rem] font-extrabold leading-tight tracking-tight text-transparent drop-shadow-[0_0_24px_rgba(233,30,140,0.35)] sm:text-3xl">
              Rakshika
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[rgba(255,255,255,0.82)]">
              Safety, awareness, and help — in one place.
            </p>
          </motion.header>
        )}

        <motion.div
          ref={containerRef}
          className="relative w-full touch-pan-y"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        >
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            style={{
              x,
              paddingLeft: pad,
              paddingRight: pad,
              gap: GAP,
              willChange: 'transform',
            }}
            drag="x"
            dragElastic={0.08}
            dragConstraints={{ left: maxOffset, right: 0 }}
            onDragEnd={(e, info) => handleDragEnd(e, info)}
          >
            {STORY_CARDS.map((story, i) => (
              <StoryCard
                key={story.id}
                story={story}
                isActive={active === i}
                onTapFeedback={() => triggerHaptic(6)}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Progress dots */}
        <nav
          className="mt-8 flex items-center justify-center gap-2"
          aria-label="Slide indicators"
        >
          {STORY_CARDS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => snapTo(i)}
              className="rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e91e8c]"
              aria-label={`Go to slide ${i + 1}: ${s.title}`}
              aria-current={active === i ? 'true' : undefined}
            >
              <motion.span
                className="block rounded-full bg-white/25"
                animate={{
                  width: active === i ? 28 : 8,
                  height: 8,
                  backgroundColor:
                    active === i ? 'rgba(233,30,140,0.95)' : 'rgba(255,255,255,0.28)',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            </button>
          ))}
        </nav>

        {/* Haptic concept — visible only as helper text for devs / onboarding */}
        <p className="mt-3 text-center text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[rgba(255,255,255,0.38)]">
          Haptic-ready: light vibration on snap and tap when supported
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <motion.button
            type="button"
            className="min-h-[48px] w-full rounded-[22px] bg-gradient-to-r from-[#e91e8c] via-[#c4166f] to-[#7b2ff7] px-6 py-3.5 text-base font-bold text-[#ffffff] shadow-[0_12px_40px_rgba(233,30,140,0.5),0_0_0_1px_rgba(255,255,255,0.12)_inset] sm:w-auto"
            whileTap={{ scale: reduce ? 1 : 0.96 }}
            whileHover={reduce ? {} : { boxShadow: '0 16px 48px rgba(233,30,140,0.55)' }}
            onClick={() => {
              triggerHaptic([15, 8, 12])
              onComplete?.()
            }}
          >
            Got it
          </motion.button>
          <motion.button
            type="button"
            className="min-h-[48px] w-full rounded-[22px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.08)] px-6 py-3.5 text-base font-semibold text-[rgba(255,255,255,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:w-auto"
            whileTap={{ scale: reduce ? 1 : 0.97 }}
            onClick={() => {
              triggerHaptic(8)
              onLearnMore?.()
            }}
          >
            Learn more
          </motion.button>
        </div>
      </div>
    </section>
  )
}
