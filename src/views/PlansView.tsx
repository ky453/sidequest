import { CalendarDays, Download, Plus, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Button } from '../components/Button'
import { MonthlyCalendar } from '../components/MonthlyCalendar'
import { PageHeader } from '../components/PageHeader'
import { PlanCard } from '../components/PlanCard'
import { PlanModal } from '../components/PlanModal'
import { experiences } from '../data/experiences'
import { planningToday } from '../data/plans'
import { formatPlanDate, parsePlanImport, validCalendarDate } from '../lib/plans'
import { useSidequest } from '../state/sidequest-context'
import type { Plan } from '../types'

export function PlansView() {
  const { plans, planningDate, setPlanningDate, importPlans } = useSidequest()
  const fileInput = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState('')
  const [modal, setModal] = useState<{ defaultDate: string; plan?: Plan } | null>(null)
  const upcoming = plans.filter((plan) => plan.status === 'planned' && plan.plannedDate === planningDate)
    .sort((left, right) => left.startTime.localeCompare(right.startTime))
  const completed = plans.filter((plan) => plan.status === 'completed' && !plan.memoryPromptDismissedAt)
    .sort((left, right) => (right.completedAt ?? right.plannedDate).localeCompare(left.completedAt ?? left.plannedDate))

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const imported = parsePlanImport(JSON.parse(await file.text()))
      importPlans(imported)
      setImportStatus(`${imported.length} ${imported.length === 1 ? 'plan' : 'plans'} imported.`)
    } catch (error) {
      setImportStatus(error instanceof Error ? error.message : 'Unable to import this file.')
    }
  }

  function exportPlans() {
    const file = new Blob([JSON.stringify({ version: 2, plans }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sidequest-plans.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function cards(items: typeof plans) {
    return items.map((plan) => {
      const experience = experiences.find((item) => item.id === plan.experienceId)
      return experience ? <PlanCard key={plan.id} plan={plan} experience={experience} onEdit={(plan) => setModal({ defaultDate: plan.plannedDate, plan })} /> : null
    })
  }

  return (
    <div className="plans-view">
      <PageHeader title="Plans" subtitle="Schedule and organize weekend sidequests" />
      <MonthlyCalendar selectedDate={planningDate} today={planningToday} plans={plans} onSelect={setPlanningDate} onLongPress={(date) => { setPlanningDate(date); setModal({ defaultDate: date }) }} />
      <section className="calendar-tools-section" aria-labelledby="calendar-tools-heading">
        <h2 id="calendar-tools-heading">Calendar Tools</h2>
        <div className="calendar-tools">
          <Button onClick={() => fileInput.current?.click()}><Upload size={16} aria-hidden="true" />Import</Button>
          <Button variant="primary" onClick={exportPlans}><Download size={16} aria-hidden="true" />Export</Button>
          <input ref={fileInput} className="sr-only" type="file" tabIndex={-1} accept=".json,application/json" aria-label="Import Sidequest plans" onChange={handleImport} />
        </div>
        <p className={importStatus ? 'plan-import-status' : 'sr-only'} role="status">{importStatus}</p>
      </section>
      <section className="plans-section" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading">Upcoming Schedule</h2>
        <div className="plans-day-heading">
          <label className="selected-date-control" title={formatPlanDate(planningDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}>
            <CalendarDays size={16} aria-hidden="true" />
            <input type="date" aria-label="Selected calendar date" value={planningDate} onChange={(event) => { if (validCalendarDate(event.target.value)) setPlanningDate(event.target.value) }} />
          </label>
          <Button className="add-event-button" variant="primary" onClick={() => setModal({ defaultDate: planningDate })}><Plus size={16} aria-hidden="true" />Add Event</Button>
        </div>
        <div className="plan-list">{cards(upcoming)}</div>
        {upcoming.length === 0 && <p className="plans-empty">No events scheduled for this date.</p>}
      </section>
      {modal && <PlanModal
        experience={modal.plan ? experiences.find((item) => item.id === modal.plan?.experienceId) : undefined}
        plan={modal.plan}
        defaultDate={modal.defaultDate}
        onClose={() => setModal(null)}
      />}
      <section className="plans-section" aria-labelledby="completed-heading">
        <h2 id="completed-heading">Completed - Add Memory</h2>
        <div className="plan-list">{cards(completed)}</div>
        {completed.length === 0 && <p className="plans-empty">No memories waiting to be added.</p>}
      </section>
    </div>
  )
}
