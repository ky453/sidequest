import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import { calendarDate, calendarMonthDays, dateKey, formatPlanDate, moveCalendarMonth } from '../lib/plans'
import type { Plan } from '../types'

export function MonthlyCalendar({ selectedDate, today, plans, onSelect, onLongPress }: {
  selectedDate: string
  today: string
  plans: Plan[]
  onSelect: (date: string) => void
  onLongPress: (date: string) => void
}) {
  const press = useRef<{ timer?: number; x: number; y: number; triggered: boolean } | null>(null)
  function cancelPress() {
    if (press.current?.timer !== undefined) window.clearTimeout(press.current.timer)
  }
  useEffect(() => () => { if (press.current?.timer !== undefined) window.clearTimeout(press.current.timer) }, [])

  function startPress(event: PointerEvent<HTMLButtonElement>, key: string) {
    if (event.button !== 0 || !event.isPrimary) return
    cancelPress()
    const current = { x: event.clientX, y: event.clientY, triggered: false, timer: undefined as number | undefined }
    press.current = current
    current.timer = window.setTimeout(() => {
      current.triggered = true
      onLongPress(key)
    }, 600)
  }
  const selected = calendarDate(selectedDate)
  const days = calendarMonthDays(selectedDate)
  const scheduledDates = new Set(plans.filter((plan) => plan.status === 'planned').map((plan) => plan.plannedDate))

  function moveMonth(offset: number) {
    cancelPress()
    onSelect(moveCalendarMonth(selectedDate, offset))
  }

  return (
    <section className="plans-calendar" aria-label="Plan calendar">
      <div className="calendar-heading">
        <h2>{formatPlanDate(selectedDate, { month: 'long', year: 'numeric' })}</h2>
        <div className="calendar-navigation">
          <button type="button" aria-label="Previous month" title="Previous month" onClick={() => moveMonth(-1)}><ChevronLeft size={18} aria-hidden="true" /></button>
          <button type="button" aria-label="Next month" title="Next month" onClick={() => moveMonth(1)}><ChevronRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="calendar-month-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span className="calendar-weekday" key={day} aria-hidden="true">{day}</span>)}
        {days.map((date) => {
          const key = dateKey(date)
          const scheduled = scheduledDates.has(key)
          const isSelected = selectedDate === key
          const isToday = key === today
          return (
            <button
              type="button"
              key={key}
              className={`calendar-day${date.getUTCMonth() !== selected.getUTCMonth() ? ' calendar-day--outside' : ''}${scheduled ? ' calendar-day--scheduled' : ''}${isToday ? ' calendar-day--today' : ''}${isSelected ? ' calendar-day--selected' : ''}`}
              aria-label={`${formatPlanDate(key, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}${scheduled ? ', planned experiences' : ''}`}
              aria-pressed={isSelected}
              aria-current={isToday ? 'date' : undefined}
              onPointerDown={(event) => startPress(event, key)}
              onPointerUp={cancelPress}
              onPointerCancel={cancelPress}
              onPointerLeave={cancelPress}
              onPointerMove={(event) => {
                if (press.current && Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y) > 8) cancelPress()
              }}
              onContextMenu={(event) => event.preventDefault()}
              onClick={(event) => {
                if (press.current?.triggered && event.detail > 0) { press.current.triggered = false; return }
                onSelect(key)
              }}
            >{date.getUTCDate()}</button>
          )
        })}
      </div>
    </section>
  )
}
