import { useNavigate } from 'react-router-dom'
import carte_france_fond_accueil from '../assets/carte_france_fond_accueil.jpg'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Image de fond */}
      <div
      className="absolute inset-0 bg-cover bg-center pointer-events-none scale-105"
      style={{ backgroundImage: `url(${carte_france_fond_accueil})`, opacity: 0.5, filter: 'blur(3px)' }}
    />

      {/* Cercles décoratifs flous en arrière-plan pour donner de la profondeur */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Conteneur principal */}
      <div className="flex flex-col items-center max-w-xl w-full text-center z-10 space-y-8">
        
        {/* Illustration Centrale / Icône Stylisée */}
        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl shadow-slate-200/80 flex items-center justify-center text-3xl border border-slate-100/80 transform hover:rotate-6 transition-transform duration-300">
          🗺️
        </div>

        {/* Bloc Titre & Sous-titre */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Bienvenue sur <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">France Géo Quiz</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-sm mx-auto font-medium leading-relaxed">
            Prêt à tester tes connaissances sur les départements ? Choisis ton mode de jeu !
          </p>
        </div>

        {/* Boutons d'Action (Responsive : l'un sur l'autre sur mobile, côte à côte sur PC) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-2">
          
          {/* Bouton Département du Jour */}
          <button
            onClick={() => navigate('/daily')}
            className="flex-1 flex items-center justify-center gap-3 bg-emerald-600 text-white py-4 px-6 rounded-2xl text-lg font-bold shadow-lg shadow-emerald-600/20 cursor-pointer hover:bg-emerald-500 hover:scale-[1.03] active:scale-[0.98] hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-200 ease-out"
          >
            <span className="text-xl">🗓️</span>
            Département du Jour
          </button>
          
          {/* Bouton Mode Entraînement */}
          <button
            onClick={() => navigate('/training')}
            className="flex-1 flex items-center justify-center gap-3 bg-amber-500 text-white py-4 px-6 rounded-2xl text-lg font-bold shadow-lg shadow-amber-500/20 cursor-pointer hover:bg-amber-400 hover:scale-[1.03] active:scale-[0.98] hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-200 ease-out"
          >
            <span className="text-xl">🎯</span>
            Mode Entraînement
          </button>

        </div>
      </div>
    </div>
  )
}