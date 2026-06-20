import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FranceMap from '../components/map/FranceMap'
import DepartmentAutocomplete from '../components/DepartmentAutocomplete'
import { useGameStore } from '../store/gameStore'
import { departments } from '../data/departments'
import useResponsive from '../hooks/useResponsive'

const MAX_GUESSES = 10

export default function DailyMode() {
  const navigate = useNavigate()
  const { 
    streak,
    initDaily, 
    submitDailyGuess,
    recordResult
  } = useGameStore()
  const { isMobile } = useResponsive()
  
  // On lit daily directement à chaque render sans le destructurer
  const daily = useGameStore(state => state.daily)
  
  const [userInput, setUserInput] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'info' } | null>(null)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    initDaily()
  }, [initDaily])

  if (!daily) return null

  const { department, guesses, status } = daily
  const isFinished = status !== 'playing'
  const attemptsLeft = MAX_GUESSES - guesses.length

  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

  // Codes des mauvais guesses pour colorier la carte en rouge
  const wrongCodes = guesses
    .filter(g => normalize(g) !== normalize(department.name))
    .map(g => departments.find(d => normalize(d.name) === normalize(g))?.code ?? '')
    .filter(Boolean)

  const handleGuess = () => {
    if (!userInput.trim() || isFinished) return
    
    const result = submitDailyGuess(userInput.trim())

    if (result === 'already_guessed') {
      setMessage({ text: 'Tu as déjà proposé ce département !', type: 'info' })
      return
    }

    const updatedDaily = useGameStore.getState().daily
    const newStatus = updatedDaily?.status ?? 'playing'
    const newGuesses = updatedDaily?.guesses ?? []
    const remaining = MAX_GUESSES - newGuesses.length

    if (result === 'correct') {
      recordResult(true)
      setMessage({ text: '🎉 Bravo, bonne réponse !', type: 'info' })
    } else if (newStatus === 'lost') {
      recordResult(false)
      setMessage({ text: `💀 Perdu ! C'était ${department.name}`, type: 'error' })
    } else {
      setMessage({ text: `❌ Raté ! Il te reste ${remaining} essai${remaining > 1 ? 's' : ''}`, type: 'error' })
    }

    setUserInput('')
  }

  return (
    <div className="min-h-screen bg-background-green-monSite flex flex-col">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800 transition text-sm cursor-pointer">
          ← Accueil
        </button>
        <h1 className="text-lg font-bold text-green-900">🗓️ Département du Jour</h1>
        <span>{isMobile ? "" : "Série de "}{streak} {streak <= 1 ? "jour" : "jours"}  🔥</span>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-4 p-4 max-w-6xl mx-auto w-full">

        {/* Carte */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 min-h-80">
          <FranceMap
            correctCode={status === 'won' ? department.code : undefined}
            revealCode={status === 'lost' ? department.code : undefined}
            wrongCodes={wrongCodes}
          />
        </div>

        {/* Panel */}
        <div className="lg:w-80 flex flex-col gap-4">

          {/* Essais */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-500 text-sm mb-3 text-center">Essais</p>
            <div className="grid grid-cols-5 gap-2 mb-4 justify-items-center">
              {Array.from({ length: MAX_GUESSES }).map((_, i) => {
                if (i < guesses.length) {
                  const isWon = status === 'won' && i === guesses.length - 1
                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        isWon ? 'bg-green-500' : 'bg-red-400'
                      }`}
                    >
                      {isWon ? '✓' : '✗'}
                    </div>
                  )
                }
                return <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-200" />
              })}
            </div>
            <div className="flex flex-col gap-1">
              {guesses.map((g, i) => {
                const isCorrect = normalize(g) === normalize(department.name)
                return (
                  <div key={i} className={`text-sm px-3 py-1 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isCorrect ? '✓' : '✗'} {g}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Input ou résultat */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
            {!isFinished ? (
              <>
                  {message && (
                    <p className={`text-sm text-center ${message.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                      {message.text}
                    </p>
                  )}
                  <DepartmentAutocomplete
                    value={userInput}
                    onChange={v => { setUserInput(v); setMessage(null) }}
                    onSubmit={handleGuess}
                    accentColor="green"
                    disabled={isFinished}
                  />
                  <button
                    onClick={handleGuess}
                    disabled={!userInput.trim() || isFinished}
                    className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-40 transition cursor-pointer"
                  >
                    Valider ({attemptsLeft} essai{attemptsLeft > 1 ? 's' : ''} restant{attemptsLeft > 1 ? 's' : ''})
                  </button>
                </>
            ) : (
              <div className="text-center flex flex-col gap-3">
                {status === 'won' ? (
                  <>
                    <p className="text-4xl">🏆</p>
                    <p className="text-green-700 font-bold text-xl">Félicitations !</p>
                    <p className="text-gray-600">Trouvé en {guesses.length} essai{guesses.length > 1 ? 's' : ''}</p>
                  </>
                ) : (
                  <>
                    <p className="text-4xl">😔</p>
                    <p className="text-red-600 font-bold text-xl">Perdu !</p>
                    <p className="text-gray-600">C'était le</p>
                    <p className="text-gray-900 font-bold text-2xl">{department.name}</p>
                  </>
                )}
                <div className="bg-gray-50 rounded-xl p-3 text-sm text-left text-gray-600 mt-2">
                  <p><span className="font-semibold">Numéro :</span> {department.code}</p>
                  <p><span className="font-semibold">Chef-lieu :</span> {department.capital}</p>
                  <p><span className="font-semibold">Région :</span> {department.region}</p>
                </div>
                <p className="text-gray-400 text-xs">Reviens demain pour un nouveau département !</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}