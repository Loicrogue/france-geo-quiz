import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-100/60 to-indigo-100/40 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Bulles d'ambiance 404 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-purple-300/40 rounded-full blur-3xl pointer-events-none" />
      
      

      <div className="flex flex-col items-center text-center max-w-sm w-full z-10 bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/80 shadow-2xl shadow-purple-900/5 space-y-5">
        {/* Giga filigrane 404 stylisé en fond */}
        <div className="text-[6rem] font-black text-purple-200">
          404
        </div>

        <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-3xl border border-slate-100 transform rotate-12">
          🧭
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Page introuvable
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            On dirait que tu t'es égaré en dehors des frontières de notre carte !
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl text-base font-bold shadow-lg shadow-purple-600/20 cursor-pointer hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          Retourner à l'accueil
        </button>
      </div>
    </div>
  );
}

export default NotFound;