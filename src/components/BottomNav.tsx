import { CalendarDays, Heart, Search, UserRound } from 'lucide-react'
import { Link, NavLink, useMatch } from 'react-router-dom'

export function BottomNav() {
  const isActivity = useMatch('/activities/:experienceId') !== null
  const isDiscover = useMatch('/discover') !== null || isActivity
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <Link to="/discover" aria-current={isDiscover ? 'page' : undefined} className={`nav-item${isDiscover ? ' nav-item--active' : ''}`}>
        <Search size={21} aria-hidden="true" /><span>Discover</span>
      </Link>
      <NavLink to="/plans" className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}>
        <CalendarDays size={21} aria-hidden="true" /><span>Plans</span>
      </NavLink>
      <NavLink to="/memories" className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}><Heart size={21} aria-hidden="true" /><span>Memories</span></NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}><UserRound size={21} aria-hidden="true" /><span>Profile</span></NavLink>
    </nav>
  )
}
