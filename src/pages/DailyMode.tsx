import { useNavigate } from 'react-router-dom'

export default function DailyMode() {
  const navigate = useNavigate()
    localStorage.setItem("isAllowed","true")


  return (
    <div className="min-h-screen bg-background-green-monSite flex flex-col space-y-4 items-center justify-center">
      <h1 className="text-2xl font-bold text-green-900">🗓️ Département du Jour — à venir</h1>
      <button
        onClick={() => navigate('/')}
        className="bg-gray-500 text-white py-3 px-6 rounded-xl text-lg font-semibold cursor-pointer hover:bg-gray-700 transition"
      >
        Retour à la page d'accueil
      </button>
    </div>
  )
}