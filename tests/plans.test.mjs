import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let helpers
before(async () => {
  server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' })
  helpers = await server.ssrLoadModule('/src/lib/plans.ts')
})
after(async () => { await server?.close() })

const schedule = { plannedDate: '2026-10-06', startTime: '10:00', endTime: '12:00' }
const flexible = { id: 'trail', experienceId: 'buttermilk-falls-trail', addedAt: '2026-10-01T12:00:00Z', status: 'planned', ...schedule }
const market = { ...flexible, id: 'market', experienceId: 'downtown-farmers-market', plannedDate: '2026-10-09', startTime: '16:00', endTime: '18:00' }
const importPlans = (plans) => helpers.parsePlanImport({ version: 2, plans })

test('dates remain calendar days and use Ithaca time for timestamps', () => {
  assert.equal(helpers.planDateKey('2026-10-06'), '2026-10-06')
  assert.equal(helpers.planDateKey('2026-10-02T01:00:00Z'), '2026-10-01')
  assert.equal(helpers.formatPlanDate('2026-10-06', { day: 'numeric' }), '6')
  assert.equal(helpers.formatPlanTime('16:00'), '4:00 PM')
  assert.equal(helpers.validCalendarDate('2028-02-29'), true)
  for (const date of ['2026-02-29', '2026-02-30', '2026-13-01', '2026-10-6', '']) assert.equal(helpers.validCalendarDate(date), false)
})

test('flexible schedules require a real date and an increasing same-day time range', () => {
  assert.equal(helpers.scheduleProblem(schedule), null)
  for (const invalid of [
    { plannedDate: '' }, { plannedDate: '2026-02-30' }, { startTime: '' },
    { endTime: '24:00' }, { startTime: '9:00' }, { endTime: '10:00' },
    { startTime: '23:00', endTime: '01:00' },
  ]) assert.equal(typeof helpers.scheduleProblem({ ...schedule, ...invalid }), 'string')
})

test('imports require explicit scheduling and preserve completion history', () => {
  const completed = { ...flexible, id: 'past', status: 'completed', completedAt: '2026-09-30T21:30:00-04:00', memoryPromptDismissedAt: '2026-10-01T12:00:00Z' }
  assert.equal(importPlans([flexible, completed]).length, 2)
  assert.throws(() => helpers.parsePlanImport({ version: 1, plans: [flexible] }), /explicit date and time/)
  assert.throws(() => importPlans([{ ...flexible, endTime: undefined }]), /start time, and end time/)
  assert.throws(() => importPlans([{ ...flexible, endTime: '09:00' }]), /End time/)
  assert.throws(() => importPlans([flexible, { ...flexible, id: 'duplicate-activity' }]), /duplicate upcoming/)
  assert.throws(() => importPlans([flexible, flexible]), /duplicate plan ID/)
  assert.throws(() => importPlans([{ ...flexible, experienceId: 'missing' }]), /unknown activity/)
})

test('fixed event imports cannot override any part of the locked schedule', () => {
  assert.equal(importPlans([market])[0].startTime, '16:00')
  for (const override of [{ plannedDate: '2026-10-10' }, { startTime: '15:00' }, { endTime: '19:00' }]) {
    assert.throws(() => importPlans([{ ...market, ...override }]), /fixed event schedule/)
  }
})

test('monthly grids cover every day with complete Sunday-Saturday weeks', () => {
  for (const [key, first, last, count] of [
    ['2026-10-01', '2026-09-27', '2026-10-31', 35],
    ['2026-10-22', '2026-09-27', '2026-10-31', 35],
    ['2026-11-01', '2026-11-01', '2026-12-05', 35],
    ['2026-12-31', '2026-11-29', '2027-01-02', 35],
    ['2027-01-01', '2026-12-27', '2027-02-06', 42],
    ['2026-02-01', '2026-02-01', '2026-02-28', 28],
    ['2028-02-29', '2028-01-30', '2028-03-04', 35],
  ]) {
    const days = helpers.calendarMonthDays(key)
    assert.equal(days.length, count)
    assert.equal(days[0].getUTCDay(), 0)
    assert.equal(days.at(-1).getUTCDay(), 6)
    assert.equal(helpers.dateKey(days[0]), first)
    assert.equal(helpers.dateKey(days.at(-1)), last)
    const month = key.slice(0, 7)
    const monthDays = days.filter((day) => helpers.dateKey(day).startsWith(month))
    assert.equal(monthDays[0].getUTCDate(), 1)
    assert.equal(days.some((day) => helpers.dateKey(day) === key), true)
    for (let i = 1; i < days.length; i++) assert.equal(days[i].getTime() - days[i - 1].getTime(), 86400000)
  }
})

test('month navigation avoids short-month overflow and crosses years in either direction', () => {
  assert.equal(helpers.moveCalendarMonth('2026-10-22', 1), '2026-11-01')
  assert.equal(helpers.moveCalendarMonth('2026-12-31', 1), '2027-01-01')
  assert.equal(helpers.moveCalendarMonth('2027-01-31', -1), '2026-12-01')
  assert.equal(helpers.moveCalendarMonth('2027-01-31', 1), '2027-02-01')
  assert.equal(helpers.moveCalendarMonth('2026-03-31', -1), '2026-02-01')
})
