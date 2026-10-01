import { categories } from '../data/experiences'
import type { Experience } from '../types'

export interface DiscoveryFilters {
  query: string
  budget: string
  distance: string
  mood: string
  category: string
  showAll: boolean
}

export function filterExperiences(items: Experience[], filters: DiscoveryFilters) {
  const terms = filters.query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const hasFilters = terms.length > 0 || [filters.budget, filters.distance, filters.mood, filters.category].some(Boolean)

  return items.filter((item) => {
    const category = categories.find((entry) => entry.id === item.category)?.label ?? ''
    const searchable = [item.title, item.description, item.location, category, ...item.searchTags, ...item.moodTags].join(' ').toLowerCase()

    return (
      (filters.showAll || hasFilters || item.recommended) &&
      terms.every((term) => searchable.includes(term)) &&
      (!filters.budget || item.cost.max <= Number(filters.budget)) &&
      (!filters.distance || item.distanceMiles <= Number(filters.distance)) &&
      (!filters.mood || item.moodTags.some((mood) => mood === filters.mood)) &&
      (!filters.category || item.category === filters.category)
    )
  })
}

export function formatCost(cost: Experience['cost'], spacedRange = false) {
  return cost.max === 0 ? 'Free' : cost.min === cost.max ? `$${cost.max}` : `$${cost.min}${spacedRange ? ' - ' : '-'}$${cost.max}`
}

export function formatDuration(duration: Experience['duration'], unitStyle: 'short' | 'long' = 'short') {
  const { minMinutes, maxMinutes } = duration
  if (minMinutes >= 60 && minMinutes % 60 === 0 && maxMinutes % 60 === 0) {
    return minMinutes === maxMinutes
      ? `${minMinutes / 60} ${unitStyle === 'long' ? 'Hour' : 'hr'}`
      : `${minMinutes / 60}-${maxMinutes / 60} ${unitStyle === 'long' ? 'Hours' : 'hrs'}`
  }
  const unit = unitStyle === 'long' ? 'Minutes' : 'min'
  return minMinutes === maxMinutes ? `${minMinutes} ${unit}` : `${minMinutes}-${maxMinutes} ${unit}`
}
