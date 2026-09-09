import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { userService } from '@/services/userService'
import type { User } from '@/types/user'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'deskline_session_user_id'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY)
    if (!storedId) {
      setIsLoading(false)
      return
    }
    userService
      .getById(storedId)
      .then(setUser)
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const found = await userService.findByEmail(email)
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password.')
    }
    if (found.status === 'inactive') {
      throw new Error('This account has been deactivated. Contact your administrator.')
    }
    localStorage.setItem(STORAGE_KEY, found.id)
    setUser(found)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
