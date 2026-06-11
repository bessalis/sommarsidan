import NavBar from '../components/NavBar'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import heroBild from '../assets/hero.png'

const memberColors = {
  'Linnea': '#c0392b',
  'Erik': '#26562F',
  'Ebba': '#c8961a',
  'Linus': '#2980b9',
}

export default function Hem() {
  const [members, setMembers] = useState([])
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1)

  useEffect(() => {
    async function fetchData() {
      const { data: membersData } = await supabase.from('family_members').select('*')
      const { data: logs } = await supabase.from('reading_logs').select('family_member_id, pages, book_id')
      const { data: booksData } = await supabase.from('books').select('id, title, total_pages')
  
      if (membersData && logs && booksData) {
        const totals = {}
        logs.forEach(log => {
          if (log.family_member_id) {
            totals[log.family_member_id] = (totals[log.family_member_id] || 0) + log.pages
          }
        })
  
        const bookMap = {}
        booksData.forEach(b => { bookMap[b.id] = b })
  
        const enriched = membersData.map(m => {
          const currentBook = m.current_book_id ? bookMap[m.current_book_id] : null
          return {
            ...m,
            pages_read: totals[m.id] || 0,
            total_pages: currentBook ? currentBook.total_pages : 0,
            current_book_title: currentBook ? currentBook.title : null,
          }
        })
        setMembers(enriched)
      }
    }
    fetchData()
  }, [])

  return (
    <div style={{ background: '#F2ECD7', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Hero */}
<div style={{
  position: 'relative',
  margin: '1rem',
  borderRadius: '1.5rem',
  overflow: 'hidden',
  height: 220,
}}>
  <img
    src={heroBild}
    alt="Sommarsidan"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      display: 'block',
    }}
  />
  {/* Overlay för läsbarhet */}
  <div style={{
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 100%)',
  }} />
  {/* Text ovanpå */}
  <div style={{
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '1rem',
  }}>
    <div style={{
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 1.5,
      color: '#1A3418',
      marginBottom: 4,
    }}>
      Bra böcker · Starka samtal · Somriga äventyr
    </div>
    <div style={{
      fontFamily: 'Slang, Georgia, serif',
      fontSize: 56,
      color: '#1A3418',
      lineHeight: 1,
      marginBottom: 6,
    }}>
      Sommarsidan
    </div>
    <div style={{
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 2,
      color: '#1A3418',
    }}>
      ♥ EN BOKKLUBB
    </div>
  </div>
</div>


      <div style={{ padding: '0 1rem' }}>

 
        {/* Familjen läser */}
        <div style={{  fontFamily: 'Slang, Georgia, serif',fontSize: 22, letterSpacing: 1.5, color: '#888', margin: '1.5rem 0 0.75rem' }}>
          Familjen läser
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {members.map(m => (
            <div key={m.id} style={{
              background: m.color,
              borderRadius: 16,
              padding: '1rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28 }}>{m.emoji}</span>
                <span style={{ fontSize: 13 }}>🔥 0</span>
              </div>
              <div style={{ fontFamily: 'Slang, Georgia, serif',fontSize: 22, marginTop: 8 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{m.role}</div>
              {m.current_book_title && (
  <div style={{ fontSize: 11, color: '#888', marginTop: 2, fontStyle: 'italic' }}>
    📖 {m.current_book_title}
  </div>
)}
              <div style={{ marginTop: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4, height: 5 }}>
                <div style={{
                  width: m.total_pages > 0 ? `${Math.min(100, Math.round(m.pages_read / m.total_pages * 100))}%` : `${Math.min(100, m.pages_read)}%`,
                  background: memberColors[m.name] || '#26562F',
                  height: 5,
                  borderRadius: 4,
                }} />
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 4, fontWeight: 600 }}>
  {m.pages_read} sid lästa
</div>
            </div>
          ))}
        </div>

        {/* Senaste bragder */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', margin: '1.5rem 0 0.75rem' }}>
          SENASTE BRAGDER
        </div>
        <div style={{
          background: '#F8F2DF',
          borderRadius: 16,
          padding: '1rem',
          textAlign: 'center',
          color: '#aaa',
          fontSize: 13,
        }}>
          Inga bragder än — börja läsa! 📖
        </div>

        {/* Logga-knapp */}
        <button
          onClick={() => navigate('/logga')}
          style={{
            width: '100%',
            background: '#26562F',
            color: 'white',
            border: 'none',
            borderRadius: 16,
            padding: '1.1rem',
            fontFamily: 'sans-serif',
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '1.5rem',
          }}
        >
          📖 Logga läsning
        </button>

      </div>
      <NavBar />
    </div>
  )
}