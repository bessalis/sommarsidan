import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hem from './pages/Hem'
import Bocker from './pages/Bocker'
import LoggaLasning from './pages/LoggaLasning'
import Badges from './pages/Badges'
import BokDetalj from './pages/BokDetalj'
import Recension from './pages/Recension'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hem />} />
        <Route path="/bocker" element={<Bocker />} />
        <Route path="/logga" element={<LoggaLasning />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/bok/:id" element={<BokDetalj />} />
        <Route path="/recension/:bookId" element={<Recension />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
