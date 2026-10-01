import type { Plan } from '../types'
import { planDateKey } from '../lib/plans'

export const planningToday = planDateKey(new Date().toISOString())

export const initialPlans: Plan[] = [
  {
    id: 'plan-farmers-market',
    experienceId: 'downtown-farmers-market',
    addedAt: '2026-10-02T12:00:00-04:00',
    plannedDate: '2026-10-09',
    startTime: '16:00',
    endTime: '18:00',
    status: 'planned',
    note: 'Meet at Campus West',
  },
  {
    id: 'plan-regal-movies',
    experienceId: 'regal-movies-night',
    addedAt: '2026-09-30T12:00:00-04:00',
    plannedDate: '2026-09-30',
    startTime: '19:00',
    endTime: '21:30',
    completedAt: '2026-09-30T21:30:00-04:00',
    status: 'completed',
  },
]
