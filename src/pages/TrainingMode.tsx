import { useNavigate } from 'react-router-dom'
import FranceMap from '../components/map/FranceMap'

export default function TrainingMode() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background-yellow-monSite flex flex-col space-y-4 items-center justify-center">
      <h1 className="text-2xl font-bold text-yellow-900">🎯 Mode Entraînement — en cours de développement</h1>
      <div className='h-150 bg-red-100'>
        <FranceMap
            onDepartmentClick={(code, name) => console.log(code, name)}
          />
      </div>
      <button
        onClick={() => navigate('/')}
        className="bg-gray-500 text-white py-3 px-6 rounded-xl text-lg font-semibold cursor-pointer hover:bg-gray-700 transition hover:cursor"
      >
        Retour à la page d'accueil
      </button>
    </div>
  )
}