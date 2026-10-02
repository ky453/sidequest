import { Check } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { spendingValue } from '../lib/memories'
import { useSidequest } from '../state/sidequest-context'
import { Button } from './Button'
import { Modal } from './Modal'

export function ProfileModal({ budgetOnly, onClose }: { budgetOnly: boolean; onClose: () => void }) {
  const { profile, updateProfile } = useSidequest()
  const [name, setName] = useState(profile.name)
  const [year, setYear] = useState(profile.year)
  const [location, setLocation] = useState(profile.location)
  const [budget, setBudget] = useState(profile.monthlyBudget.toFixed(2))
  const [error, setError] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const monthlyBudget = spendingValue(budget)
      if (monthlyBudget === null) throw new Error('Enter your monthly budget, or enter 0 for no budget.')
      updateProfile({ name, year, location, monthlyBudget })
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to update your profile.')
    }
  }
  return <Modal title={budgetOnly ? 'Edit Monthly Budget' : 'Edit Profile'} onClose={onClose}>
    <form className="profile-form" onSubmit={submit} onChange={() => setError('')}>
      {!budgetOnly && <>
        <label className="memory-field">Name<input autoFocus required type="text" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="memory-field">Year<select aria-label="Year" value={year} onChange={(event) => setYear(event.target.value)}>
          <option value="">Not specified</option>
          {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].map((value) => <option key={value}>{value}</option>)}
        </select></label>
        <label className="memory-field">Location<input type="text" value={location} onChange={(event) => setLocation(event.target.value)} /></label>
      </>}
      <label className="memory-field">Monthly Budget<span className="memory-input-icon"><span aria-hidden="true">$</span><input aria-label="Monthly Budget" autoFocus={budgetOnly} required type="number" inputMode="decimal" min="0" step="0.01" value={budget} onChange={(event) => setBudget(event.target.value)} /></span></label>
      {error && <p className="memory-error" role="alert">{error}</p>}
      <div className="schedule-footer"><Button onClick={onClose}>Cancel</Button><Button variant="primary" type="submit"><Check size={16} aria-hidden="true" />Save Changes</Button></div>
    </form>
  </Modal>
}
