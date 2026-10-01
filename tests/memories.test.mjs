import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let helpers
before(async () => {
  server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' })
  helpers = await server.ssrLoadModule('/src/lib/memories.ts')
})
after(async () => { await server?.close() })

const draft = { name: 'Regal Movies Night', date: '2026-09-30', startTime: null, endTime: null, rating: null, people: [], journal: '', amountSpent: null }

test('only the activity name and real date are required; reflection fields are optional', () => {
  assert.equal(helpers.memoryProblem(draft), null)
  for (const invalid of [{ name: '   ' }, { date: '' }, { date: '2026-02-30' }, { rating: 0 }, { rating: 6 }, { rating: 2.5 }, { amountSpent: -1 }, { amountSpent: NaN }, { amountSpent: 12.345 }]) {
    assert.equal(typeof helpers.memoryProblem({ ...draft, ...invalid }), 'string')
  }
  assert.equal(helpers.memoryProblem({ ...draft, rating: 5, amountSpent: 0 }), null)
  assert.equal(helpers.memoryProblem({ ...draft, amountSpent: 12.34 }), null)
})

test('spending preserves omitted versus zero and accepts up to two decimal places', () => {
  assert.equal(helpers.spendingValue(''), null)
  assert.equal(helpers.spendingValue('  '), null)
  assert.equal(helpers.spendingValue('0'), 0)
  assert.equal(helpers.spendingValue('25.75'), 25.75)
  assert.equal(helpers.spendingValue('.50'), 0.5)
  for (const value of ['-5', 'NaN', 'Infinity', '1e3', '25.001', '999999999999999999999']) assert.throws(() => helpers.spendingValue(value))
})

test('people names are trimmed, never fabricated, and de-duplicated without mutating input', () => {
  const people = ['Sarah']
  assert.deepEqual(helpers.addPerson(people, ' Alex '), ['Sarah', 'Alex'])
  assert.deepEqual(helpers.addPerson(people, ' sarah '), ['Sarah'])
  assert.deepEqual(helpers.addPerson(people, '   '), ['Sarah'])
  assert.deepEqual(people, ['Sarah'])
})

test('optional memory time ranges require both endpoints and an increasing same-day range', () => {
  for (const [startTime, endTime] of [[null, null], ['00:00', '01:00'], ['19:00', '21:30'], ['23:00', '23:59']]) assert.equal(helpers.memoryProblem({ ...draft, startTime, endTime }), null)
  for (const [startTime, endTime] of [[null, '19:00'], ['19:00', null], ['19:00', '19:00'], ['21:00', '19:00'], ['23:00', '01:00'], ['7:00', '19:00'], ['19:00', '24:00'], ['19:60', '21:00'], ['19:00:30', '21:00']]) {
    assert.equal(typeof helpers.memoryProblem({ ...draft, startTime, endTime }), 'string')
  }
})

test('local photo selection is limited to supported raster images and 5 MB', () => {
  assert.equal(helpers.photoProblem({ type: 'image/png', size: 500 }), null)
  assert.equal(typeof helpers.photoProblem({ type: 'text/plain', size: 500 }), 'string')
  assert.equal(typeof helpers.photoProblem({ type: 'image/svg+xml', size: 500 }), 'string')
  assert.equal(typeof helpers.photoProblem({ type: 'image/png', size: 5 * 1024 * 1024 + 1 }), 'string')
})
