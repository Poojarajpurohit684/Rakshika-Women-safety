import { useContext, useState, useLayoutEffect } from 'react'
import { api } from '../api'
import { AuthContext } from '../AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Shield, ArrowRight, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useContext(AuthContext)
  const navigate = useNavigate()

  useLayoutEffect(() => {
    document.body.classList.add('dark')
    document.documentElement.style.backgroundColor = '#0a0008'
    return () => {
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      setAuth({ token: data.token, user: data.user })
      navigate('/awareness', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #110014 0%, #0a0008 45%, #0a0008 100%)' }}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: 'rgba(233,30,140,0.22)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: 'rgba(123,47,247,0.22)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px]"
          style={{ background: 'rgba(245,166,35,0.06)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.7, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)',
              boxShadow: '0 8px 24px rgba(233,30,140,0.35)',
            }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight leading-none mb-1">
            <span className="text-primary-content">Join </span><span className="text-gradient">Rakshika</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mt-2 text-muted-content">
            Build your safety shield
          </p>
        </div>

        <div className="glass-card !rounded-[1.75rem]">
          <h2 className="text-lg font-bold text-primary-content mb-6">Create your account</h2>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="register-name" className="block text-xs font-semibold uppercase tracking-wider text-muted-content">
                Full name
              </label>
              <div className="auth-field">
                <span className="auth-field__icon" aria-hidden>
                  <User className="w-5 h-5" strokeWidth={2} />
                </span>
                <input
                  id="register-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="auth-field__input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="register-email" className="block text-xs font-semibold uppercase tracking-wider text-muted-content">
                Email
              </label>
              <div className="auth-field">
                <span className="auth-field__icon" aria-hidden>
                  <Mail className="w-5 h-5" strokeWidth={2} />
                </span>
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="auth-field__input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="register-password" className="block text-xs font-semibold uppercase tracking-wider text-muted-content">
                Password
              </label>
              <div className="auth-field">
                <span className="auth-field__icon" aria-hidden>
                  <Lock className="w-5 h-5" strokeWidth={2} />
                </span>
                <input
                  id="register-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="auth-field__input"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="auth-field__action"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-[1.125rem] h-[1.125rem]" /> : <Eye className="w-[1.125rem] h-[1.125rem]" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold rounded-xl px-4 py-3"
                style={{
                  color: '#f87171',
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-1 !rounded-[1.1rem] !py-3.5">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
                </>
              ) : (
                <>
                  <span>Start Shielding</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-7 text-center space-y-4">
          <p className="text-sm text-secondary-content">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors" style={{ color: '#ff4da6' }}>
              Sign in
            </Link>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-faint-content">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: '#34d399' }} /> End-to-End Encrypted
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: '#34d399' }} /> 24/7 Protection
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
