import { departments } from '../data/departments'

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

export type GuessValidation =
  | { status: 'valid'; resolvedName: string }
  | { status: 'ambiguous'; count: number; query: string }
  | { status: 'not_found'; query: string }

export function validateGuessInput(input: string): GuessValidation {
  const query = input.trim()
  if (!query) return { status: 'not_found', query }

  // Correspondance exacte en priorité
  const exact = departments.find(d => normalize(d.name) === normalize(query))
  if (exact) return { status: 'valid', resolvedName: exact.name }

  // Correspondance par début de mot (même logique que l'autocomplete)
  const matchesByWordStart = (name: string): boolean => {
    const queryNorm = normalize(query)
    const nameNorm = normalize(name)
    const words = nameNorm.split(/[\s-]+/).filter(w => w.length > 0)
    const tokens = queryNorm.split(/\s+/).filter(t => t.length > 0)
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

  const matches = departments.filter(d => matchesByWordStart(d.name))

  if (matches.length === 1) {
    // Une seule correspondance → on autocomplète
    return { status: 'valid', resolvedName: matches[0].name }
  }

  if (matches.length > 1) {
    // Plusieurs correspondances → ambigu
    return { status: 'ambiguous', count: matches.length, query }
  }

  // Aucune correspondance
  return { status: 'not_found', query }
}