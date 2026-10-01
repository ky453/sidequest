import { Bookmark } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useSidequest } from '../state/sidequest-context'
import type { Experience } from '../types'
import { Button } from './Button'
import { PlanModal } from './PlanModal'

export function ExperienceActions({ experience, layout = 'card', children }: {
  experience: Experience
  layout?: 'card' | 'detail'
  children?: ReactNode
}) {
  const { savedExperiences, plans, toggleSaved } = useSidequest()
  const [scheduling, setScheduling] = useState(false)
  const saved = savedExperiences.some((item) => item.experienceId === experience.id)
  const plan = plans.find((item) => item.experienceId === experience.id && item.status === 'planned')
  const planned = !!plan
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
        aria-label={`${planned ? 'Edit plan' : 'Add to plan'}: ${experience.title}`}
        aria-haspopup="dialog"
        title={planned ? 'Edit plan' : 'Add to plan'}
        onClick={() => setScheduling(true)}
      >
        {planned ? 'Added to Plan' : 'Add to Plan'}
      </Button>
      {detail ? <div className="activity-secondary-actions">{saveButton}{children}</div> : saveButton}
      {scheduling && <PlanModal experience={experience} plan={plan} onClose={() => setScheduling(false)} />}
    </div>
  )
}
