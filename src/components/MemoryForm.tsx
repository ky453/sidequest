import { ArrowLeft, CalendarDays, Check, Clock, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './Button'
import { StarRating } from './StarRating'
import { addPerson, photoAccept, photoProblem, readMemoryPhoto, spendingValue } from '../lib/memories'
import type { MemoryDraft, MemoryPhoto } from '../types'

export function MemoryForm({ initial, onSave, title = 'Add Memory', returnTo = '/plans' }: {
  initial: MemoryDraft
  onSave: (draft: MemoryDraft) => void
  title?: 'Add Memory' | 'Edit Memory'
  returnTo?: string
}) {
  const navigate = useNavigate()
  const [name, setName] = useState(initial.name)
  const [date, setDate] = useState(initial.date)
  const [startTime, setStartTime] = useState(initial.startTime ?? '')
  const [endTime, setEndTime] = useState(initial.endTime ?? '')
  const [rating, setRating] = useState(initial.rating)
  const [people, setPeople] = useState([...initial.people])
  const [addingPerson, setAddingPerson] = useState(false)
  const [personName, setPersonName] = useState('')
  const [journal, setJournal] = useState(initial.journal)
  const [spending, setSpending] = useState(initial.amountSpent === null ? '' : initial.amountSpent.toFixed(2))
  const [photo, setPhoto] = useState<MemoryPhoto | undefined>(initial.photo)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const peopleField = useRef<HTMLFieldSetElement>(null)
  const photoButton = useRef<HTMLButtonElement>(null)
  const photoRequest = useRef(0)
  const backLabel = title === 'Edit Memory' ? 'Back to Memories' : 'Back to Plans'
  useEffect(() => () => { photoRequest.current += 1 }, [])

  function restorePeopleFocus() {
    queueMicrotask(() => peopleField.current?.querySelector<HTMLElement>('.add-friend-button, input')?.focus({ preventScroll: true }))
  }

  function cancelPerson() {
    setAddingPerson(false)
    setPersonName('')
    restorePeopleFocus()
  }

  function commitPerson() {
    if (!personName.trim()) return
    setPeople((current) => addPerson(current, personName))
    cancelPerson()
  }

  async function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const request = ++photoRequest.current
    const problem = photoProblem(file)
    setPhotoError(problem ?? '')
    setPhotoLoading(!problem)
    if (problem) return
    try {
      const selected = await readMemoryPhoto(file)
      if (photoRequest.current === request) setPhoto(selected)
    } catch (error) {
      if (photoRequest.current === request) setPhotoError(error instanceof Error ? error.message : 'Unable to open this photo.')
    } finally {
      if (photoRequest.current === request) setPhotoLoading(false)
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (photoLoading) return
    try {
      onSave({ name, date, startTime: startTime || null, endTime: endTime || null, rating, people: addPerson(people, personName), journal, amountSpent: spendingValue(spending), photo })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to save this memory.')
    }
  }

  return <div className="add-memory-view">
    <header className="memory-header">
      <Link className="activity-back" to={returnTo} aria-label={backLabel} title={backLabel}><ArrowLeft size={17} aria-hidden="true" /></Link>
      <h1>{title}</h1>
    </header>
    <form className="memory-form" onSubmit={submit}>
      <label className="memory-field">Place or Activity<input required type="text" value={name} onChange={(event) => { setName(event.target.value); setError('') }} /></label>
      <div className="memory-date-spending">
        <label className="memory-field">Date<span className="memory-input-icon"><CalendarDays size={15} aria-hidden="true" /><input required type="date" value={date} onChange={(event) => { setDate(event.target.value); setError('') }} /></span></label>
        <label className="memory-field">Spending<span className="memory-input-icon"><span aria-hidden="true">$</span><input type="number" inputMode="decimal" min="0" step="0.01" aria-label="Spending" placeholder="0.00" value={spending} onChange={(event) => { setSpending(event.target.value); setError('') }} /></span></label>
      </div>
      <div className="memory-time-range">
        <label className="memory-field">Start Time<span className="memory-input-icon"><Clock size={15} aria-hidden="true" /><input type="time" value={startTime} onChange={(event) => { setStartTime(event.target.value); setError('') }} /></span></label>
        <label className="memory-field">End Time<span className="memory-input-icon"><Clock size={15} aria-hidden="true" /><input type="time" value={endTime} onChange={(event) => { setEndTime(event.target.value); setError('') }} /></span></label>
      </div>
      <fieldset className="memory-field memory-fieldset"><legend>Rating</legend><StarRating value={rating} onChange={setRating} /></fieldset>
      <fieldset ref={peopleField} className="memory-field memory-fieldset"><legend>People With You</legend>
        <div className="memory-people">
          {people.map((person) => <span className="person-chip" key={person}><span>{person}</span><button type="button" aria-label={`Remove ${person}`} title={`Remove ${person}`} onClick={() => { setPeople((current) => current.filter((name) => name !== person)); restorePeopleFocus() }}><X size={12} aria-hidden="true" /></button></span>)}
          {!addingPerson && <Button className="add-friend-button" onClick={() => setAddingPerson(true)}><Plus size={11} aria-hidden="true" />Add Friend</Button>}
        </div>
        {addingPerson && <div className="person-editor">
          <input type="text" aria-label="Friend name" placeholder="Name" autoFocus value={personName} onChange={(event) => setPersonName(event.target.value)} onKeyDown={(event) => {
            if (event.key === 'Enter') { event.preventDefault(); commitPerson() }
            if (event.key === 'Escape') { event.preventDefault(); cancelPerson() }
          }} />
          <button type="button" className="person-editor-action" title="Add friend" aria-label="Add friend" disabled={!personName.trim()} onClick={commitPerson}><Check size={18} aria-hidden="true" /></button>
          <button type="button" className="person-editor-action" title="Cancel adding friend" aria-label="Cancel adding friend" onClick={cancelPerson}><X size={18} aria-hidden="true" /></button>
        </div>}
      </fieldset>
      <label className="memory-field">Journal Note<textarea aria-label="Journal Note" rows={4} value={journal} onChange={(event) => setJournal(event.target.value)} /></label>
      <div className="memory-field">
        <span>Attach Photo</span>
        <input ref={fileInput} className="sr-only" tabIndex={-1} type="file" accept={photoAccept} aria-label="Attach photo" onChange={selectPhoto} />
        <button ref={photoButton} className={`memory-photo-placeholder${photo ? ' memory-photo-placeholder--filled' : ''}`} type="button" aria-label={photo ? 'Replace photo' : 'Select photo'} onClick={() => fileInput.current?.click()}>
          {photo ? <img src={photo.dataUrl} alt={photo.name} /> : <><ImageIcon size={28} aria-hidden="true" /><span>{photoLoading ? 'Opening photo...' : 'Tap to upload media'}</span></>}
        </button>
        {photo && <div className="memory-photo-caption"><span>{photo.name}</span><button type="button" title="Remove photo" aria-label="Remove photo" onClick={() => { photoRequest.current += 1; setPhoto(undefined); setPhotoLoading(false); setPhotoError(''); photoButton.current?.focus({ preventScroll: true }) }}><Trash2 size={16} aria-hidden="true" /></button></div>}
        {photoError && <p className="memory-error" role="alert">{photoError}</p>}
      </div>
      {error && <p className="memory-error" role="alert">{error}</p>}
      <div className="memory-form-actions"><Button onClick={() => navigate(returnTo)}>Cancel</Button><Button variant="primary" type="submit" disabled={photoLoading}><Check size={16} aria-hidden="true" />{title === 'Edit Memory' ? 'Save Changes' : 'Save Memory'}</Button></div>
    </form>
  </div>
}
