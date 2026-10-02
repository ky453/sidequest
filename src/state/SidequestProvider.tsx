import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Memory, MemoryDraft, Plan, PlanSchedule, SavedExperience, UserProfile } from '../types'
import { SidequestContext } from './sidequest-context'
import { experiences } from '../data/experiences'
import { initialPlans, planningToday } from '../data/plans'
import { initialMemories } from '../data/memories'
import { initialProfile } from '../data/profile'
import { profileProblem } from '../lib/profile'
import { mergePlanImport, scheduleProblem } from '../lib/plans'
import { memoryProblem, normalizedMemoryDraft } from '../lib/memories'

export function SidequestProvider({ children }: { children: ReactNode }) {
  const [savedExperiences, setSavedExperiences] = useState<SavedExperience[]>([])
  const [plans, setPlans] = useState<Plan[]>(() => initialPlans.map((plan) => ({ ...plan })))
  const [planningDate, setPlanningDate] = useState(planningToday)
  const [memories, setMemories] = useState<Memory[]>(() => initialMemories.map((memory) => ({ ...memory, people: [...memory.people] })))
  const [profile, setProfile] = useState<UserProfile>(() => ({ ...initialProfile }))

  function updateProfile(draft: UserProfile) {
    const problem = profileProblem(draft)
    if (problem) throw new Error(problem)
    setProfile({ name: draft.name.trim(), year: draft.year.trim(), location: draft.location.trim(), monthlyBudget: draft.monthlyBudget })
  }

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

  function completePlan(planId: string) {
    const completedAt = new Date().toISOString()
    setPlans((current) => current.map((plan) => plan.id === planId && plan.status === 'planned'
      ? { ...plan, status: 'completed', completedAt }
      : plan))
  }

  function saveMemory(planId: string, draft: MemoryDraft) {
    const plan = plans.find((item) => item.id === planId && item.status === 'completed')
    if (!plan || !experiences.some((item) => item.id === plan.experienceId)) throw new Error('This completed plan could not be found.')
    if (memories.some((memory) => memory.planId === planId)) throw new Error('A memory has already been saved for this plan.')
    const problem = memoryProblem(draft)
    if (problem) throw new Error(problem)
    const memory: Memory = {
      ...normalizedMemoryDraft(draft),
      id: crypto.randomUUID(),
      experienceId: plan.experienceId,
      planId: plan.id,
      createdAt: new Date().toISOString(),
    }
    setMemories((current) => current.some((item) => item.planId === planId) ? current : [...current, memory])
  }

  function updateMemory(memoryId: string, draft: MemoryDraft) {
    if (!memories.some((memory) => memory.id === memoryId)) throw new Error('This memory could not be found.')
    const problem = memoryProblem(draft)
    if (problem) throw new Error(problem)
    const fields = normalizedMemoryDraft(draft)
    setMemories((current) => current.map((memory) => memory.id === memoryId ? { ...memory, ...fields } : memory))
  }

  function deleteMemory(memoryId: string) {
    setMemories((current) => current.filter((memory) => memory.id !== memoryId))
  }

  function dismissMemoryPrompt(planId: string) {
    setPlans((current) => current.map((plan) => plan.id === planId && plan.status === 'completed'
      ? { ...plan, memoryPromptDismissedAt: new Date().toISOString() }
      : plan))
  }

  function importPlans(importedPlans: Plan[]) {
    // Validate here so the form can report errors before React processes the queued update.
    mergePlanImport(plans, importedPlans, memories)
    setPlans((current) => mergePlanImport(current, importedPlans, memories))
  }

  return (
    <SidequestContext value={{ savedExperiences, plans, memories, profile, updateProfile, planningDate, setPlanningDate, toggleSaved, savePlan, removePlan, completePlan, saveMemory, updateMemory, deleteMemory, dismissMemoryPrompt, importPlans }}>
      {children}
    </SidequestContext>
  )
}
