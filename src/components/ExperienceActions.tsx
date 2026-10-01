import { Bookmark } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSidequest } from '../state/sidequest-context'
import type { Experience } from '../types'
import { Button } from './Button'

export function ExperienceActions({ experience, layout = 'card', children }: {
  experience: Experience
  layout?: 'card' | 'detail'
  children?: ReactNode
}) {
  const { savedExperiences, plans, toggleSaved, togglePlanned } = useSidequest()
  const saved = savedExperiences.some((item) => item.experienceId === experience.id)
  const planned = plans.some((item) => item.experienceId === experience.id)
  const detail = layout === 'detail'

  const saveButton = (
    <Button
      aria-pressed={saved}
      aria-label={`${saved ? 'Unsave' : 'Save'}: ${experience.title}`}
      onClick={() => toggleSaved(experience.id)}
    >
      {detail && <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />}
      {saved ? 'Saved' : detail ? 'Save for Later' : 'Save'}
    </Button>
  )

  return (
    <div className={detail ? 'activity-actions' : 'experience-actions'}>
      <Button
        variant="primary"
        aria-pressed={planned}
        aria-label={`${planned ? 'Remove from plan' : 'Add to plan'}: ${experience.title}`}
        onClick={() => togglePlanned(experience.id)}
      >
        {planned ? 'Added to Plan' : 'Add to Plan'}
      </Button>
      {detail ? <div className="activity-secondary-actions">{saveButton}{children}</div> : saveButton}
    </div>
  )
}
