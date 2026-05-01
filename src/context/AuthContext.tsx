import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'
import { authService, seedIfEmpty, usersService } from '@/services/localStorage'

interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    seedIfEmpty()
    const session = authService.getSession()
    if (session) {
      const users = usersService.getAll()
      const user = users.find((u) => u.email === session.email)
      if (user) setCurrentUser(user)
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    const user = authService.login(email, password)
    if (user) {
      setCurrentUser(user)
      authService.setSession({ email: user.email, role: user.role })
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentUser(null)
    authService.clearSession()
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
