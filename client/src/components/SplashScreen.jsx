import { motion, AnimatePresence } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function SplashScreen({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(160deg, #0a0008 0%, #110014 60%, #1a0028 100%)' }}
        >
          {/* Background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[80px]"
              style={{ background: 'rgba(233,30,140,0.20)' }} />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px]"
              style={{ background: 'rgba(123,47,247,0.20)' }} />
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {/* Pulse rings */}
            {[1, 2, 3].map(i => (
              <motion.div key={i}
                className="absolute rounded-full border"
                style={{ borderColor: 'rgba(233,30,140,0.15)', width: `${i * 80}px`, height: `${i * 80}px` }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}

            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl z-10"
              style={{
                background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)',
                boxShadow: '0 0 60px rgba(233,30,140,0.50), 0 20px 40px rgba(0,0,0,0.4)'
              }}
            >
              <Shield className="w-12 h-12 text-white" />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center z-10"
            >
              <h1 className="text-4xl font-black tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #e91e8c, #ff4da6, #9d4edd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                Rakshika
              </h1>
              <p className="text-sm font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Your Personal Safety Shield
              </p>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-2 mt-2 z-10"
            >
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#e91e8c' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
