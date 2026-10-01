import { Search, X } from 'lucide-react'

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="search-bar" role="search">
      <Search size={18} aria-hidden="true" />
      <input type="search" aria-label="Search experiences" placeholder={'Try "sunset cliff hikes" or "cheap boba"...'} value={value} onChange={(event) => onChange(event.target.value)} />
      {value && <button type="button" className="search-clear" aria-label="Clear search" title="Clear search" onClick={() => onChange('')}><X size={16} aria-hidden="true" /></button>}
    </div>
  )
}
