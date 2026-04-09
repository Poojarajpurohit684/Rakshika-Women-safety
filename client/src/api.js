import axios from 'axios'
import { apiBase, getToken } from './auth'

export const api = axios.create({
  baseURL: apiBase(),
})

api.interceptors.request.use((config) => {
  const t = getToken()
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rakshika_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

