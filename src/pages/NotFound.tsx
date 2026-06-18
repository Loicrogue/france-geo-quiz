import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background-purple-monSite flex flex-col space-y-4 items-center justify-center">
              <h1 className="text-2xl font-bold text-purple-900">Page non trouvable</h1>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-500 text-white py-3 px-6 rounded-xl text-lg font-semibold cursor-pointer hover:bg-gray-700 transition hover:cursor"
              >
                Retour à la page d'accueil
              </button>
            </div>
    );
}

export default NotFound;