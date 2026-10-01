import { ArrowLeft, Check, Share2, Star } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { ExperienceActions } from '../components/ExperienceActions'
import { ExperienceHero } from '../components/ExperienceHero'
import { categories, experiences } from '../data/experiences'
import { formatCost, formatDuration } from '../lib/discovery'
import type { Experience } from '../types'

export function ActivityRoute() {
  const { experienceId } = useParams()
  const location = useLocation()
  const experience = experiences.find((item) => item.id === experienceId)
  const from = typeof location.state?.from === 'string' && /^\/discover(?:\?|$)/.test(location.state.from) ? location.state.from : '/discover'

  if (!experience) {
    return (
      <div className="route-placeholder">
        <Link className="back-link" to={from}><ArrowLeft size={20} aria-hidden="true" />Back to Discover</Link>
        <h1>Page not found</h1>
        <p>This Sidequest could not be found.</p>
      </div>
    )
  }

  return <ActivityDetails key={experience.id} experience={experience} from={from} />
}

function ActivityDetails({ experience, from }: { experience: Experience; from: string }) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [experience.id])
  const category = categories.find((item) => item.id === experience.category)?.label
  const eventDate = experience.startsAt ? new Date(experience.startsAt) : null
  const eventDateLabel = eventDate && new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    timeZone: 'America/New_York', timeZoneName: 'short',
  }).format(eventDate)

  async function copyActivityLink() {
    try {
      await navigator.clipboard.writeText(new URL(`/activities/${experience.id}`, window.location.origin).href)
      setShareStatus('copied')
    } catch {
      setShareStatus('error')
    }
  }

  return (
    <article className="activity-details" aria-labelledby="activity-title">
      <header className="activity-header">
        <Link className="activity-back" to={from} aria-label="Back to Discover" title="Back to Discover">
          <ArrowLeft size={17} aria-hidden="true" />
        </Link>
        <p>Activity Details</p>
      </header>

      <ExperienceHero experience={experience} />

      <div className="activity-summary">
        <div className="activity-tags">
          <span className="category-badge">{category}</span>
          <span className="activity-rating" aria-label={`Rated ${experience.rating} out of 5, ${experience.reviewCount} reviews`}>
            <Star size={14} strokeWidth={2.5} aria-hidden="true" />
            {experience.rating} ({experience.reviewCount} reviews)
          </span>
        </div>
        <h1 id="activity-title">{experience.title}</h1>
        <p className="activity-location">{experience.distanceMiles} miles away from Campus <span aria-hidden="true">&bull;</span> {experience.location}</p>
      </div>

      <dl className="activity-facts">
        <div><dt>Est. Cost</dt><dd>{formatCost(experience.cost, true)}</dd></div>
        <div><dt>Duration</dt><dd>{formatDuration(experience.duration, 'long')}</dd></div>
        <div><dt>Group Size</dt><dd>{experience.groupSize.min}-{experience.groupSize.max} People</dd></div>
      </dl>

      <section className="activity-about" aria-labelledby="activity-about-title">
        <h2 id="activity-about-title">About this Sidequest</h2>
        <p>{experience.description}</p>
        {eventDateLabel && <p className="activity-event-date"><time dateTime={experience.startsAt}>{eventDateLabel}</time></p>}
      </section>

      <ExperienceActions experience={experience} layout="detail">
        <Button
          className="activity-share"
          aria-label={shareStatus === 'copied' ? 'Copy activity link again' : 'Copy activity link'}
          title={shareStatus === 'copied' ? 'Link copied' : 'Copy activity link'}
          onClick={copyActivityLink}
        >
          {shareStatus === 'copied' ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}
        </Button>
      </ExperienceActions>
      <p className={shareStatus === 'error' ? 'activity-share-error' : 'sr-only'} role="status">
        {shareStatus === 'copied' ? 'Activity link copied.' : shareStatus === 'error' ? 'Unable to copy the link. You can copy the page address instead.' : ''}
      </p>
    </article>
  )
}
