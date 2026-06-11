import NavBar from '../components/NavBar'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import heroBild from '../assets/hero.png'

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

export default function Bocker() {
  const [books, setBooks] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchBooks() {
      const { data } = await supabase.from('books').select('*').order('created_at', { ascending: true })
      if (data) setBooks(data)
    }
    fetchBooks()
  }, [])

  return (
    <div style={{ background: '#F2ECD7', minHeight: '100vh', paddingBottom: 100 }}>

    {/* Header */}
<div style={{
  margin: '1rem 1rem 0',
  borderRadius: '1.5rem',
  overflow: 'hidden',
  height: 140,
  position: 'relative',
}}>
  <img
    src={heroBild}
    alt=""
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 60%',
      display: 'block',
    }}
  />
</div>

{/* Sidtitel */}
<div style={{ padding: '1rem 1.5rem 0' }}>
  <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
    📚 Böcker
  </div>
  <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
    {books.length} böcker i bokhyllan
  </div>
</div>

      <div style={{ padding: '0 1rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', margin: '1.5rem 0 0.75rem' }}>
          BOKHYLLAN
        </div>

        {books.map(book => (
          <div
            key={book.id}
            onClick={() => navigate(`/bok/${book.id}`)}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '1rem',
              display: 'flex',
              gap: '1rem',
              marginBottom: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              cursor: 'pointer',
            }}
          >
            {/* Omslag */}
            <div style={{
              borderRadius: 10,
              width: 72,
              minWidth: 72,
              height: 90,
              overflow: 'hidden',
              background: genreColor[book.genre] || '#eee',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  <span style={{ fontSize: 26 }}>{genreEmoji[book.genre] || '📖'}</span>
                  <span style={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 9, color: '#666' }}>{book.genre}</span>
                </>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{book.title}</div>
              <div style={{ color: '#888', fontSize: 13, marginBottom: 6 }}>{book.author}</div>
              <div style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic', lineHeight: 1.4 }}>
                {book.description}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <span style={{
                  background: '#F2ECD7',
                  borderRadius: 20,
                  padding: '2px 10px',
                  fontSize: 11,
                  color: '#666',
                }}>
                  {book.language === 'engelska' ? '🇬🇧 Engelska' : '🇸🇪 Svenska'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <NavBar />
    </div>
  )
}