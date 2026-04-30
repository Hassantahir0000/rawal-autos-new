import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/api'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: { name: string; email: string } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,

      login: async (email, password) => {
        const res = await api.login(email, password)
        if (res.token) {
          set({
            isAuthenticated: true,
            token: res.token,
            user: res.user
              ? { name: res.user.name, email: res.user.email }
              : { name: 'Admin', email },
          })
          return true
        }
        return false
      },

      logout: () => set({ isAuthenticated: false, token: null, user: null }),
    }),
    { name: 'rawal-auth' }
  )
)
