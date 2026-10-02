import { Image as ImageIcon } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { MemoryDetail } from '../components/MemoryDetail'
import { PageHeader } from '../components/PageHeader'
import { StarRating } from '../components/StarRating'
import { SearchBar } from '../components/SearchBar'
import { memoryDollars, memoryTimeRange, selectMemories } from '../lib/memories'
import { formatPlanDate } from '../lib/plans'
import { useSidequest } from '../state/sidequest-context'

export function MemoriesView() {
  const { memories } = useSidequest()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const ordered = selectMemories(memories, query)
  const selected = memories.find((memory) => memory.id === params.get('memory'))
  function closeDetail() {
    const next = new URLSearchParams(params)
    next.delete('memory')
    setParams(next, { replace: true })
  }
  return <div className="memories-view">
    <PageHeader title="Saved Memories" subtitle="Your timeline of completed local adventures" />
    <SearchBar label="Search memories" placeholder="Search memories..." value={query} onChange={(value) => {
      const next = new URLSearchParams(params)
      if (value) next.set('q', value)
      else next.delete('q')
      setParams(next, { replace: true })
    }} />
    <div className="memory-list">
      {ordered.map((memory) => <article className="memory-card" key={memory.id} aria-label={`Memory: ${memory.name}`} data-experience-id={memory.experienceId} data-plan-id={memory.planId}>
        <Link className="memory-card-open" aria-label={`View memory: ${memory.name}`} aria-haspopup="dialog" to={`/memories?${new URLSearchParams({ ...(query ? { q: query } : {}), memory: memory.id })}`}>
          <div className="memory-card-heading"><time dateTime={memory.date}>{formatPlanDate(memory.date, { month: 'long', day: 'numeric', year: 'numeric' })}</time><StarRating value={memory.rating} /></div>
          <div className="memory-card-summary">
            <div className="memory-preview">{memory.photo ? <img src={memory.photo.dataUrl} alt={memory.photo.name} /> : <><ImageIcon size={26} aria-hidden="true" /><span>Preview</span></>}</div>
            <div><h2>{memory.name}</h2><p>{[memory.amountSpent !== null ? `Spent ${memoryDollars.format(memory.amountSpent)}` : '', memory.people.length ? `With ${memory.people.join(', ')}` : ''].filter(Boolean).join(' \u2022 ')}</p>{memoryTimeRange(memory) && <p className="memory-card-time">{memoryTimeRange(memory)}</p>}</div>
          </div>
          {memory.journal && <blockquote><p>{memory.journal}</p></blockquote>}
        </Link>
      </article>)}
    </div>
    {!ordered.length && <p className="plans-empty" role="status">{memories.length ? 'No memories match your search.' : 'No memories yet.'}</p>}
    {selected && <MemoryDetail key={selected.id} memory={selected} readOnly={false} onClose={closeDetail} />}
    {params.has('memory') && !selected && <p className="plans-empty" role="status">Memory not found.</p>}
  </div>
}
