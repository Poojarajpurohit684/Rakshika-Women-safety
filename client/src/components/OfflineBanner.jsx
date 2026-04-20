import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi } from 'lucide-react'

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    function handleOffline() { setIsOffline(true); setShowBack(false) }
    function handleOnline() {
      setIsOffline(false)
      setShowBack(true)
      setTimeout(() => setShowBack(false), 3000)
    }
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  const visible = isOffline || showBack

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -48 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="fixed top-0 left-0 right-0 z-[400] flex justify-center px-4 pt-safe"
          style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
        >
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl"
            style={{
              background: isOffline ? 'rgba(239,68,68,0.96)' : 'rgba(16,185,129,0.96)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isOffline ? 'rgba(239,68,68,0.40)' : 'rgba(16,185,129,0.40)'}`,
            }}>
            {isOffline
              ? <WifiOff className="w-3.5 h-3.5 text-white shrink-0" />
              : <Wifi className="w-3.5 h-3.5 text-white shrink-0" />
            }
            <p className="text-xs font-bold text-white">
              {isOffline
                ? 'No internet — SOS alerts may not send'
                : 'Back online'
              }
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
