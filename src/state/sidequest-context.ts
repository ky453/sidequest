import { createContext, useContext } from 'react'
import type { Memory, MemoryDraft, Plan, PlanSchedule, SavedExperience } from '../types'

export interface SidequestState {
  savedExperiences: SavedExperience[]
  plans: Plan[]
  memories: Memory[]
  planningDate: string
  setPlanningDate: (date: string) => void
  dismissMemoryPrompt: (planId: string) => void
  importPlans: (plans: Plan[]) => void
  toggleSaved: (experienceId: string) => void
  savePlan: (experienceId: string, schedule: PlanSchedule, planId?: string) => void
  removePlan: (planId: string) => void
  completePlan: (planId: string) => void
  saveMemory: (planId: string, draft: MemoryDraft) => void
}

export const SidequestContext = createContext<SidequestState | null>(null)

export function useSidequest() {
  const state = useContext(SidequestContext)
  if (!state) throw new Error('useSidequest must be used inside SidequestProvider')
  return state
}
