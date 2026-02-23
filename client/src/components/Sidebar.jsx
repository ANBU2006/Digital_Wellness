import { NavLink } from 'react-router-dom'
import {
  FiActivity,
  FiBarChart2,
  FiClock,
  FiSettings
} from 'react-icons/fi'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <FiActivity />
        <span>Digital Wellness</span>
      </div>
      <nav>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/dashboard">
          <FiClock /> Dashboard
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/analytics">
          <FiBarChart2 /> Analytics
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/history">
          <FiActivity /> History
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/settings">
          <FiSettings /> Goals
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
