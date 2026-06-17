import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-blue-900">🇫🇷 France Géo Quiz</h1>
      <p className="text-blue-700 text-lg">Teste tes connaissances sur les départements français</p>
      <div className="flex flex-col gap-4 w-64">
        <button
          onClick={() => navigate('/daily')}
          className="bg-blue-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
        >
          🗓️ Département du Jour
        </button>
        <button
          onClick={() => navigate('/training')}
          className="bg-green-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-green-700 transition"
        >
          🎯 Mode Entraînement
        </button>
      </div>
    </div>
  )
}