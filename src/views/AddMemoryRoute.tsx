import { ArrowLeft } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { experiences } from '../data/experiences'

export function AddMemoryRoute() {
  const [params] = useSearchParams()
  const experience = experiences.find((item) => item.id === params.get('experienceId'))
  return (
    <div className="route-placeholder">
      <Link className="back-link" to="/plans"><ArrowLeft size={20} aria-hidden="true" />Back to Plans</Link>
      <h1>Add Memory</h1>
      <p>{experience?.title ?? 'Activity not found'}</p>
      {experience && <p>The memory form is coming soon.</p>}
    </div>
  )
}
