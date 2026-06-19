import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background-monSite flex flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-4xl font-bold text-blue-900">Bienvenue sur France Géo Quiz</h1>
      <div className="flex flex-col gap-4 w-64">
        <button
          onClick={() => navigate('/daily')}
          className="bg-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold cursor-pointer hover:bg-green-700 transition"
        >
          🗓️ Département du Jour
        </button>
        <button
          onClick={() => navigate('/training')}
          className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer text-white py-3 px-6 rounded-xl text-lg font-semibold transition"
        >
          🎯 Mode Entraînement
        </button>
      </div>
    </div>
  )
}