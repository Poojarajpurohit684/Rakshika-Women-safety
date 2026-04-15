import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BatteryLow, WifiOff, X } from 'lucide-react'

export default function BatteryWarning() {
  const [warning, setWarning] = useState(null) // 'battery' | 'offline' | null
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Network status
    function handleOffline() { setWarning('offline'); setDismissed(false) }
    function handleOnline() { if (warning === 'offline') setWarning(null) }
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    // Battery API
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        function checkBattery() {
          if (battery.level <= 0.20 && !battery.charging) {
            setWarning('battery'); setDismissed(false)
          } else if (warning === 'battery') {
            setWarning(null)
          }
        }
        checkBattery()
        battery.addEventListener('levelchange', checkBattery)
        battery.addEventListener('chargingchange', checkBattery)
      })
    }

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (dismissed || !warning) return null

  const isOffline = warning === 'offline'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-0 left-0 right-0 z-[300] px-4 pt-3"
      >
        <div className="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
          style={{
            background: isOffline ? 'rgba(239,68,68,0.95)' : 'rgba(245,158,11,0.95)',
            backdropFilter: 'blur(12px)'
          }}>
          {isOffline
            ? <WifiOff className="w-4 h-4 text-white shrink-0" />
            : <BatteryLow className="w-4 h-4 text-white shrink-0" />
          }
          <p className="text-xs font-bold text-white flex-1">
            {isOffline
              ? 'No internet — SOS alerts may not send. Move to a network area.'
              : 'Battery below 20% — consider sharing your location now.'
            }
          </p>
          <button onClick={() => setDismissed(true)}
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.20)' }}>
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
