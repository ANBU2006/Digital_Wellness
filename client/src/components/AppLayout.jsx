import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

const AppLayout = () => {
  const navigate = useNavigate()
  const { token } = useAuthStore()

  useEffect(() => {
    if (!token) navigate('/login')
  }, [token, navigate])

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Topbar />
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
