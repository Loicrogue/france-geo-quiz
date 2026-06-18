import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { departments, type Department } from '../data/departments'

interface GameStore {
  // Mode entraînement
  trainingQueue: Department[]
  currentTrainingIndex: number
  trainingRevealed: boolean

  // Stats
  streak: number
  totalCorrect: number
  totalSeen: number

  // Actions
  initTraining: () => void
  nextTraining: () => void
  revealTraining: () => void
  recordResult: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      trainingQueue: [],
      currentTrainingIndex: 0,
      trainingRevealed: false,
      streak: 0,
      totalCorrect: 0,
      totalSeen: 0,

      initTraining: () => set({
        trainingQueue: shuffle(departments),
        currentTrainingIndex: 0,
        trainingRevealed: false,
      }),

      nextTraining: () => {
        const { currentTrainingIndex, trainingQueue } = get()
        const next = currentTrainingIndex + 1
        if (next >= trainingQueue.length) {
          set({ trainingQueue: shuffle(departments), currentTrainingIndex: 0, trainingRevealed: false })
        } else {
          set({ currentTrainingIndex: next, trainingRevealed: false })
        }
      },

      revealTraining: () => set({ trainingRevealed: true }),

      recordResult: (correct: boolean) => set(state => ({
        totalSeen: state.totalSeen + 1,
        totalCorrect: correct ? state.totalCorrect + 1 : state.totalCorrect,
        streak: correct ? state.streak + 1 : 0,
      })),
    }),
    { name: 'france-geo-quiz' }
  )
)