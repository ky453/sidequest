import { useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    main.current?.focus({ preventScroll: true })
  }, [pathname])
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <main ref={main} id="main-content" tabIndex={-1}><Outlet /></main>
      <BottomNav />
    </div>
  )
}
