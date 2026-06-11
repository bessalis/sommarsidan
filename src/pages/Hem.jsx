import NavBar from '../components/NavBar'
import { supabase } from '../lib/supabase'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import heroBild from '../assets/hero.png'

const memberColors = {
  'Linnea': '#c0392b',
  'Erik': '#26562F',
  'Ebba': '#c8961a',
  'Linus': '#2980b9',
}

const HERO_FULL = 320
const HERO_MIN = 64

export default function Hem() {
  const [members, setMembers] = useState([])
  const [heroHeight, setHeroHeight] = useState(HERO_FULL)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

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

  function handleScroll(e) {
    const scrollY = e.target.scrollTop
    const newHeight = Math.max(HERO_MIN, HERO_FULL - scrollY)
    setHeroHeight(newHeight)
  }

  // 0 = fullt utfällt, 1 = helt ihopfällt
  const progress = (HERO_FULL - heroHeight) / (HERO_FULL - HERO_MIN)

  return (
    <div style={{ background: '#F2ECD7', height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Hero — sticky överst */}
      <div style={{
        position: 'relative',
        margin: progress < 1 ? `${16 * (1 - progress)}px ${16 * (1 - progress)}px 0` : '0',
        borderRadius: progress < 1 ? `${24 * (1 - progress)}px` : '0',
        overflow: 'hidden',
        height: heroHeight,
        flexShrink: 0,
        transition: 'border-radius 0.1s, margin 0.1s',
      }}>
        <img
          src={heroBild}
          alt="Sommarsidan"
          style={{
            width: '100%',
            height: HERO_FULL,
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            position: 'absolute',
            top: 0,
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 100%)',
        }} />

        {/* Full hero-text — tonas ut */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '1rem',
          opacity: 1 - progress * 2,
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: '#1A3418', marginBottom: 4 }}>
            Bra böcker · Starka samtal · Somriga äventyr
          </div>
          <div style={{ fontFamily: 'Slang, Georgia, serif', fontSize: 56, color: '#1A3418', lineHeight: 1, marginBottom: 6 }}>
            Sommarsidan
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#1A3418' }}>
            ♥ EN BOKKLUBB
          </div>
        </div>

        {/* Mini header-text — tonas in */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: Math.max(0, progress * 2 - 1),
          pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: 'Slang, Georgia, serif', fontSize: 28, color: '#1A3418' }}>
            Sommarsidan
          </div>
        </div>
      </div>

      {/* Scrollbart innehåll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}
      >
        <div style={{ padding: '0 1rem' }}>

          {/* Familjen läser */}
          <div style={{ fontFamily: 'Slang, Georgia, serif', fontSize: 22, letterSpacing: 1.5, color: '#888', margin: '1.5rem 0 0.75rem' }}>
            Familjen laser
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {members.map(m => (
              <div key={m.id} style={{ background: m.color, borderRadius: 16, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 28 }}>{m.emoji}</span>
                  <span style={{ fontSize: 13 }}>🔥 0</span>
                </div>
                <div style={{ fontFamily: 'Slang, Georgia, serif', fontSize: 22, marginTop: 8 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{m.role}</div>
                {m.current_book_title && (
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2, fontStyle: 'italic' }}>
                    📖 {m.current_book_title}
                  </div>
                )}
                <div style={{ marginTop: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4, height: 5 }}>
                  <div style={{
                    width: m.total_pages > 0 ? `${Math.min(100, Math.round(m.pages_read / m.total_pages * 100))}%` : '0%',
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
          <div style={{ background: '#F8F2DF', borderRadius: 16, padding: '1rem', textAlign: 'center', color: '#aaa', fontSize: 13 }}>
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
      </div>
      <NavBar />
    </div>
  )
}