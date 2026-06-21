import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { departments, type Department } from '../data/departments'
import { getDailyDepartment, getTodayKey } from '../utils/dailySeed'

interface DailyState {
  todayKey: string
  department: Department
  guesses: string[]
  status: 'playing' | 'won' | 'lost'
}

interface TrainingResult {
  code: string
  correct: boolean
}

interface GameStore {
  // Mode entraînement
  trainingQueue: Department[]
  currentTrainingIndex: number
  trainingRevealed: boolean
  trainingHistory: TrainingResult[]

  // Mode daily
  daily: DailyState | null
  streakDaily: number
  dailyRevealed: boolean

  // Actions entraînement
  initTraining: () => void
  nextTraining: () => void
  revealTraining: () => void
  recordResultTraining: (correct: boolean) => void
  
  // Actions daily
  initDaily: () => void
  revealDaily: () => void
  recordResultDaily: (correct: boolean) => void
  submitDailyGuess: (guess: string) => 'correct' | 'wrong' | 'already_guessed'
  nextDaily: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const MAX_GUESSES = 10

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      trainingQueue: [],
      currentTrainingIndex: 0,
      trainingRevealed: false,
      trainingHistory: [],
      dailyRevealed: false,
      streakDaily: 0,
      daily: null,

      initTraining: () => set({
        trainingQueue: shuffle(departments),
        currentTrainingIndex: 0,
        trainingRevealed: false,
        trainingHistory: [],
      }),

      nextTraining: () => {
        const { currentTrainingIndex, trainingQueue } = get()
        const next = currentTrainingIndex + 1
        if (next >= trainingQueue.length) {
          // Tous les départements faits → on repart avec une liste vierge
          set({
            trainingQueue: shuffle(departments),
            currentTrainingIndex: 0,
            trainingRevealed: false,
            trainingHistory: [],
          })
        } else {
          set({ currentTrainingIndex: next, trainingRevealed: false })
        }
      },

      revealTraining: () => set({ trainingRevealed: true }),

      recordResultTraining: (correct) => {
        const { trainingQueue, currentTrainingIndex } = get()
        const current = trainingQueue[currentTrainingIndex]
        set(state => ({
          trainingHistory: [
            ...state.trainingHistory,
            { code: current.code, correct }
          ],
        }))
      },

      nextDaily: () => set({ dailyRevealed: false }),
      revealDaily: () => set({ dailyRevealed: true }),

      recordResultDaily: (correct) => set(state => ({
        streakDaily: correct ? state.streakDaily + 1 : 0,
      })),

      initDaily: () => {
        const todayKey = getTodayKey()
        const existing = get().daily
        if (existing?.todayKey === todayKey) return
        set({
          daily: {
            todayKey,
            department: getDailyDepartment(),
            guesses: [],
            status: 'playing',
          }
        })
      },

      submitDailyGuess: (guess) => {
        const { daily } = get()
        if (!daily || daily.status !== 'playing') return 'wrong'

        const normalize = (s: string) =>
          s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

        if (daily.guesses.some(g => normalize(g) === normalize(guess))) {
          return 'already_guessed'
        }

        const isCorrect = normalize(guess) === normalize(daily.department.name)
        const newGuesses = [...daily.guesses, guess]
        const newStatus = isCorrect
          ? 'won'
          : newGuesses.length >= MAX_GUESSES
            ? 'lost'
            : 'playing'

        set({ daily: { ...daily, guesses: newGuesses, status: newStatus } })
        return isCorrect ? 'correct' : 'wrong'
      },
    }),
    { name: 'france-geo-quiz' }
  )
)