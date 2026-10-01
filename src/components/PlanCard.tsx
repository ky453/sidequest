import { CircleCheck, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { planningToday } from '../data/plans'
import { calendarDate, formatPlanDate, formatPlanTime, planDateKey } from '../lib/plans'
import { useSidequest } from '../state/sidequest-context'
import type { Experience, Plan } from '../types'
import { Button } from './Button'

export function PlanCard({ plan, experience, onEdit }: { plan: Plan; experience: Experience; onEdit: (plan: Plan) => void }) {
  const { dismissMemoryPrompt } = useSidequest()
  if (plan.status === 'completed') {
    const completed = plan.completedAt ?? plan.plannedDate
    const daysAgo = Math.round((calendarDate(planningToday).getTime() - calendarDate(planDateKey(completed)).getTime()) / 86400000)
    const completedLabel = daysAgo === 1 ? 'Yesterday' : daysAgo === 0 ? 'Today' : formatPlanDate(completed, { month: 'short', day: 'numeric' })
    return (
      <article className="plan-card completed-plan" aria-label={`Completed: ${experience.title}`}>
        <div className="completed-plan-heading">
          <CircleCheck size={17} aria-hidden="true" />
          <h3>{experience.title}</h3>
          <span>{completedLabel}</span>
        </div>
        <p>You scheduled this plan on {formatPlanDate(plan.addedAt, { month: 'long', day: 'numeric' })}. How did it go?<br />Keep a memory log of this event.</p>
        <div className="completed-plan-actions">
          <Link className="button button--primary" to={`/memories/new?${new URLSearchParams({ experienceId: experience.id, planId: plan.id })}`}><Plus size={14} strokeWidth={3} aria-hidden="true" />Add Memory</Link>
          <Button aria-label={`Dismiss memory prompt: ${experience.title}`} onClick={() => dismissMemoryPrompt(plan.id)}>Dismiss</Button>
        </div>
      </article>
    )
  }

  const time = `${formatPlanTime(plan.startTime)} - ${formatPlanTime(plan.endTime)}`
  return (
    <article className="plan-card upcoming-plan" aria-label={`Planned: ${experience.title}`}>
      <button type="button" className="upcoming-plan-link plan-event-button" aria-label={`Edit plan: ${experience.title}`} aria-haspopup="dialog" onClick={() => onEdit(plan)}>
        <span className="plan-date-badge">
          <span>{formatPlanDate(plan.plannedDate, { month: 'short' })}</span>
          <strong>{formatPlanDate(plan.plannedDate, { day: '2-digit' })}</strong>
        </span>
        <span className="upcoming-plan-summary">
          <strong className="plan-event-title">{experience.title}</strong>
          <span className="plan-event-time">{time}{plan.note && <> <span aria-hidden="true">&bull;</span> {plan.note}</>}</span>
        </span>
      </button>
    </article>
  )
}
