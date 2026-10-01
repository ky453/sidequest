import { Image } from 'lucide-react'
import type { Experience } from '../types'

export function ExperienceHero({ experience }: { experience: Experience }) {
  return (
    <div className="activity-hero">
      {experience.imageUrl ? (
        <img src={experience.imageUrl} alt={experience.imageDescription ?? experience.title} />
      ) : (
        <div className="activity-hero-placeholder">
          <Image size={28} strokeWidth={1.8} aria-hidden="true" />
          <p>{experience.imageDescription ?? `${experience.title} - Preview`}</p>
        </div>
      )}
    </div>
  )
}
