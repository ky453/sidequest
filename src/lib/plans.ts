import { experiences } from '../data/experiences'
import type { Plan, PlanSchedule } from '../types'

const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
})

export function planDateKey(value: string) {
  if (value.length === 10) return value
  const parts = dateKeyFormatter.formatToParts(new Date(value))
  const part = (type: string) => parts.find((item) => item.type === type)?.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function calendarDate(key: string) {
  return new Date(`${key}T12:00:00Z`)
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function moveCalendarMonth(key: string, offset: number) {
  const date = calendarDate(key)
  date.setUTCDate(1)
  date.setUTCMonth(date.getUTCMonth() + offset)
  return dateKey(date)
}

export function calendarMonthDays(key: string) {
  const first = calendarDate(key)
  first.setUTCDate(1)
  const last = new Date(first)
  last.setUTCMonth(first.getUTCMonth() + 1, 0)
  const dayCount = Math.ceil((first.getUTCDay() + last.getUTCDate()) / 7) * 7
  const start = new Date(first)
  start.setUTCDate(1 - first.getUTCDay())
  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + index)
    return date
  })
}

export function formatPlanDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'America/New_York' }).format(
    value.length === 10 ? calendarDate(value) : new Date(value),
  )
}

export function formatPlanTime(value: string) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(new Date(`2000-01-01T${value}:00Z`))
}

export function validCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = calendarDate(value)
  return Number.isFinite(date.getTime()) && dateKey(date) === value
}

export function scheduleProblem(schedule: PlanSchedule): string | null {
  if (!validCalendarDate(schedule.plannedDate)) return 'Choose a valid date.'
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(schedule.startTime) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(schedule.endTime)) return 'Choose a start time and an end time.'
  if (schedule.endTime <= schedule.startTime) return 'End time must be after start time on the same day.'
  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validTimestamp(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) && validCalendarDate(value.slice(0, 10)) && Number.isFinite(Date.parse(value))
}

export function parsePlanImport(value: unknown): Plan[] {
  if (!isRecord(value) || value.version !== 2 || !Array.isArray(value.plans)) {
    throw new Error('Choose a current Sidequest plan export with explicit date and time (.json).')
  }
  const ids = new Set<string>()
  const plannedExperiences = new Set<string>()
  return value.plans.map((entry: unknown) => {
    if (!isRecord(entry) || typeof entry.id !== 'string' || !entry.id || ids.has(entry.id) || typeof entry.experienceId !== 'string') throw new Error('The file contains an invalid or duplicate plan ID.')
    const experience = experiences.find((item) => item.id === entry.experienceId)
    if (!experience) throw new Error('The file contains an unknown activity.')
    if (!validTimestamp(entry.addedAt) || (entry.status !== 'planned' && entry.status !== 'completed')) throw new Error('The file contains an invalid plan.')
    if (typeof entry.plannedDate !== 'string' || typeof entry.startTime !== 'string' || typeof entry.endTime !== 'string') throw new Error('Every plan must include a date, start time, and end time.')
    const schedule = { plannedDate: entry.plannedDate, startTime: entry.startTime, endTime: entry.endTime }
    const problem = scheduleProblem(schedule)
    if (problem) throw new Error(problem)
    if (experience.schedule.type === 'fixed' && (schedule.plannedDate !== experience.schedule.plannedDate || schedule.startTime !== experience.schedule.startTime || schedule.endTime !== experience.schedule.endTime)) throw new Error('The file modifies a fixed event schedule.')
    for (const field of ['completedAt', 'memoryPromptDismissedAt'] as const) {
      if (entry[field] !== undefined && !validTimestamp(entry[field])) throw new Error('The file contains an invalid timestamp.')
    }
    if (entry.note !== undefined && typeof entry.note !== 'string') throw new Error('The file contains an invalid note.')
    if (entry.status === 'planned' && plannedExperiences.has(entry.experienceId)) throw new Error('The file contains duplicate upcoming activities.')
    ids.add(entry.id)
    if (entry.status === 'planned') plannedExperiences.add(entry.experienceId)
    return {
      id: entry.id, experienceId: entry.experienceId, addedAt: entry.addedAt, status: entry.status,
      ...schedule,
      completedAt: typeof entry.completedAt === 'string' ? entry.completedAt : undefined,
      memoryPromptDismissedAt: typeof entry.memoryPromptDismissedAt === 'string' ? entry.memoryPromptDismissedAt : undefined,
      note: typeof entry.note === 'string' ? entry.note : undefined,
    }
  })
}
