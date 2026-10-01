import { createContext, useContext } from 'react'
import type { Plan, SavedExperience } from '../types'

export interface SidequestState {
  savedExperiences: SavedExperience[]
  plans: Plan[]
  toggleSaved: (experienceId: string) => void
  togglePlanned: (experienceId: string) => void
}

export const SidequestContext = createContext<SidequestState | null>(null)

export function useSidequest() {
  const state = useContext(SidequestContext)
  if (!state) throw new Error('useSidequest must be used inside SidequestProvider')
  return state
}
