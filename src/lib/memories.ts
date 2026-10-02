import { formatPlanTime, scheduleProblem, validCalendarDate } from './plans'
import type { Memory, MemoryDraft, MemoryPhoto } from '../types'

export const photoAccept = 'image/jpeg,image/png,image/webp,image/gif'
export const maximumPhotoBytes = 5 * 1024 * 1024

export const memoryDollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 })

export function memoryTimeRange(memory: Pick<MemoryDraft, 'startTime' | 'endTime'>) {
  return memory.startTime && memory.endTime ? `${formatPlanTime(memory.startTime)} - ${formatPlanTime(memory.endTime)} ET` : ''
}

export function selectMemories(memories: Memory[], query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return memories.filter((memory) => {
    const text = `${memory.name} ${memory.journal}`.toLowerCase()
    return terms.every((term) => text.includes(term))
  }).sort((left, right) => right.date.localeCompare(left.date) || Date.parse(right.createdAt) - Date.parse(left.createdAt))
}

export function normalizedMemoryDraft(draft: MemoryDraft): MemoryDraft {
  return {
    name: draft.name.trim(), date: draft.date, startTime: draft.startTime, endTime: draft.endTime,
    rating: draft.rating, people: draft.people.reduce<string[]>((people, name) => addPerson(people, name), []),
    journal: draft.journal.trim(), amountSpent: draft.amountSpent, photo: draft.photo,
  }
}

export function photoProblem(file: Pick<File, 'type' | 'size'>) {
  if (!photoAccept.split(',').includes(file.type)) return 'Choose a JPEG, PNG, WebP, or GIF image.'
  if (file.size > maximumPhotoBytes) return 'Choose an image smaller than 5 MB.'
  return null
}

export function spendingValue(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (!/^(?:\d+(?:\.\d{1,2})?|\.\d{1,2})$/.test(trimmed)) throw new Error('Enter a non-negative amount with up to two decimal places.')
  const amount = Number(trimmed)
  if (!Number.isFinite(amount) || !Number.isSafeInteger(Math.round(amount * 100))) throw new Error('Enter a valid spending amount.')
  return amount
}

export function addPerson(people: string[], value: string) {
  const name = value.trim()
  if (!name || people.some((person) => person.toLowerCase() === name.toLowerCase())) return people
  return [...people, name]
}

export function memoryProblem(draft: MemoryDraft) {
  if (!draft.name.trim()) return 'Enter the place or activity name.'
  if (!validCalendarDate(draft.date)) return 'Choose a valid experience date.'
  if (draft.startTime !== null || draft.endTime !== null) {
    if (draft.startTime === null || draft.endTime === null) return 'Enter both a start time and an end time, or leave both blank.'
    const problem = scheduleProblem({ plannedDate: draft.date, startTime: draft.startTime, endTime: draft.endTime })
    if (problem) return problem
  }
  if (draft.rating !== null && (!Number.isInteger(draft.rating) || draft.rating < 1 || draft.rating > 5)) return 'Choose a rating from 1 to 5.'
  if (draft.amountSpent !== null && (!Number.isFinite(draft.amountSpent) || draft.amountSpent < 0 || !Number.isSafeInteger(Math.round(draft.amountSpent * 100)) || Math.abs(draft.amountSpent * 100 - Math.round(draft.amountSpent * 100)) > 0.000001)) return 'Enter a valid spending amount with up to two decimal places.'
  return null
}

export function readMemoryPhoto(file: File): Promise<MemoryPhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('This photo could not be read. Try another image.'))
    reader.onload = async () => {
      if (typeof reader.result !== 'string') { reject(new Error('This photo could not be read.')); return }
      const image = new Image()
      image.src = reader.result
      try {
        await image.decode()
        resolve({ name: file.name, dataUrl: reader.result })
      } catch {
        reject(new Error('This photo could not be opened. Try another image.'))
      }
    }
    reader.readAsDataURL(file)
  })
}
