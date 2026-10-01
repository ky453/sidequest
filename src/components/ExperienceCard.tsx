import { MapPin } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { categories } from '../data/experiences'
import { formatCost, formatDuration } from '../lib/discovery'
import type { Experience } from '../types'
import { ExperienceActions } from './ExperienceActions'

export function ExperienceCard({ experience }: { experience: Experience }) {
  const location = useLocation()
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
      <ExperienceActions experience={experience} />
    </article>
  )
}
