import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DailyMode from './pages/DailyMode'
import TrainingMode from './pages/TrainingMode'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily" element={<DailyMode />} />
        <Route path="/training" element={<TrainingMode />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App