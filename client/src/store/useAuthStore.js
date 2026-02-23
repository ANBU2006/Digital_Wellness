import { create } from 'zustand'

const stored = JSON.parse(localStorage.getItem('dw-auth') || '{}')

export const useAuthStore = create((set) => ({
  token: stored.token || null,
  user: stored.user || null,
  setAuth: (payload) => {
    localStorage.setItem('dw-auth', JSON.stringify(payload))
    set({ token: payload.token, user: payload.user })
  },
  logout: () => {
    localStorage.removeItem('dw-auth')
    set({ token: null, user: null })
  },
}))
