import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'
import { clearAccessToken, getAccessToken, setAccessToken } from '../../lib/auth'
import type { CurrentUser } from '../../types'

type AuthContextValue = {
  user: CurrentUser | null
  loading: boolean
  token: string | null
  login: (token: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAccessToken())
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async () => {
    const accessToken = getAccessToken()
    if (!accessToken) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const response = await api.get<CurrentUser>('/users/me')
      setUser(response.data)
      setToken(accessToken)
    } catch {
      clearAccessToken()
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUser()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      token,
      login: async (accessToken: string) => {
        setAccessToken(accessToken)
        setToken(accessToken)
        setLoading(true)
        await loadUser()
      },
      logout: () => {
        clearAccessToken()
        setToken(null)
        setUser(null)
      },
      refreshUser: async () => {
        setLoading(true)
        await loadUser()
      },
    }),
    [user, loading, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
