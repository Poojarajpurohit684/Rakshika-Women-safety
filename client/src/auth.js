const KEY = 'rakshika_token'
const USER_KEY = 'rakshika_user'

export function getToken() {
  return localStorage.getItem(KEY)
}
export function setToken(t) {
  localStorage.setItem(KEY, t)
}
export function clearToken() {
  localStorage.removeItem(KEY)
  localStorage.removeItem(USER_KEY)
}

export function getUser() {
  const u = localStorage.getItem(USER_KEY)
  return u ? JSON.parse(u) : null
}
export function setUser(u) {
  localStorage.setItem(USER_KEY, JSON.stringify(u))
}

export function apiBase() {
  return import.meta.env.VITE_API_BASE || 'http://localhost:5000'
}
