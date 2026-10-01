export type Category = 'outdoors' | 'food' | 'study' | 'socials'
export type Mood = 'relaxed' | 'adventurous' | 'social' | 'focused'

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
  startsAt?: string
  imageUrl?: string
  imageDescription?: string
}

export interface Plan {
  experienceId: string
  addedAt: string
  plannedFor?: string
  status: 'planned' | 'completed'
}

export interface SavedExperience {
  experienceId: string
  savedAt: string
}
