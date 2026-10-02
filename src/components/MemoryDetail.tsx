import { Image as ImageIcon, Pencil, Trash2 } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { memoryDollars, memoryTimeRange } from '../lib/memories'
import { formatPlanDate } from '../lib/plans'
import { useSidequest } from '../state/sidequest-context'
import type { Memory } from '../types'
import { Button } from './Button'
import { Modal } from './Modal'
import { StarRating } from './StarRating'

export function MemoryDetail({ memory, onClose, readOnly = true }: { memory: Memory; onClose: () => void; readOnly?: boolean }) {
  const { deleteMemory } = useSidequest()
  const location = useLocation()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const deleting = !readOnly && confirmDelete
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { if (!deleting) heading.current?.focus() }, [deleting])
  return <Modal title={deleting ? 'Delete Memory' : 'Memory Detail'} onClose={onClose}>
    {deleting ? <div className="memory-delete-confirmation">
      <p>Delete &quot;{memory.name}&quot;? This memory and its local photo will be removed.</p>
      <div className="memory-detail-actions">
        <Button autoFocus onClick={() => setConfirmDelete(false)}>Cancel</Button>
        <Button className="memory-delete-button" onClick={() => { deleteMemory(memory.id); onClose() }}><Trash2 size={16} aria-hidden="true" />Confirm Delete</Button>
      </div>
    </div> : <div className="memory-detail">
      <div className="memory-detail-photo">{memory.photo ? <img src={memory.photo.dataUrl} alt={memory.photo.name} /> : <><ImageIcon size={32} aria-hidden="true" /><span>No photo attached.</span></>}</div>
      <h3 ref={heading} tabIndex={-1}>{memory.name}</h3>
      <p className="memory-detail-date"><time dateTime={memory.date}>{formatPlanDate(memory.date, { month: 'long', day: 'numeric', year: 'numeric' })}</time></p>
      <dl className="memory-detail-facts">
        <div><dt>Rating</dt><dd><StarRating value={memory.rating} /><span>{memory.rating === null ? 'Not rated' : `${memory.rating} / 5`}</span></dd></div>
        <div><dt>Spending</dt><dd>{memory.amountSpent === null ? 'Not recorded' : memoryDollars.format(memory.amountSpent)}</dd></div>
        <div><dt>Time</dt><dd>{memoryTimeRange(memory) || 'Not recorded'}</dd></div>
        <div><dt>People With You</dt><dd>{memory.people.length ? memory.people.join(', ') : 'Not recorded'}</dd></div>
      </dl>
      <section className="memory-detail-journal"><h4>Journal Note</h4><p>{memory.journal || 'No journal note.'}</p></section>
      {!readOnly && <div className="memory-detail-actions">
        <Link className="button button--primary" to={`/memories/${encodeURIComponent(memory.id)}/edit${location.search}`}><Pencil size={16} aria-hidden="true" />Edit Memory</Link>
        <Button className="memory-delete-button" onClick={() => setConfirmDelete(true)}><Trash2 size={16} aria-hidden="true" />Delete Memory</Button>
      </div>}
    </div>}
  </Modal>
}
