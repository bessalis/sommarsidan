import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setDone(true)
    })
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F2ECD7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>☀️</div>
      <div style={{
        fontFamily: 'Slang, Georgia, serif',
        fontSize: 36,
        color: '#26562F',
        marginBottom: 12,
      }}>
        Sommarsidan
      </div>
      {done ? (
        <>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Du är inloggad!</div>
          <div style={{ fontSi5, color: '#555', lineHeight: 1.6 }}>
            Gå tillbaka till appen på hemskärmen<br />så är du redan inloggad. 📚
          </div>
        </>
      ) : (
        <div style={{ fontSize: 15, color: '#555' }}>Loggar in...</div>
      )}
    </div>
  )
}
