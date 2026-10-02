import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { MemoryForm } from '../components/MemoryForm'
import { useSidequest } from '../state/sidequest-context'

export function EditMemoryRoute() {
  const { memoryId } = useParams()
  const { memories, updateMemory } = useSidequest()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = `/memories${location.search}`
  const memory = memories.find((item) => item.id === memoryId)
  useEffect(() => { window.scrollTo(0, 0) }, [memoryId])
  if (!memory) return <div className="route-placeholder">
    <Link className="back-link" to={returnTo}><ArrowLeft size={20} aria-hidden="true" />Back to Memories</Link>
    <h1>Edit Memory</h1><p>Memory not found.</p>
  </div>
  return <MemoryForm key={memory.id} title="Edit Memory" initial={memory} returnTo={returnTo} onSave={(draft) => {
    updateMemory(memory.id, draft)
    navigate('/memories', { replace: true })
  }} />
}
