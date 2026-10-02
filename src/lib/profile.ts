import type { Memory, Plan, UserProfile } from '../types'
import { selectMemories } from './memories'
import { validCalendarDate } from './plans'
import { validMoneyAmount } from './money'

export function profileMonth(value: string | null, currentMonth: string) {
  return value && /^\d{4}-\d{2}$/.test(value) && validCalendarDate(`${value}-01`) && value <= currentMonth ? value : currentMonth
}

export function profileProblem(profile: UserProfile) {
  if (!profile.name.trim()) return 'Enter your name.'
  if (!validMoneyAmount(profile.monthlyBudget)) return 'Enter a non-negative monthly budget with up to two decimal places.'
  return null
}

export function monthlySummary(plans: Plan[], memories: Memory[], month: string, budget: number) {
  const entries = selectMemories(memories.filter((memory) => memory.date.slice(0, 7) === month), '')
  const spent = entries.reduce((total, memory) => total + Math.round((memory.amountSpent ?? 0) * 100), 0) / 100
  const ratings = entries.flatMap((memory) => memory.rating === null ? [] : [memory.rating])
  const completed = new Map(plans.filter((plan) => plan.status === 'completed').map((plan) => [plan.id, { date: plan.plannedDate, experienceId: plan.experienceId }]))
  // Recorded experience dates override schedules; a memory still counts if its plan was replaced by an import.
  for (const memory of memories) completed.set(memory.planId, { date: memory.date, experienceId: memory.experienceId })
  const activities = [...completed.values()].filter((activity) => activity.date.slice(0, 7) === month)
  const remaining = (Math.round(budget * 100) - Math.round(spent * 100)) / 100
  return {
    spent, remaining,
    spending: entries.filter((memory) => memory.amountSpent !== null),
    activitiesDone: activities.length,
    newPlaces: new Set(activities.map((activity) => activity.experienceId)).size,
    averageRating: ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : null,
    budgetPercent: budget > 0 ? Math.min(100, spent / budget * 100) : spent > 0 ? 100 : 0,
    favorites: [...entries].sort((left, right) => (right.rating ?? 0) - (left.rating ?? 0)).slice(0, 3),
  }
}
