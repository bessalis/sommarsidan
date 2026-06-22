import NavBar from '../components/NavBar'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const genreEmoji = {
  'Noveller': '✍️',
  'Populärvetenskap': '🔬',
  'Humor': '😄',
  'Sci-fi': '🚀',
  'Filosofi': '🤔',
  'Äventyr': '🌲',
  'Saga': '⭐',
}

const genreColor = {
  'Noveller': '#e8d5c4',
  'Populärvetenskap': '#c4d5e8',
  'Humor': '#e8e4c4',
  'Sci-fi': '#c4c8e8',
  'Filosofi': '#d5c4e8',
  'Äventyr': '#c4e8c8',
  'Saga': '#e8c4d5',
}

export default function BokDetalj() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [members, setMembers] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data: bookData } = await supabase.from('books').select('*').eq('id', id).single()
      if (bookData) setBook(bookData)

      const { data: membersData } = await supabase
        .from('family_members')
        .select('*')
        .eq('current_book_id', id)
      if (membersData) setMembers(membersData)
    }
    fetchData()
  }, [id])

  if (!book) return <div style={{ padding: '2rem' }}>Laddar...</div>

  return (
    <div style={{ background: '#F2ECD7', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Tillbaka */}
      <div style={{ padding: '1.5rem 1.5rem 0' }}>
        <button
          onClick={() => navigate('/bocker')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#666' }}
        >
          ← Böcker
        </button>
      </div>

      {/* Bokinfo */}
      <div style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            background: genreColor[book.genre] || '#eee',
            borderRadius: 12,
            width: 90,
            minWidth: 90,
            height: 110,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
          }}>
            {genreEmoji[book.genre] || '📖'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 22, fontFamily: 'Georgia, serif' }}>{book.title}</div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 10 }}>{book.author}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: '#F2ECD7', borderRadius: 20, padding: '3px 12px', fontSize: 12 }}>{book.genre}</span>
              <span style={{ background: '#F2ECD7', borderRadius: 20, padding: '3px 12px', fontSize: 12 }}>
                {book.language === 'engelska' ? '🇬🇧 Engelska' : '🇸🇪 Svenska'}
              </span>
            </div>
          </div>
        </div>

        {book.description && (
          <p style={{ marginTop: '1.5rem', fontSize: 14, lineHeight: 1.7, color: '#444' }}>
            {book.description}
          </p>
        )}
      </div>

      {/* Familjens framsteg */}
      {members.length > 0 && (
        <div style={{ padding: '0 1.5rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', margin: '1rem 0 0.75rem' }}>
            FAMILJENS FRAMSTEG
          </div>
          {members.map(m => {
            const pct = m.total_pages > 0 ? Math.round(m.current_page / m.total_pages * 100) : 0
            return (
              <div key={m.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{m.emoji}</span>
                    <span style={{ fontWeight: 600 }}>{m.name}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#888' }}>{m.current_page} / {m.total_pages} sid</span>
                </div>
                <div style={{ background: '#ddd', borderRadius: 4, height: 8 }}>
                  <div style={{
                    width: `${pct}%`,
                    background: '#26562F',
                    height: 8,
                    borderRadius: 4,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{pct}%</div>
              </div>
            )
          })}
        </div>
      )}

      {members.length === 0 && (
        <div style={{ padding: '0 1.5rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', margin: '1rem 0 0.75rem' }}>
            FAMILJENS FRAMSTEG
          </div>
          <div style={{ background: '#F8F2DF', borderRadius: 16, padding: '1rem', textAlign: 'center', color: '#aaa', fontSize: 13 }}>
            Ingen läser den här boken än
          </div>
        </div>
      )}

      {/* Skriv recension-knapp */}
      <div style={{ padding: '1.5rem' }}>
        <button onClick={() => navigate('/recension/' + id)} style={{
          width: '100%',
          background: 'none',
          border: '2px solid #26562F',
          borderRadius: 16,
          padding: '1rem',
          fontSize: 15,
          fontWeight: 700,
          color: '#26562F',
          cursor: 'pointer',
        }}>
          ✍️ Skriv recension
        </button>
      </div>

      <NavBar />
    </div>
  )
}