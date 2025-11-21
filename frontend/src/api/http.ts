import axios from 'axios'

import { TOKEN_STORAGE_KEY } from '../utils/constants'
import { storage } from '../utils/storage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export const http = axios.create({
  baseURL: API_BASE_URL,
})

http.interceptors.request.use((config) => {
  const token = storage.get(TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'))
    }

    return Promise.reject(error)
  },
)

