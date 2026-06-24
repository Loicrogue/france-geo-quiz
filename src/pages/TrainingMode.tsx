import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FranceMap from '../components/map/FranceMap'
import DepartmentAutocomplete from '../components/DepartmentAutocomplete'
import { useGameStore } from '../store/gameStore'
import { validateGuessInput } from '../utils/validateGuess'
import { getTrainingEndMessage } from '../utils/trainingMessages'

export default function TrainingMode() {
  const navigate = useNavigate()
  const {
    trainingQueue,
    currentTrainingIndex,
    trainingRevealed,
    trainingHistory,
    trainingFinished,
    initTraining,
    nextTraining,
    revealTraining,
    recordResultTraining,
    resetTrainingFinished,
  } = useGameStore()

  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (trainingQueue.length === 0) initTraining()
  }, [initTraining, trainingQueue.length])

  const current = trainingQueue[currentTrainingIndex]
  if (!current) return null

  if (trainingFinished) {
    const correctCount = trainingHistory.filter(r => r.correct).length
    const wrongCount = trainingHistory.filter(r => !r.correct).length
    const { emoji, title, message } = getTrainingEndMessage(correctCount)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-100 to-slate-100 flex flex-col relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-300/40 rounded-full blur-3xl pointer-events-none" />

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
          <div className="w-20 opacity-0 pointer-events-none hidden sm:block" />
        </header>

        <main className="flex flex-1 items-center justify-center p-6 z-10">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/60 p-8 max-w-md w-full text-center flex flex-col gap-6">

            {/* Emoji résultat */}
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-4xl mx-auto border border-amber-100 shadow-sm">
              {emoji}
            </div>

            {/* Titre */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">{message}</p>
            </div>

            {/* Score */}
            <div className="flex gap-4 justify-center">
              <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <p className="text-3xl font-black text-emerald-600">{correctCount}</p>
                <p className="text-xs font-bold text-emerald-500 mt-1 uppercase tracking-wider">Corrects</p>
              </div>
              <div className="flex-1 bg-rose-50 border border-rose-100 rounded-2xl p-4">
                <p className="text-3xl font-black text-rose-500">{wrongCount}</p>
                <p className="text-xs font-bold text-rose-400 mt-1 uppercase tracking-wider">Ratés</p>
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-3xl font-black text-slate-700">
                  {Math.round((correctCount / 96) * 100)}%
                </p>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Réussite</p>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.round((correctCount / 96) * 100)}%` }}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={resetTrainingFinished}
                className="w-full bg-amber-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                🔄 Recommencer l'entraînement
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all cursor-pointer text-sm"
              >
                ← Retour à l'accueil
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }


  const historyCodes = {
    correct: trainingHistory.filter(r => r.correct).map(r => r.code),
    wrong: trainingHistory.filter(r => !r.correct).map(r => r.code),
  }

  const handleGuess = () => {
    if (!userInput.trim()) return

    const validation = validateGuessInput(userInput)

    if (validation.status === 'not_found') {
      setMessage(`Il n'existe pas de département "${validation.query}", veuillez réessayer.`)
      return
    }

    if (validation.status === 'ambiguous') {
      setMessage(`Plusieurs départements contiennent "${validation.query}", soyez plus précis !`)
      return
    }

    // On compare le nom résolu avec le département courant
    const normalize = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

    const isCorrect = normalize(validation.resolvedName) === normalize(current.name)
    setMessage(null)
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
                {message && (
                  <div className="p-3 rounded-xl text-xs font-semibold text-center border bg-blue-50 border-blue-100 text-blue-600">
                    {message}
                  </div>
                )}
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