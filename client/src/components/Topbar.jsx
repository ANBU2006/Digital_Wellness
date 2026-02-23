import { FiLogOut } from 'react-icons/fi'
import { useAuthStore } from '../store/useAuthStore.js'

const Topbar = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="topbar">
      <h1>Welcome back, {user?.name?.split(' ')[0] || 'Student'}</h1>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="btn secondary" onClick={logout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  )
}

export default Topbar
