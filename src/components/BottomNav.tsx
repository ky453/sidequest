import { CalendarDays, Heart, Search, UserRound } from 'lucide-react'
import { NavLink, useMatch } from 'react-router-dom'

export function BottomNav() {
  const isActivity = useMatch('/activities/:experienceId') !== null
  const isAddMemory = useMatch('/memories/new') !== null
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <NavLink to="/discover" className={({ isActive }) => `nav-item${isActive || isActivity ? ' nav-item--active' : ''}`}>
        <Search size={21} aria-hidden="true" /><span>Discover</span>
      </NavLink>
      <NavLink to="/plans" className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}>
        <CalendarDays size={21} aria-hidden="true" /><span>Plans</span>
      </NavLink>
      <NavLink to="/memories" className={({ isActive }) => `nav-item${isActive || isAddMemory ? ' nav-item--active' : ''}`}><Heart size={21} aria-hidden="true" /><span>Memories</span></NavLink>
      <button className="nav-item" disabled title="Profile is coming later"><UserRound size={21} aria-hidden="true" /><span>Profile</span></button>
    </nav>
  )
}
