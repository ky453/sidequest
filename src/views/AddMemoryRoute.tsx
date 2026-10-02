import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { MemoryForm } from '../components/MemoryForm'
import { experiences } from '../data/experiences'
import { useSidequest } from '../state/sidequest-context'

export function AddMemoryRoute() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { plans, memories, saveMemory } = useSidequest()
  const plan = plans.find((item) => item.id === params.get('planId') && item.experienceId === params.get('experienceId') && item.status === 'completed')
  const experience = experiences.find((item) => item.id === plan?.experienceId)
  const existing = memories.some((memory) => memory.planId === plan?.id)
  useEffect(() => { window.scrollTo(0, 0) }, [plan?.id])
  if (!plan || !experience || existing) return <div className="route-placeholder">
    <Link className="back-link" to="/plans"><ArrowLeft size={20} aria-hidden="true" />Back to Plans</Link>
    <h1>Add Memory</h1>
    <p>{existing ? 'A memory has already been saved for this plan.' : 'Completed plan not found.'}</p>
    {existing && <Link className="button button--primary" to="/memories">View Memories</Link>}
  </div>
  return <MemoryForm key={plan.id} initial={{ name: experience.title, date: plan.plannedDate, startTime: plan.startTime, endTime: plan.endTime, rating: null, people: [], journal: '', amountSpent: null }} onSave={(draft) => {
    saveMemory(plan.id, draft)
    navigate('/memories', { replace: true })
  }} />
}
