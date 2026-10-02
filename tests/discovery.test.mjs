import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let helpers
let experiences
before(async () => {
  server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' })
  helpers = await server.ssrLoadModule('/src/lib/discovery.ts')
  experiences = (await server.ssrLoadModule('/src/data/experiences.ts')).experiences
})
after(async () => { await server?.close() })

const filters = { query: '', budget: '', distance: '', mood: '', category: '', showAll: false }

test('Discover defaults to recommendations but searches and See all expose the full catalog', () => {
  assert.deepEqual(helpers.filterExperiences(experiences, filters), experiences.filter((item) => item.recommended))
  assert.deepEqual(helpers.filterExperiences(experiences, { ...filters, showAll: true }), experiences)
  assert.deepEqual(helpers.filterExperiences(experiences, { ...filters, query: '  CAMPUS boba  ' }).map((item) => item.id), ['campus-boba-break'])
  assert.deepEqual(helpers.filterExperiences(experiences, { ...filters, query: 'no matching experience' }), [])
})

test('budget-aware filters require the full cost range to fit and handle zero as Free', () => {
  for (const budget of ['0', '10', '25', '50']) {
    const results = helpers.filterExperiences(experiences, { ...filters, budget })
    assert.deepEqual(results, experiences.filter((item) => item.cost.max <= Number(budget)))
  }
  const ranged = { ...experiences[0], cost: { min: 5, max: 12 } }
  assert.deepEqual(helpers.filterExperiences([ranged], { ...filters, budget: '10' }), [])
})

test('category, mood, distance, and search combine without mutating the catalog', () => {
  const before = structuredClone(experiences)
  const selected = { ...filters, category: 'outdoors', mood: 'adventurous', distance: '5', query: 'falls' }
  const results = helpers.filterExperiences(experiences, selected)
  assert.deepEqual(results.map((item) => item.id), ['buttermilk-falls-trail'])
  assert.deepEqual(experiences, before)
})
