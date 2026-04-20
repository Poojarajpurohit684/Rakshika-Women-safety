import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TrustedContacts from './pages/TrustedContacts.jsx'
import FakeCall from './pages/FakeCall.jsx'
import SafeRoute from './pages/SafeRoute.jsx'
import Share from './pages/Share.jsx'
import Awareness from './pages/Awareness.jsx'
import { useEffect, useState, useContext } from 'react'
import { getToken, setToken, getUser, setUser } from './auth'
import { AuthContext } from './AuthContext'

function AppRoutes() {
  const { auth } = useContext(AuthContext)
  const location = useLocation()
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contacts" element={auth ? <TrustedContacts /> : <Navigate to="/login" />} />
      <Route path="/fake-call" element={auth ? <FakeCall /> : <Navigate to="/login" />} />
      <Route path="/safe-route" element={auth ? <SafeRoute /> : <Navigate to="/login" />} />
      <Route path="/share/:userId" element={<Share />} />
      <Route path="/awareness" element={auth ? <Awareness /> : <Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  const [auth, setAuth] = useState(() => {
    const t = getToken()
    const u = getUser()
    return t ? { token: t, user: u } : null
  })

  useEffect(() => {
    if (auth?.token) {
      setToken(auth.token)
      if (auth.user) setUser(auth.user)
    }
  }, [auth])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <AppRoutes />
    </AuthContext.Provider>
  )
}

export default App
