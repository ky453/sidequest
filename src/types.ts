export type Category = 'outdoors' | 'food' | 'study' | 'socials'
export type Mood = 'relaxed' | 'adventurous' | 'social' | 'focused'

export interface PlanSchedule {
  plannedDate: string
  startTime: string
  endTime: string
}

export type ExperienceSchedule = { type: 'flexible' } | ({ type: 'fixed' } & PlanSchedule)

export interface Experience {
  id: string
  title: string
  category: Category
  moodTags: Mood[]
  cost: { min: number; max: number }
  duration: { minMinutes: number; maxMinutes: number }
  groupSize: { min: number; max: number }
  distanceMiles: number
  location: string
  description: string
  rating: number
  reviewCount: number
  searchTags: string[]
  recommended: boolean
  schedule: ExperienceSchedule
  imageUrl?: string
  imageDescription?: string
}

export interface Plan extends PlanSchedule {
  id: string
  experienceId: string
  addedAt: string
  status: 'planned' | 'completed'
  completedAt?: string
  memoryPromptDismissedAt?: string
  note?: string
}

export interface SavedExperience {
  experienceId: string
  savedAt: string
}

export interface MemoryPhoto {
  name: string
  dataUrl: string
}

export interface MemoryDraft {
  name: string
  date: string
  startTime: string | null
  endTime: string | null
  rating: number | null
  people: string[]
  journal: string
  amountSpent: number | null
  photo?: MemoryPhoto
}

export interface Memory extends MemoryDraft {
  id: string
  experienceId: string
  planId: string
  createdAt: string
}

export interface UserProfile {
  name: string
  year: string
  location: string
  monthlyBudget: number
}
