import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let helpers
let plans
let memories
before(async () => {
  server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' })
  helpers = await server.ssrLoadModule('/src/lib/profile.ts')
  plans = (await server.ssrLoadModule('/src/data/plans.ts')).initialPlans
  memories = (await server.ssrLoadModule('/src/data/memories.ts')).initialMemories
})
after(async () => { await server?.close() })

test('monthly summaries use actual completed plans and recorded spending/ratings, not mock display totals', () => {
  const october = helpers.monthlySummary(plans, memories, '2026-10', 300)
  assert.equal(october.spent, 15)
  assert.equal(october.remaining, 285)
  assert.equal(october.activitiesDone, 1)
  assert.equal(october.newPlaces, 1)
  assert.equal(october.averageRating, 5)
  assert.equal(october.budgetPercent, 5)
  assert.deepEqual(october.favorites.map((memory) => memory.id), ['memory-sunset-picnic'])
  const september = helpers.monthlySummary(plans, memories, '2026-09', 300)
  assert.equal(september.activitiesDone, 2, 'completed plans without memories count too')
  assert.equal(september.newPlaces, 2)
  assert.equal(september.spent, 8)
  assert.equal(september.averageRating, 4)
})

test('memory dates override plan dates, avoiding double-counting after edits or plan imports', () => {
  const edited = [{ ...memories[0], date: '2026-09-30' }]
  assert.equal(helpers.monthlySummary(plans, edited, '2026-10', 300).activitiesDone, 0)
  assert.equal(helpers.monthlySummary(plans, edited, '2026-09', 300).activitiesDone, 3)
  const orphan = { ...memories[0], planId: 'import-replaced-plan' }
  assert.equal(helpers.monthlySummary([], [orphan], '2026-10', 300).activitiesDone, 1)
  assert.equal(helpers.monthlySummary([], [orphan], '2026-10', 300).newPlaces, 1)
})

test('repeat visits increase activities, not unique places; null ratings/spending are excluded', () => {
  const entries = [
    { ...memories[0], planId: 'visit-1', rating: 5, amountSpent: 0.1 },
    { ...memories[0], planId: 'visit-2', rating: 2, amountSpent: 0.2 },
    { ...memories[0], planId: 'visit-3', rating: null, amountSpent: null },
  ]
  const summary = helpers.monthlySummary([], entries, '2026-10', 1)
  assert.equal(summary.activitiesDone, 3)
  assert.equal(summary.newPlaces, 1)
  assert.equal(summary.averageRating, 3.5)
  assert.equal(summary.spent, 0.3, 'sum in cents avoids floating-point display errors')
  assert.equal(summary.remaining, 0.7)
})

test('favorites use selected-month memories ordered by rating then recency, without mutating state', () => {
  const entries = [
    { ...memories[0], id: 'unrated', rating: null, date: '2026-10-20' },
    { ...memories[0], id: 'good', rating: 4, date: '2026-10-01' },
    { ...memories[0], id: 'favorite', rating: 5, date: '2026-10-01' },
    { ...memories[0], id: 'recent-favorite', rating: 5, date: '2026-10-02' },
    memories[1],
  ]
  assert.deepEqual(helpers.monthlySummary([], entries, '2026-10', 300).favorites.map((memory) => memory.id), ['recent-favorite', 'favorite', 'good'])
  assert.equal(entries[0].id, 'unrated')
})

test('recent spending includes only recorded amounts in the selected month, newest first, including explicit zero', () => {
  const entries = [
    { ...memories[0], id: 'unrecorded', date: '2026-10-20', amountSpent: null },
    { ...memories[0], id: 'early', date: '2026-10-01', amountSpent: 15 },
    { ...memories[0], id: 'free', date: '2026-10-02', amountSpent: 0 },
    { ...memories[0], id: 'recent', date: '2026-10-10', amountSpent: 25.75 },
    memories[1],
  ]
  const summary = helpers.monthlySummary([], entries, '2026-10', 300)
  assert.deepEqual(summary.spending.map((memory) => memory.id), ['recent', 'free', 'early'])
  assert.equal(summary.spent, 40.75)
  assert.equal(summary.spending.reduce((total, memory) => total + memory.amountSpent, 0), summary.spent)
  assert.equal(entries[0].id, 'unrecorded')
  assert.deepEqual(helpers.monthlySummary([], entries, '2026-08', 300).spending, [])
})

test('empty months and unset ratings show no invented statistics; zero/over budgets stay finite', () => {
  const empty = helpers.monthlySummary(plans, memories, '2026-08', 300)
  assert.equal(empty.spent, 0)
  assert.equal(empty.remaining, 300)
  assert.equal(empty.activitiesDone, 0)
  assert.equal(empty.newPlaces, 0)
  assert.equal(empty.averageRating, null)
  assert.deepEqual(empty.favorites, [])
  assert.equal(helpers.monthlySummary([], [], '2026-10', 0).budgetPercent, 0)
  const over = helpers.monthlySummary(plans, memories, '2026-10', 10)
  assert.equal(over.remaining, -5)
  assert.equal(over.budgetPercent, 100)
  assert.equal(helpers.monthlySummary(plans, memories, '2026-10', 0).budgetPercent, 100)
})

test('month selection excludes future/invalid months and supports past years', () => {
  for (const value of [null, '', 'invalid', '2026-13', '2026-11', '2027-01', '2026-09-01']) assert.equal(helpers.profileMonth(value, '2026-10'), '2026-10')
  for (const value of ['2026-10', '2026-09', '2025-12']) assert.equal(helpers.profileMonth(value, '2026-10'), value)
})

test('profile updates require a name and non-negative finite budget in cents', () => {
  const profile = { name: 'Katherine', year: 'Sophomore', location: 'Ithaca, NY', monthlyBudget: 300 }
  assert.equal(helpers.profileProblem(profile), null)
  assert.equal(helpers.profileProblem({ ...profile, monthlyBudget: 0 }), null)
  assert.equal(helpers.profileProblem({ ...profile, monthlyBudget: 12.34 }), null)
  for (const invalid of [{ name: ' ' }, { monthlyBudget: -1 }, { monthlyBudget: NaN }, { monthlyBudget: Infinity }, { monthlyBudget: 12.345 }, { monthlyBudget: 1e17 }]) assert.equal(typeof helpers.profileProblem({ ...profile, ...invalid }), 'string')
})
