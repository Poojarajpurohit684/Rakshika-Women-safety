import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BatteryLow, X } from 'lucide-react'

export default function BatteryWarning() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!('getBattery' in navigator)) return
    navigator.getBattery().then(battery => {
      function check() {
        if (battery.level <= 0.20 && !battery.charging) {
          setShow(true); setDismissed(false)
        } else {
          setShow(false)
        }
      }
      check()
      battery.addEventListener('levelchange', check)
      battery.addEventListener('chargingchange', check)
    })
  }, [])

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed left-0 right-0 z-[350] px-4"
          style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
        >
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
            style={{ background: 'rgba(245,158,11,0.96)', backdropFilter: 'blur(12px)' }}>
            <BatteryLow className="w-4 h-4 text-white shrink-0" />
            <p className="text-xs font-bold text-white flex-1">
              Battery below 20% — share your location with your circle now.
            </p>
            <button onClick={() => setDismissed(true)}
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.20)' }}
              aria-label="Dismiss">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
