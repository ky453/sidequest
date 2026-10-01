import { CalendarDays, Heart, Search, UserRound } from 'lucide-react'
import { NavLink, useMatch } from 'react-router-dom'

export function BottomNav() {
  const isActivity = useMatch('/activities/:experienceId') !== null
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <NavLink to="/discover" className={({ isActive }) => `nav-item${isActive || isActivity ? ' nav-item--active' : ''}`}>
        <Search size={21} aria-hidden="true" /><span>Discover</span>
      </NavLink>
      <button className="nav-item" disabled title="Plans is coming later"><CalendarDays size={21} aria-hidden="true" /><span>Plans</span></button>
      <button className="nav-item" disabled title="Memories is coming later"><Heart size={21} aria-hidden="true" /><span>Memories</span></button>
      <button className="nav-item" disabled title="Profile is coming later"><UserRound size={21} aria-hidden="true" /><span>Profile</span></button>
    </nav>
  )
}
