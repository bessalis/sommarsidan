import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Hem from './pages/Hem'
import Bocker from './pages/Bocker'
import LoggaLasning from './pages/LoggaLasning'
import Badges from './pages/Badges'
import BokDetalj from './pages/BokDetalj'
import AuthCallback from './pages/AuthCallback'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className="loading">Laddar...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={session ? <Hem /> : <Navigate to="/login" />} />
        <Route path="/bocker" element={session ? <Bocker /> : <Navigate to="/login" />} />
        <Route path="/logga" element={session ? <LoggaLasning /> : <Navigate to="/login" />} />
        <Route path="/badges" element={session ? <Badges /> : <Navigate to="/login" />} />
        <Route path="/bok/:id" element={session ? <BokDetalj /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
