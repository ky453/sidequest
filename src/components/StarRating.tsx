import { Star } from 'lucide-react'
import { useId } from 'react'

export function StarRating({ value, onChange }: { value: number | null; onChange?: (rating: number) => void }) {
  const group = useId()
  if (!onChange) return <span className="memory-rating-summary" role="img" aria-label={value === null ? 'Not rated' : `Rated ${value} out of 5`}>
    {value !== null && Array.from({ length: 5 }, (_, index) => <Star key={index} size={12} fill={index < value ? 'currentColor' : 'none'} aria-hidden="true" />)}
  </span>
  return <div className="star-rating" role="radiogroup" aria-label="Rating">
    {Array.from({ length: 5 }, (_, index) => {
      const rating = index + 1
      return <label key={rating} className={value !== null && rating <= value ? 'rating-star rating-star--selected' : 'rating-star'} title={`${rating} ${rating === 1 ? 'star' : 'stars'}`}>
        <input className="sr-only" type="radio" name={group} value={rating} aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`} checked={value === rating} onChange={() => onChange(rating)} />
        <Star size={24} fill={value !== null && rating <= value ? 'currentColor' : 'none'} aria-hidden="true" />
      </label>
    })}
  </div>
}
