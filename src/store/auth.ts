import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: { name: string; email: string } | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const MOCK_CREDENTIALS = [
  { email: 'admin@test.com', password: 'admin123', name: 'Admin' },
  { email: 'admin@sys.com', password: '123123', name: 'System Admin' },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email, password) => {
        const match = MOCK_CREDENTIALS.find(c => c.email === email && c.password === password)
        if (match) {
          set({ isAuthenticated: true, user: { name: match.name, email: match.email } })
          return true
        }
        return false
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: 'rawal-auth' }
  )
)
