import { ChevronDown } from 'lucide-react'

export interface FilterOption { value: string; label: string }

export function FilterChip({ label, value, options, onChange, highlighted = false }: {
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  highlighted?: boolean
}) {
  const selected = options.find((option) => option.value === value)
  return (
    <label className={`filter-chip${value || highlighted ? ' filter-chip--active' : ''}`}>
      <span aria-hidden="true">{value ? selected?.label : label}</span>
      <ChevronDown size={12} aria-hidden="true" />
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}
