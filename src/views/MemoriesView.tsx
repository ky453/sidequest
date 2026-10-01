import { Image as ImageIcon } from 'lucide-react'
import { useEffect } from 'react'
import { PageHeader } from '../components/PageHeader'
import { StarRating } from '../components/StarRating'
import { formatPlanDate, formatPlanTime } from '../lib/plans'
import { useSidequest } from '../state/sidequest-context'

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

export function MemoriesView() {
  const { memories } = useSidequest()
  const ordered = [...memories].sort((left, right) => right.date.localeCompare(left.date) || right.createdAt.localeCompare(left.createdAt))
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return <div className="memories-view">
    <PageHeader title="Saved Memories" subtitle="Your timeline of completed local adventures" />
    <div className="memory-list">
      {ordered.map((memory) => <article className="memory-card" key={memory.id} aria-label={`Memory: ${memory.name}`} data-experience-id={memory.experienceId} data-plan-id={memory.planId}>
        <div className="memory-card-heading"><time dateTime={memory.date}>{formatPlanDate(memory.date, { month: 'long', day: 'numeric', year: 'numeric' })}</time><StarRating value={memory.rating} /></div>
        <div className="memory-card-summary">
          <div className="memory-preview">{memory.photo ? <img src={memory.photo.dataUrl} alt={memory.photo.name} /> : <><ImageIcon size={26} aria-hidden="true" /><span>Preview</span></>}</div>
          <div><h2>{memory.name}</h2><p>{[memory.startTime && memory.endTime ? `${formatPlanTime(memory.startTime)} - ${formatPlanTime(memory.endTime)} ET` : '', memory.amountSpent !== null ? `Spent ${dollars.format(memory.amountSpent)}` : '', memory.people.length ? `With ${memory.people.join(', ')}` : ''].filter(Boolean).join(' \u2022 ')}</p></div>
        </div>
        {memory.journal && <blockquote>{memory.journal}</blockquote>}
      </article>)}
    </div>
    {!ordered.length && <p className="plans-empty">No memories yet.</p>}
  </div>
}
