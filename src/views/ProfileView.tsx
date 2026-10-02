import { ChevronLeft, ChevronRight, Image as ImageIcon, Pencil, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MemoryDetail } from '../components/MemoryDetail'
import { PageHeader } from '../components/PageHeader'
import { ProfileModal } from '../components/ProfileModal'
import { memoryDollars } from '../lib/memories'
import { formatPlanDate, moveCalendarMonth, planDateKey } from '../lib/plans'
import { monthlySummary, profileMonth } from '../lib/profile'
import { useSidequest } from '../state/sidequest-context'

const remainingDollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function ProfileView() {
  const { profile, plans, memories } = useSidequest()
  const [params, setParams] = useSearchParams()
  const [currentMonth] = useState(() => planDateKey(new Date().toISOString()).slice(0, 7))
  const month = profileMonth(params.get('month'), currentMonth)
  const [editing, setEditing] = useState<'profile' | 'budget' | null>(null)
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null)
  const summary = monthlySummary(plans, memories, month, profile.monthlyBudget)
  const showAllSpending = params.get('spending') === 'all'
  const recentSpending = showAllSpending ? summary.spending : summary.spending.slice(0, 3)
  const selectedMemory = summary.favorites.find((memory) => memory.id === selectedMemoryId)
  const monthLabel = formatPlanDate(`${month}-01`, { month: 'long', year: 'numeric' })
  const period = month === currentMonth ? 'this month' : `in ${monthLabel}`
  useEffect(() => { window.scrollTo(0, 0) }, [])
  function changeMonth(offset: number) {
    const next = moveCalendarMonth(`${month}-01`, offset).slice(0, 7)
    if (next > currentMonth || !/^\d{4}-\d{2}$/.test(next)) return
    setParams(next === currentMonth ? {} : { month: next })
  }
  return <div className="profile-view">
    <PageHeader title="Profile" />
    <div className="profile-identity">
      <div className="profile-avatar" aria-hidden="true"><UserRound size={26} /></div>
      <div className="profile-bio"><h2>{profile.name}</h2><p>{[profile.year, profile.location].filter(Boolean).join(' \u2022 ')}</p></div>
      <button className="profile-edit" type="button" aria-label="Edit Profile" title="Edit Profile" onClick={() => setEditing('profile')}><Pencil size={16} aria-hidden="true" /></button>
    </div>
    <nav className="profile-month-nav" aria-label="Profile month">
      <button type="button" aria-label="Previous month" title="Previous month" onClick={() => changeMonth(-1)}><ChevronLeft size={18} aria-hidden="true" /></button>
      <h3 aria-live="polite">{monthLabel}</h3>
      <button type="button" disabled={month === currentMonth} aria-label="Next month" title={month === currentMonth ? 'Current month' : 'Next month'} onClick={() => changeMonth(1)}><ChevronRight size={18} aria-hidden="true" /></button>
    </nav>
    <section className="profile-spending-group" aria-labelledby="profile-budget-heading">
      <div className={`profile-budget${summary.remaining < 0 ? ' profile-budget--over' : ''}`}>
        <h3 id="profile-budget-heading">Budget Used {period}</h3>
        <button className="profile-edit profile-budget-edit" type="button" aria-label="Edit Monthly Budget" title="Edit Monthly Budget" onClick={() => setEditing('budget')}><Pencil size={15} aria-hidden="true" /></button>
        <div className="profile-budget-ring" role="progressbar" aria-label="Monthly budget used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary.budgetPercent} aria-valuetext={`${memoryDollars.format(summary.spent)} spent of ${memoryDollars.format(profile.monthlyBudget)} budget`} style={{ '--budget-progress': `${summary.budgetPercent}%` } as CSSProperties}>
          <div><strong data-testid="profile-spent">{memoryDollars.format(summary.spent)}</strong><span>of {memoryDollars.format(profile.monthlyBudget)} limit</span></div>
        </div>
        <p data-testid="profile-remaining">{summary.remaining < 0 ? `You are ${remainingDollars.format(-summary.remaining)} over your monthly budget.` : `You have ${remainingDollars.format(summary.remaining)} left for other activities.`}</p>
      </div>
      <section className="profile-recent-spending" aria-labelledby="profile-spending-heading">
        <div className="section-heading">
          <h2 id="profile-spending-heading">Recent Spending</h2>
          <button className="text-button" type="button" aria-expanded={showAllSpending} aria-controls="profile-spending-list" disabled={summary.spending.length <= 3} onClick={() => {
            const next = new URLSearchParams(params)
            if (showAllSpending) next.delete('spending')
            else next.set('spending', 'all')
            setParams(next, { replace: true })
          }}>{showAllSpending ? 'See less' : 'See all'}</button>
        </div>
        <dl className="profile-spending-list" id="profile-spending-list">
          {recentSpending.map((memory) => <div key={memory.id}>
            <dt><span>{memory.name}</span><time dateTime={memory.date}>{formatPlanDate(memory.date, { month: 'short', day: 'numeric' })}</time></dt>
            <dd>{memoryDollars.format(memory.amountSpent ?? 0)}</dd>
          </div>)}
        </dl>
        {!summary.spending.length && <p className="plans-empty" role="status">No spending recorded for {monthLabel}.</p>}
      </section>
    </section>
    <section className="profile-summary" aria-labelledby="profile-summary-heading">
      <h2 id="profile-summary-heading">Monthly Summary</h2>
      <dl className="profile-stats">
        <div><dd data-testid="profile-activities">{summary.activitiesDone}</dd><dt>Activities done</dt></div>
        <div><dd data-testid="profile-places">{summary.newPlaces}</dd><dt>New places visited</dt></div>
        <div><dd data-testid="profile-rating">{summary.averageRating === null ? '0' : summary.averageRating.toFixed(1)}</dd><dt>Avg experience rating</dt></div>
      </dl>
    </section>
    <section className="profile-favorites" aria-labelledby="profile-favorites-heading">
      <h2 id="profile-favorites-heading">Favorite Memories</h2>
      <div className="profile-memory-list">
        {summary.favorites.map((memory) => <button className="profile-memory" type="button" key={memory.id} aria-label={`View memory: ${memory.name}`} aria-haspopup="dialog" onClick={() => setSelectedMemoryId(memory.id)}>
          <div className="profile-memory-preview">{memory.photo ? <img src={memory.photo.dataUrl} alt={memory.photo.name} /> : <><ImageIcon size={26} aria-hidden="true" /><span>Mini</span></>}</div>
          <div className="profile-memory-copy"><h3>{memory.name}</h3><p><time dateTime={memory.date}>{formatPlanDate(memory.date, { month: 'short', day: 'numeric' })}</time>{` \u2022 ${memory.rating === null ? 'Not rated' : `${memory.rating}/5 stars`}`}</p></div>
          <ChevronRight size={18} aria-hidden="true" />
        </button>)}
      </div>
      {!summary.favorites.length && <p className="plans-empty" role="status">No memories for {monthLabel}.</p>}
    </section>
    {editing && <ProfileModal budgetOnly={editing === 'budget'} onClose={() => setEditing(null)} />}
    {selectedMemory && <MemoryDetail key={selectedMemory.id} memory={selectedMemory} readOnly onClose={() => setSelectedMemoryId(null)} />}
  </div>
}
