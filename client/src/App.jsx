import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analytics from './pages/Analytics.jsx'
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'
import { useAuthStore } from './store/useAuthStore.js'

const AuthGuard = ({ children }) => {
  const token = useAuthStore((state) => state.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

const App = () => {
  useEffect(() => {
    const stored = localStorage.getItem('dw-theme') || 'light'
    document.documentElement.setAttribute('data-theme', stored)
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <AuthGuard>
            <AppLayout />
          </AuthGuard>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
