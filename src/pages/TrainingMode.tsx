import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FranceMap from '../components/map/FranceMap'
import DepartmentAutocomplete from '../components/DepartmentAutocomplete'
import { useGameStore } from '../store/gameStore'

export default function TrainingMode() {
  const navigate = useNavigate()
  const {
    trainingQueue,
    currentTrainingIndex,
    trainingRevealed,
    initTraining,
    nextTraining,
    revealTraining,
    recordResult,
  } = useGameStore()

  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  useEffect(() => {
    if (trainingQueue.length === 0) initTraining()
  }, [initTraining, trainingQueue.length])

  const current = trainingQueue[currentTrainingIndex]
  if (!current) return null

  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

  const handleGuess = () => {
    const isCorrect = normalize(userInput) === normalize(current.name)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    recordResult(isCorrect)
    if (!isCorrect) revealTraining()
  }

  const handleNext = () => {
    setUserInput('')
    setFeedback(null)
    nextTraining()
  }

  return (
    <div className="min-h-screen bg-background-yellow-monSite flex flex-col">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-800 transition text-sm cursor-pointer"
        >
          ← Accueil
        </button>
        <h1 className="text-lg font-bold text-yellow-900">🎯 Mode Entraînement</h1>
        <div className="flex opacity-0">
          <span>← Accueil</span> {/* placeholder text */}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 p-4 max-w-6xl mx-auto w-full">

        {/* Carte */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 min-h-80">
          <FranceMap
            highlightedCode={current.code}
            correctCode={feedback === 'correct' ? current.code : undefined}
            revealCode={feedback === 'wrong' && trainingRevealed ? current.code : undefined}
          />
        </div>

        {/* Panel */}
        <div className="lg:w-80 flex flex-col gap-4">

          {/* Numéro */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">Département n°</p>
            <p className="text-6xl font-bold text-yellow-700">{current.code}</p>
          </div>

          {/* Input / Feedback */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
            {!feedback ? (
              <>
                <DepartmentAutocomplete
                  value={userInput}
                  onChange={v => setUserInput(v)}
                  onSubmit={handleGuess}
                  accentColor="yellow"
                  showCode={false}
                />
                <button
                  onClick={handleGuess}
                  disabled={!userInput.trim()}
                  className="bg-yellow-600 text-white py-3 rounded-xl font-semibold hover:bg-yellow-700 disabled:opacity-40 transition cursor-pointer"
                >
                  Valider
                </button>
                <button
                  onClick={() => { revealTraining(); recordResult(false) }}
                  className="text-gray-400 text-sm hover:text-gray-600 transition cursor-pointer"
                >
                  Je ne sais pas
                </button>
              </>
            ) : (
              <>
                {feedback === 'correct' ? (
                  <div className="text-center">
                    <p className="text-4xl mb-2">🎉</p>
                    <p className="text-green-700 font-bold text-xl">Bravo !</p>
                    <p className="text-gray-600 mt-1">{current.name}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-4xl mb-2">❌</p>
                    <p className="text-red-600 font-bold text-lg">C'était...</p>
                    <p className="text-gray-800 font-bold text-2xl mt-1">{current.name}</p>
                    <p className="text-gray-500 text-sm mt-1">Chef-lieu : {current.capital}</p>
                  </div>
                )}
                <button
                  onClick={handleNext}
                  className="bg-yellow-600 text-white py-3 rounded-xl font-semibold hover:bg-yellow-700 transition cursor-pointer"
                >
                  Suivant →
                </button>
              </>
            )}
          </div>

          {/* Infos révélées */}
          {trainingRevealed && (
            <div className="bg-yellow-100 rounded-2xl p-4 text-sm text-yellow-900">
              <p><span className="font-semibold">Région :</span> {current.region}</p>
              <p><span className="font-semibold">Chef-lieu :</span> {current.capital}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}