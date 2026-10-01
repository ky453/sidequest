import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Plan, SavedExperience } from '../types'
import { SidequestContext } from './sidequest-context'

export function SidequestProvider({ children }: { children: ReactNode }) {
  const [savedExperiences, setSavedExperiences] = useState<SavedExperience[]>([])
  const [plans, setPlans] = useState<Plan[]>([])

  function toggleSaved(experienceId: string) {
    setSavedExperiences((current) => current.some((saved) => saved.experienceId === experienceId)
      ? current.filter((saved) => saved.experienceId !== experienceId)
      : [...current, { experienceId, savedAt: new Date().toISOString() }])
  }

  function togglePlanned(experienceId: string) {
    setPlans((current) => current.some((plan) => plan.experienceId === experienceId)
      ? current.filter((plan) => plan.experienceId !== experienceId)
      : [...current, { experienceId, addedAt: new Date().toISOString(), status: 'planned' }])
  }

  return (
    <SidequestContext value={{ savedExperiences, plans, toggleSaved, togglePlanned }}>
      {children}
    </SidequestContext>
  )
}
