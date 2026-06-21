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
    streakDaily,
    dailyRevealed,
    initDaily, 
    submitDailyGuess,
    recordResultDaily,
    revealDaily,
    nextDaily,
  } = useGameStore()
  const { isMobile } = useResponsive()
  
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
    
    if (remaining == 5) {revealDaily();}

    if (result === 'correct') {
      recordResultDaily(true)
      nextDaily()
      setMessage({ text: '🎉 Bravo, bonne réponse !', type: 'info' })
    } else if (newStatus === 'lost') {
      recordResultDaily(false)
      nextDaily()
      setMessage({ text: `💀 Perdu ! C'était ${department.name}`, type: 'error' })
    } else {
      setMessage({ text: `❌ Raté ! Il te reste ${remaining} essai${remaining > 1 ? 's' : ''}`, type: 'error' })
    }

    setUserInput('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-100 to-slate-100 flex flex-col relative overflow-hidden">
      
      {/* Lueur d'ambiance en arrière-plan */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-300/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header Premium Flouté (Glassmorphism) */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium transition text-sm cursor-pointer group"
        >
          <span className="transform group-hover:-translate-x-0.5 transition-transform">←</span> Accueil
        </button>
        <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
          <span className="text-xl">🗓️</span> Département du Jour
        </h1>
        <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs md:text-sm font-bold border border-emerald-100/50 flex items-center gap-1 shadow-sm">
          <span>{isMobile ? "" : "Série de "}{streakDaily} {streakDaily <= 1 ? "jour" : "jours"}</span>
          <span>🔥</span>
        </div>
      </header>

      {/* Conteneur principal */}
      <main className="flex flex-col lg:flex-row flex-1 gap-6 p-4 md:p-6 max-w-6xl w-full mx-auto z-10">

        {/* Bloc Carte France */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-5 min-h-80 flex items-center justify-center">
          <FranceMap
            correctCode={status === 'won' ? department.code : undefined}
            revealCode={status === 'lost' ? department.code : undefined}
            wrongCodes={wrongCodes}
          />
        </div>

        {/* Panneau Latéral de Contrôle */}
        <div className="lg:w-85 flex flex-col gap-5 shrink-0">

          {/* Section Essais Tracker */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-5">
            <p className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-4 text-center">Suivi des essais</p>
            <div className="grid grid-cols-5 gap-2.5 mb-4 justify-items-center">
              {Array.from({ length: MAX_GUESSES }).map((_, i) => {
                if (i < guesses.length) {
                  const isWon = status === 'won' && i === guesses.length - 1
                  return (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm transform scale-100 animate-fade-in ${
                        isWon ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'
                      }`}
                    >
                      {isWon ? '✓' : '✗'}
                    </div>
                  )
                }
                return <div key={i} className="w-9 h-9 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50" />
              })}
            </div>
            
            {/* Liste textuelle des essais passés */}
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
              {guesses.map((g, i) => {
                const isCorrect = normalize(g) === normalize(department.name)
                return (
                  <div key={i} className={`text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2 border ${
                    isCorrect 
                      ? 'bg-emerald-50/60 border-emerald-100 text-emerald-800' 
                      : 'bg-rose-50/60 border-rose-100 text-rose-800'
                  }`}>
                    <span className="text-sm">{isCorrect ? '✓' : '✗'}</span>
                    <span className="truncate">{g}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section Saisie Interactive & Réponses */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-5 flex flex-col gap-4">
            {!isFinished ? (
              <>
                {message && (
                  <div className={`p-3 rounded-xl text-xs font-semibold text-center border ${
                    message.type === 'error' 
                      ? 'bg-rose-50 border-rose-100 text-rose-600' 
                      : 'bg-blue-50 border-blue-100 text-blue-600'
                  }`}>
                    {message.text}
                  </div>
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
                  className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-600/10 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 transition-all cursor-pointer"
                >
                  Valider ({attemptsLeft} essai{attemptsLeft > 1 ? 's' : ''} restant{attemptsLeft > 1 ? 's' : ''})
                </button>
              </>
            ) : (
              <div className="text-center flex flex-col gap-3 py-2">
                {status === 'won' ? (
                  <>
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-emerald-100/50 shadow-sm">🏆</div>
                    <h3 className="text-emerald-800 font-black text-xl tracking-tight">Félicitations !</h3>
                    <p className="text-slate-500 text-sm font-medium">Trouvé de main de maître en <span className="text-slate-800 font-bold">{guesses.length} essai{guesses.length > 1 ? 's' : ''}</span>.</p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-rose-100/50 shadow-sm">😔</div>
                    <h3 className="text-rose-600 font-black text-xl tracking-tight">Pas de chance !</h3>
                    <p className="text-slate-500 text-sm font-medium">C'était la perle rare cachée derrière le nom :</p>
                    <p className="text-slate-900 font-black text-2xl tracking-tight bg-slate-50 py-1.5 rounded-xl border border-slate-100">{department.name}</p>
                  </>
                )}
                
                {/* Fiche d'identité du département */}
                <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 text-xs text-left text-slate-600 space-y-1.5 mt-2">
                  <p className="flex justify-between"><span className="font-bold text-slate-400">Numéro :</span> <span className="font-bold text-slate-800">{department.code}</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-400">Chef-lieu :</span> <span className="font-bold text-slate-800">{department.capital}</span></p>
                  <p className="flex justify-between"><span className="font-bold text-slate-400">Région :</span> <span className="font-bold text-slate-800">{department.region}</span></p>
                </div>
                <p className="text-slate-400 text-[11px] font-medium mt-1">Reviens demain pour relever un nouveau défi !</p>
              </div>
            )}        
          </div>

          {/* Révélations d'indices de secours */}
          {dailyRevealed && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-900 space-y-1 shadow-sm">
              <p className="font-bold uppercase tracking-wider text-[10px] text-amber-600 mb-1">💡 Indices débloqués</p>
              <p><span className="font-bold text-amber-800/80">Région :</span> {department.region}</p>
              <p><span className="font-bold text-amber-800/80">Chef-lieu :</span> {department.capital}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}