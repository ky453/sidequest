import { ArrowLeft, CalendarDays, Check, ChevronRight, CircleCheck, LockKeyhole, Trash2 } from 'lucide-react'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { categories, experiences } from '../data/experiences'
import { formatCost, formatDuration } from '../lib/discovery'
import { formatPlanDate, formatPlanTime } from '../lib/plans'
import { useSidequest } from '../state/sidequest-context'
import type { Experience, Plan } from '../types'
import { Button } from './Button'
import { Modal } from './Modal'
import { SearchBar } from './SearchBar'

export function PlanModal({ experience, plan, defaultDate, onClose }: {
  experience?: Experience
  plan?: Plan
  defaultDate?: string
  onClose: () => void
}) {
  const { plans } = useSidequest()
  const [selected, setSelected] = useState(experience ?? null)
  const [query, setQuery] = useState('')
  const existing = selected ? plan ?? plans.find((item) => item.experienceId === selected.id && item.status === 'planned') : undefined
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const available = experiences.filter((item) => {
    const category = categories.find((entry) => entry.id === item.category)?.label ?? ''
    const searchable = [item.title, category, item.description, ...item.searchTags].join(' ').toLowerCase()
    return terms.every((term) => searchable.includes(term))
  })

  return (
    <Modal title={selected ? existing ? 'Edit Plan' : 'Schedule Experience' : 'Add Event'} onClose={onClose}>
      {selected ? (
        <ScheduleForm
          key={`${selected.id}-${existing?.id ?? 'new'}`}
          experience={selected}
          plan={existing}
          defaultDate={defaultDate}
          onClose={onClose}
          onBack={!experience ? () => setSelected(null) : undefined}
        />
      ) : (
        <div className="experience-picker">
          <SearchBar value={query} onChange={setQuery} />
          <div className="experience-picker-list">
            {available.map((item) => {
              const category = categories.find((entry) => entry.id === item.category)?.label
              const fixed = item.schedule.type === 'fixed' ? item.schedule : null
              return (
                <button type="button" key={item.id} className="experience-picker-row" aria-label={`Select ${item.title}`} onClick={() => setSelected(item)}>
                  <CalendarDays size={20} aria-hidden="true" />
                  <span>
                    <strong>{item.title}</strong>
                    <span>{category} &bull; {formatCost(item.cost)} &bull; {formatDuration(item.duration)}</span>
                    {fixed && <span className="picker-fixed-date"><LockKeyhole size={11} aria-hidden="true" />{formatPlanDate(fixed.plannedDate, { month: 'short', day: 'numeric' })}, {formatPlanTime(fixed.startTime)}</span>}
                  </span>
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              )
            })}
            {available.length === 0 && <p className="picker-empty" role="status">No experiences found.</p>}
          </div>
        </div>
      )}
    </Modal>
  )
}

function ScheduleForm({ experience, plan, defaultDate, onClose, onBack }: {
  experience: Experience
  plan?: Plan
  defaultDate?: string
  onClose: () => void
  onBack?: () => void
}) {
  const { savePlan, removePlan, completePlan } = useSidequest()
  const fixed = experience.schedule.type === 'fixed'
  const initial = fixed ? experience.schedule : plan
  const [plannedDate, setPlannedDate] = useState(initial && 'plannedDate' in initial ? initial.plannedDate : defaultDate ?? '')
  const [startTime, setStartTime] = useState(initial && 'startTime' in initial ? initial.startTime : '')
  const [endTime, setEndTime] = useState(initial && 'endTime' in initial ? initial.endTime : '')
  const [error, setError] = useState('')
  const errorId = useId()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      savePlan(experience.id, { plannedDate, startTime, endTime }, plan?.id)
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to save this plan.')
    }
  }

  return (
    <form className="schedule-form" onSubmit={submit}>
      {onBack && <button type="button" className="schedule-back" onClick={onBack}><ArrowLeft size={16} aria-hidden="true" />Experiences</button>}
      <h3>{experience.title}</h3>
      <p className="schedule-location">{experience.location}</p>
      {fixed && <p className="fixed-schedule-notice"><LockKeyhole size={15} aria-hidden="true" />Fixed event schedule</p>}
      <fieldset disabled={fixed} className="schedule-fields" aria-describedby={error ? errorId : undefined}>
        <legend className="sr-only">Schedule</legend>
        <label>Date<input type="date" required value={plannedDate} onChange={(event) => setPlannedDate(event.target.value)} /></label>
        <div className="schedule-time-row">
          <label>Start time<input type="time" required value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label>
          <label>End time<input type="time" required value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label>
        </div>
      </fieldset>
      <p className="schedule-timezone">Eastern Time (Ithaca)</p>
      {error && <p id={errorId} className="schedule-error" role="alert">{error}</p>}
      <div className="schedule-footer">
        <Button onClick={onClose}>Cancel</Button>
        {(!fixed || !plan) && <Button type="submit" variant="primary"><Check size={16} aria-hidden="true" />{plan ? 'Save Changes' : 'Add to Plan'}</Button>}
      </div>
      {plan && <div className="plan-status-actions">
        <Button onClick={() => { completePlan(plan.id); onClose() }}><CircleCheck size={16} aria-hidden="true" />Mark Completed</Button>
        <Button className="remove-plan-button" onClick={() => { removePlan(plan.id); onClose() }}><Trash2 size={16} aria-hidden="true" />Remove Event</Button>
      </div>}
    </form>
  )
}
