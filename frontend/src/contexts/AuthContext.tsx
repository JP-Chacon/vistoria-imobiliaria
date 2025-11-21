import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'

import { login as loginRequest, getCurrentUser } from '../api/auth'
import type { User } from '../types'
import { TOKEN_STORAGE_KEY } from '../utils/constants'
import { storage } from '../utils/storage'

type AuthContextValue = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    storage.get(TOKEN_STORAGE_KEY),
  )
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    storage.remove(TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const refresh = useCallback(async () => {
    if (!token) return

    try {
      const profile = await getCurrentUser()
      setUser(profile)
    } catch (error: any) {
      // Se houver erro de autenticação (401), faz logout
      // Caso contrário, apenas não atualiza o usuário
      if (error?.response?.status === 401) {
        logout()
      }
    }
  }, [logout, token])

  const initialize = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const profile = await getCurrentUser()
      setUser(profile)
    } catch (error: any) {
      // Se a rota não existir (404) ou houver erro de autenticação (401), faz logout
      // Caso contrário, apenas não carrega o usuário mas mantém o token
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        logout()
      }
      // Se for outro erro, apenas não carrega o usuário mas mantém a sessão
    } finally {
      setLoading(false)
    }
  }, [logout, token])

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const handler = () => {
      toast.error('Sessão expirada, faça login novamente.')
      logout()
    }

    window.addEventListener('auth:unauthorized', handler)
    return () => window.removeEventListener('auth:unauthorized', handler)
  }, [logout])

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const response = await loginRequest({ email, password })
      storage.set(TOKEN_STORAGE_KEY, response.accessToken)
      setToken(response.accessToken)
      setUser(response.user)
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login: handleLogin,
      logout,
      refresh,
    }),
    [handleLogin, loading, logout, refresh, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
  }

  return context
}

