import { useState, useRef, useEffect } from 'react'
import { departments } from '../data/departments'
import useResponsive from '../hooks/useResponsive'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
  accentColor?: string
  showCode?: boolean
}

export default function DepartmentAutocomplete({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Nom du département...',
  accentColor = 'green',
  showCode = true,
}: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

    const { isMobile } = useResponsive()


  // Recherche par initiales des mots : "lo" matche "Loir-et-Cher", "Loire", "Lot"
  // "lo a" matche "Loire-Atlantique", "Lot-et-Garonne"
  const matchesByWordStart = (name: string, query: string): boolean => {
    if (!query.trim()) return false

    const normalizeStr = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const queryNorm = normalizeStr(query.trim())
    const nameNorm = normalizeStr(name)

    // Mots du nom (on ignore les petits mots de liaison)
    const words = nameNorm.split(/[\s-]+/).filter(w => w.length > 0)

    // Tokens de la query séparés par espaces
    const tokens = queryNorm.split(/\s+/).filter(t => t.length > 0)

    // Chaque token doit matcher le début d'un mot du nom
    // Les mots sont consommés dans l'ordre (token 1 → mot i, token 2 → mot j>i)
    let wordIndex = 0
    for (const token of tokens) {
      let matched = false
      while (wordIndex < words.length) {
        if (words[wordIndex].startsWith(token)) {
          matched = true
          wordIndex++
          break
        }
        wordIndex++
      }
      if (!matched) return false
    }
    return true
  }

  const suggestions = departments
    .filter(d => matchesByWordStart(d.name, value))
    .slice(0, 8)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (name: string) => {
    onChange(name)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      setOpen(false)
      onSubmit()
    }
    if (e.key === 'Escape') setOpen(false)
  }

  const borderColor = accentColor === 'yellow' ? 'focus:border-yellow-400' : 'focus:border-green-400'

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onKeyDown={handleKeyDown}
        onFocus={() => value.trim() && setOpen(true)}
        disabled={disabled}
        placeholder={placeholder}
        autoFocus
        className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none ${borderColor} transition disabled:opacity-50`}
      />
      {open && suggestions.length > 0 && (
        <ul className={`absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-y-auto ${isMobile ? "max-h-40" : "max-h-90"}`}>
          {suggestions.map(d => (
            <li
              key={d.code}
              onMouseDown={() => handleSelect(d.name)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
            >
              <span>{d.name}</span>
              {showCode && (
                <span className="text-gray-400 text-sm">{d.code}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}