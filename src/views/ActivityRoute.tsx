import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { experiences } from '../data/experiences'

// This route is intentionally a placeholder until the detail screen is in scope.
export function ActivityRoute() {
  const { experienceId } = useParams()
  const location = useLocation()
  const experience = experiences.find((item) => item.id === experienceId)
  const from = typeof location.state?.from === 'string' && /^\/discover(?:\?|$)/.test(location.state.from) ? location.state.from : '/discover'

  return (
    <div className="route-placeholder">
      <Link className="back-link" to={from}><ArrowLeft size={20} aria-hidden="true" />Back to Discover</Link>
      <h1>{experience?.title ?? 'Page not found'}</h1>
      <p>{experience ? 'Activity details are coming soon.' : 'This Sidequest could not be found.'}</p>
    </div>
  )
}
