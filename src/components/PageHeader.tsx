import { Bell } from 'lucide-react'

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="page-header">
      <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
      <button type="button" className="notification-button" disabled aria-label="Notifications (coming later)" title="Notifications is coming later">
        <Bell size={18} aria-hidden="true" />
      </button>
    </header>
  )
}
