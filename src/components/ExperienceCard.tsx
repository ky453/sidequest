import { MapPin } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { categories } from '../data/experiences'
import { formatCost, formatDuration } from '../lib/discovery'
import { useSidequest } from '../state/sidequest-context'
import type { Experience } from '../types'
import { Button } from './Button'

export function ExperienceCard({ experience }: { experience: Experience }) {
  const { savedExperiences, plans, toggleSaved, togglePlanned } = useSidequest()
  const location = useLocation()
  const saved = savedExperiences.some((item) => item.experienceId === experience.id)
  const planned = plans.some((item) => item.experienceId === experience.id)
  const category = categories.find((item) => item.id === experience.category)?.label

  return (
    <article className="experience-card" aria-label={experience.title}>
      <Link className="experience-link" to={`/activities/${experience.id}`} state={{ from: location.pathname + location.search }} aria-label={`View ${experience.title}`}>
        <div className="experience-media">
          {experience.imageUrl && <img src={experience.imageUrl} alt={experience.title} />}
          <span className="category-badge">{category}</span>
        </div>
        <div className="experience-heading"><h3>{experience.title}</h3><span className="rating" aria-label={`Rated ${experience.rating} out of 5`}>{experience.rating.toFixed(1)}</span></div>
      </Link>
      <div className="experience-metrics">
        <span>{formatCost(experience.cost)}</span>
        <span>{formatDuration(experience.duration)}</span>
        <span>{experience.groupSize.min}-{experience.groupSize.max} people</span>
      </div>
      <p className="experience-distance"><MapPin size={14} aria-hidden="true" />{experience.distanceMiles.toFixed(1)} mi away</p>
      <div className="experience-actions">
        <Button variant="primary" aria-pressed={planned} aria-label={`${planned ? 'Remove from plan' : 'Add to plan'}: ${experience.title}`} onClick={() => togglePlanned(experience.id)}>{planned ? 'Added to Plan' : 'Add to Plan'}</Button>
        <Button aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'}: ${experience.title}`} onClick={() => toggleSaved(experience.id)}>{saved ? 'Saved' : 'Save'}</Button>
      </div>
    </article>
  )
}
