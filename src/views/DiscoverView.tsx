import { BookOpen, Check, Coffee, SlidersHorizontal, Sun, UsersRound } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { ExperienceCard } from '../components/ExperienceCard'
import { FilterChip } from '../components/FilterChip'
import { PageHeader } from '../components/PageHeader'
import { SearchBar } from '../components/SearchBar'
import { categories, experiences } from '../data/experiences'
import { filterExperiences } from '../lib/discovery'

const categoryIcons = { outdoors: Sun, food: Coffee, study: BookOpen, socials: UsersRound }
const budgetOptions = [{ value: '', label: 'Any budget' }, { value: '0', label: 'Free' }, { value: '10', label: 'Under $10' }, { value: '25', label: 'Under $25' }, { value: '50', label: 'Under $50' }]
const distanceOptions = [{ value: '', label: 'Any distance' }, { value: '1', label: 'Within 1 mi' }, { value: '3', label: 'Within 3 mi' }, { value: '5', label: 'Within 5 mi' }]
const moodOptions = [{ value: '', label: 'Any mood' }, { value: 'relaxed', label: 'Relaxed' }, { value: 'adventurous', label: 'Adventurous' }, { value: 'social', label: 'Social' }, { value: 'focused', label: 'Focused' }]
const activityOptions = [{ value: '', label: 'All activities' }, ...categories.map((category) => ({ value: category.id, label: category.label }))]

function validOption(value: string | null, options: { value: string }[]) {
  return value !== null && options.some((option) => option.value === value) ? value : ''
}

export function DiscoverView() {
  const [params, setParams] = useSearchParams()
  const filters = {
    query: params.get('q') ?? '',
    budget: validOption(params.get('budget'), budgetOptions),
    distance: validOption(params.get('distance'), distanceOptions),
    mood: validOption(params.get('mood'), moodOptions),
    category: validOption(params.get('category'), activityOptions),
    showAll: params.get('all') === 'true',
  }
  const results = filterExperiences(experiences, filters)

  function updateFilter(key: string, value: string) {
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
  }

  return (
    <div className="discover-view">
      <PageHeader title="Sidequest" subtitle="Discover local experiences around campus" />
      <SearchBar value={filters.query} onChange={(value) => updateFilter('q', value)} />
      <div className="filter-row" aria-label="Discovery filters">
        <button type="button" className="filter-reset" aria-label="Clear all search and filters" title="Clear all search and filters" onClick={() => setParams({}, { replace: true })}><SlidersHorizontal size={16} aria-hidden="true" /></button>
        <FilterChip label="Budget" value={filters.budget} options={budgetOptions} highlighted onChange={(value) => updateFilter('budget', value)} />
        <FilterChip label="Distance" value={filters.distance} options={distanceOptions} onChange={(value) => updateFilter('distance', value)} />
        <FilterChip label="Mood" value={filters.mood} options={moodOptions} onChange={(value) => updateFilter('mood', value)} />
        <FilterChip label="Activity" value={filters.category} options={activityOptions} onChange={(value) => updateFilter('category', value)} />
      </div>
      <section className="categories-section" aria-labelledby="categories-heading">
        <h2 id="categories-heading">Categories</h2>
        <div className="category-grid">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id]
            const active = filters.category === category.id
            return <button type="button" key={category.id} className={`category-tile${active ? ' category-tile--active' : ''}`} aria-pressed={active} onClick={() => updateFilter('category', active ? '' : category.id)}><Icon size={21} aria-hidden="true" /><span>{category.label}</span>{active && <Check className="category-selected" size={12} aria-hidden="true" />}</button>
          })}
        </div>
      </section>
      <section className="recommendations-section" aria-labelledby="recommendations-heading">
        <div className="section-heading"><h2 id="recommendations-heading">{filters.showAll ? 'All Sidequests' : 'Recommended Sidequests'}</h2><button type="button" className="text-button" onClick={() => updateFilter('all', filters.showAll ? '' : 'true')}>{filters.showAll ? 'Recommended' : 'See all'}</button></div>
        <div className="experience-list">
          {results.map((experience) => <ExperienceCard key={experience.id} experience={experience} />)}
        </div>
        <p className="sr-only" role="status">{results.length} experiences found</p>
        {results.length === 0 && <div className="empty-state"><p>No Sidequests found.</p><p>Try another search or clear your filters.</p><Button onClick={() => setParams({}, { replace: true })}>Clear filters</Button></div>}
      </section>
    </div>
  )
}
