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
    trainingHistory,
    initTraining,
    nextTraining,
    revealTraining,
    recordResultTraining,
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

  const historyCodes = {
    correct: trainingHistory.filter(r => r.correct).map(r => r.code),
    wrong: trainingHistory.filter(r => !r.correct).map(r => r.code),
  }

  const handleGuess = () => {
    if (!userInput.trim()) return
    const isCorrect = normalize(userInput) === normalize(current.name)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    recordResultTraining(isCorrect)
    if (!isCorrect) revealTraining()
  }

  const handleNext = () => {
    setUserInput('')
    setFeedback(null)
    nextTraining()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-100 to-slate-100 flex flex-col relative overflow-hidden">
      
      {/* Flou décoratif arrière-plan */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-amber-300/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header Premium Flouté */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium transition text-sm cursor-pointer group"
        >
          <span className="transform group-hover:-translate-x-0.5 transition-transform">←</span> Accueil
        </button>
        <h1 className="text-base md:text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
          <span className="text-xl">🎯</span> Mode Entraînement
        </h1>
        <div className="w-20 opacity-0 pointer-events-none hidden sm:block" aria-hidden="true" />
      </header>

      {/* Conteneur principal */}
      <main className="flex flex-col lg:flex-row flex-1 gap-6 p-4 md:p-6 max-w-6xl w-full mx-auto z-10">

        {/* Bloc Carte France */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-5 min-h-80 flex items-center justify-center">
          <FranceMap
            highlightedCode={current.code}
            correctCode={feedback === 'correct' ? current.code : undefined}
            revealCode={feedback === 'wrong' && trainingRevealed ? current.code : undefined}
            previousCorrectCodes={historyCodes.correct}
            previousWrongCodes={historyCodes.wrong}
          />
        </div>

        {/* Panneau Latéral de Contrôle */}
        <div className="lg:w-85 flex flex-col gap-5 shrink-0">

          {/* Tableau des scores (Dashboard style) */}
          <div className="flex bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 divide-x divide-slate-100 overflow-hidden">
            <div className="flex-1 text-center p-4 py-5 bg-emerald-50/10">
              <p className="text-slate-400 text-[11px] font-bold tracking-wider uppercase mb-1">Bonnes</p>
              <p className="text-4xl font-black text-emerald-600 tracking-tight">
                {historyCodes.correct.length}
              </p>
            </div>
            <div className="flex-1 text-center p-4 py-5 bg-rose-50/10">
              <p className="text-slate-400 text-[11px] font-bold tracking-wider uppercase mb-1">Mauvaises</p>
              <p className="text-4xl font-black text-rose-500 tracking-tight">
                {historyCodes.wrong.length}
              </p>
            </div>
          </div>

          {/* Pilule de Progression */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-4 py-2.5 text-center text-xs font-bold text-slate-500 tracking-wide">
            🚀 Progression : <span className="text-slate-800 font-extrabold">{currentTrainingIndex + 1}</span> sur <span className="text-slate-800 font-extrabold">{trainingQueue.length}</span> départements
          </div>

          {/* Boîtier Interactif Question & Input */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-5 flex flex-col gap-5">

            {/* Numéro Vedette */}
            <div className="text-center bg-slate-50/50 py-4 rounded-2xl border border-slate-100">
              <p className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-1">Département cible</p>
              <p className="text-7xl font-black text-amber-500 tracking-tight drop-shadow-sm">{current.code}</p>
            </div>

            {!feedback ? (
              <>
                <DepartmentAutocomplete
                  value={userInput}
                  onChange={v => setUserInput(v)}
                  onSubmit={handleGuess}
                  accentColor="yellow"
                  showCode={false}
                />
                <div className="flex flex-col gap-2.5 pt-1">
                  <button
                    onClick={handleGuess}
                    disabled={!userInput.trim()}
                    className="w-full bg-amber-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-amber-500/10 hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100 transition-all cursor-pointer"
                  >
                    Valider la réponse
                  </button>
                  <button
                    onClick={() => revealTraining()}
                    className="text-slate-400 text-xs font-bold hover:text-slate-600 transition cursor-pointer self-center py-1 mt-1"
                  >
                    💡 Besoin d'un indice ?
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4 animate-fade-in">
                {feedback === 'correct' ? (
                  <div className="text-center py-2">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl mx-auto border border-emerald-100/50 mb-2">🎉</div>
                    <h3 className="text-emerald-700 font-black text-lg tracking-tight">Excellent !</h3>
                    <p className="text-slate-800 font-extrabold text-xl mt-1">{current.name}</p>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-2xl mx-auto border border-rose-100/50 mb-2">❌</div>
                    <h3 className="text-rose-600 font-black text-base tracking-tight">Dommage...</h3>
                    <p className="text-slate-900 font-black text-2xl tracking-tight mt-1">{current.name}</p>
                    <p className="text-slate-400 text-xs font-medium mt-1">Chef-lieu : {current.capital}</p>
                  </div>
                )}
                <button
                  onClick={handleNext}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Suivant <span className="text-lg">→</span>
                </button>
              </div>
            )}
          </div>

          {/* Zone d'indice révélée */}
          {trainingRevealed && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-900 space-y-1 shadow-sm animate-fade-in">
              <p className="font-bold uppercase tracking-wider text-[10px] text-amber-600 mb-1">💡 Indice débloqué</p>
              <p><span className="font-bold text-amber-800/80">Région :</span> {current.region}</p>
              <p><span className="font-bold text-amber-800/80">Chef-lieu :</span> {current.capital}</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}