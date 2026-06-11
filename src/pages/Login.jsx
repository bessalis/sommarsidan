import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) alert(error.message)
    else setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>📬 Kolla din e-post!</h2>
      <p>Vi har skickat en magisk länk till <strong>{email}</strong></p>
    </div>
  )

  return (
    <div style={{ maxWidth: 400, margin: '8rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1>🌞 Sommarsidan</h1>
      <p>Ange din e-post så skickar vi en inloggningslänk</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="din@email.se"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', fontSize: '1rem' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          {loading ? 'Skickar...' : 'Skicka magisk länk ✨'}
        </button>
      </form>
    </div>
  )
}