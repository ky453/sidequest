import type { Memory } from '../types'

export const initialMemories: Memory[] = [
  {
    id: 'memory-sunset-picnic',
    planId: 'plan-sunset-picnic',
    experienceId: 'sunset-point-walk',
    name: 'Sunset Point Picnic',
    date: '2026-10-01',
    startTime: '17:30',
    endTime: '19:00',
    rating: 5,
    people: ['Sarah', 'Alex', 'Tom'],
    amountSpent: 15,
    journal: 'Unbelievable colors at sunset. We got hot cocoa from the diner beforehand. It was freezing but worth every minute of the hike!',
    createdAt: '2026-10-01T19:30:00-04:00',
  },
  {
    id: 'memory-boba-board-games',
    planId: 'plan-boba-board-games',
    experienceId: 'campus-boba-break',
    name: 'Boba and Board Games',
    date: '2026-09-18',
    startTime: '14:00',
    endTime: '15:30',
    rating: 4,
    people: [],
    amountSpent: 8,
    journal: '',
    createdAt: '2026-09-18T16:00:00-04:00',
  },
]
