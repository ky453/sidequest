import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Plan, PlanSchedule, SavedExperience } from '../types'
import { SidequestContext } from './sidequest-context'
import { experiences } from '../data/experiences'
import { initialPlans, planningToday } from '../data/plans'
import { scheduleProblem } from '../lib/plans'

export function SidequestProvider({ children }: { children: ReactNode }) {
  const [savedExperiences, setSavedExperiences] = useState<SavedExperience[]>([])
  const [plans, setPlans] = useState<Plan[]>(() => initialPlans.map((plan) => ({ ...plan })))
  const [planningDate, setPlanningDate] = useState(planningToday)

  function toggleSaved(experienceId: string) {
    setSavedExperiences((current) => current.some((saved) => saved.experienceId === experienceId)
      ? current.filter((saved) => saved.experienceId !== experienceId)
      : [...current, { experienceId, savedAt: new Date().toISOString() }])
  }

  function savePlan(experienceId: string, schedule: PlanSchedule, planId?: string) {
    const experience = experiences.find((item) => item.id === experienceId)
    if (!experience) throw new Error('This activity could not be found.')
    if (planId && !plans.some((plan) => plan.id === planId && plan.experienceId === experienceId && plan.status === 'planned')) {
      throw new Error('This plan is no longer available.')
    }
    const selected = experience.schedule.type === 'fixed' ? experience.schedule : schedule
    const problem = scheduleProblem(selected)
    if (problem) throw new Error(problem)
    const scheduled = { plannedDate: selected.plannedDate, startTime: selected.startTime, endTime: selected.endTime }
    const newPlan: Plan = {
      id: crypto.randomUUID(),
      experienceId,
      addedAt: new Date().toISOString(),
      ...scheduled,
      status: 'planned',
    }
    setPlans((current) => {
      const existing = current.find((plan) => plan.status === 'planned' && (planId ? plan.id === planId : plan.experienceId === experienceId))
      return existing ? current.map((plan) => plan.id === existing.id ? { ...plan, ...scheduled } : plan) : [...current, newPlan]
    })
    setPlanningDate(scheduled.plannedDate)
  }

  function removePlan(planId: string) {
    setPlans((current) => current.filter((plan) => plan.id !== planId || plan.status !== 'planned'))
  }

  function dismissMemoryPrompt(planId: string) {
    setPlans((current) => current.map((plan) => plan.id === planId && plan.status === 'completed'
      ? { ...plan, memoryPromptDismissedAt: new Date().toISOString() }
      : plan))
  }

  function importPlans(importedPlans: Plan[]) {
    setPlans((current) => {
      const incomingIds = new Set(importedPlans.map((plan) => plan.id))
      const incomingActivities = new Set(importedPlans.filter((plan) => plan.status === 'planned').map((plan) => plan.experienceId))
      const retained = current.filter((plan) => !incomingIds.has(plan.id) && (plan.status !== 'planned' || !incomingActivities.has(plan.experienceId)))
      return [...retained, ...importedPlans]
    })
  }

  return (
    <SidequestContext value={{ savedExperiences, plans, planningDate, setPlanningDate, toggleSaved, savePlan, removePlan, dismissMemoryPrompt, importPlans }}>
      {children}
    </SidequestContext>
  )
}
