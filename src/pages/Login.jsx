import { useState } from 'react'
import { supabase } from '../lib/supabase'
import heroBild from '../assets/hero.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://sommarsidan.netlify.app/auth/callback',
      }
    })
    if (error) alert(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>

      {/* Bakgrundsbild */}
      <img
        src={heroBild}
        alt=""
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(30, 40, 25, 0.35)',
        zIndex: 1,
      }} />

      {/* Innehåll */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 360, textAlign: 'center' }}>

        {/* Logotyp */}
        <div style={{
          fontFamily: 'Slang, Georgia, serif',
          fontSize: 52,
          color: '#F2ECD7',
          lineHeight: 1,
          marginBottom: 6,
        }}>
          Sommarsidan
        </div>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          color: '#F2ECD7',
          marginBottom: 48,
        }}>
          ♥ EN BOKKLUBB
        </div>

        {sent ? (
          /* Bekräftelse */
          <div style={{
            background: 'rgba(242, 236, 215, 0.92)',
            borderRadius: 24,
            padding: '2rem',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: 'Georgia, serif' }}>
              Kolla din e-post!
            </div>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
              Vi har skickat en magisk länk till<br />
              <strong style={{ color: '#26562F' }}>{email}</strong>
            </div>
          </div>
        ) : (
          /* Inloggningsformulär */
          <div style={{
            background: 'rgba(242, 236, 215, 0.92)',
            borderRadius: 24,
            padding: '2rem',
          }}>
            <div style={{ fontSize: 15, color: '#555', marginBottom: 20, lineHeight: 1.5 }}>
              Ange din e-post så skickar vi en inloggningslänk
            </div>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="din@email.se"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  marginBottom: '0.75rem',
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 12,
                  background: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: '-apple-system, sans-serif',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  borderRadius: 12,
                  background: '#26562F',
                  color: '#F2ECD7',
                  fontFamily: '-apple-system, sans-serif',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Skickar...' : '✨ Skicka magisk länk'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}