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

const genres = ['Noveller', 'Populärvetenskap', 'Humor', 'Sci-fi', 'Filosofi', 'Äventyr', 'Saga']
const languages = ['svenska', 'engelska']

export default function Bocker() {
  const [books, setBooks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isbn, setIsbn] = useState('')
  const [fetching, setFetching] = useState(false)
  const [bookPreview, setBookPreview] = useState(null)
  const [genre, setGenre] = useState('')
  const [language, setLanguage] = useState('svenska')
  const [totalPages, setTotalPages] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: true })
    if (data) setBooks(data)
  }

  async function handleIsbnLookup() {
    if (!isbn) return
    setFetching(true)
    setBookPreview(null)
    try {
      const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`)
      const data = await res.json()
      const key = `ISBN:${isbn}`
      if (data[key]) {
        const book = data[key]
        setBookPreview({
          title: book.title || '',
          author: book.authors?.[0]?.name || '',
          cover_url: book.cover?.large || book.cover?.medium || '',
          total_pages: book.number_of_pages || '',
          description: book.subjects?.[0]?.name || '',
        })
        if (book.number_of_pages) setTotalPages(String(book.number_of_pages))
      } else {
        alert('Hittade ingen bok med det ISBN-numret. Prova igen!')
      }
    } catch {
      alert('Något gick fel vid sökningen.')
    }
    setFetching(false)
  }

  async function handleSave() {
    if (!bookPreview || !genre || !totalPages) {
      alert('Fyll i genre och antal sidor!')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('books').insert({
      title: bookPreview.title,
      author: bookPreview.author,
      cover_url: bookPreview.cover_url,
      genre,
      language,
      total_pages: parseInt(totalPages),
      description: bookPreview.description || '',
    })
    if (error) {
      alert('Något gick fel: ' + error.message)
    } else {
      setShowModal(false)
      setIsbn('')
      setBookPreview(null)
      setGenre('')
      setLanguage('svenska')
      setTotalPages('')
      fetchBooks()
    }
    setSaving(false)
  }

  function closeModal() {
    setShowModal(false)
    setIsbn('')
    setBookPreview(null)
    setGenre('')
    setLanguage('svenska')
    setTotalPages('')
  }

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
      <div style={{ padding: '1rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Georgia, serif' }}>📚 Böcker</div>
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{books.length} böcker i bokhyllan</div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#26562F',
            color: '#F2ECD7',
            border: 'none',
            borderRadius: 50,
            width: 44,
            height: 44,
            fontSize: 24,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >+</button>
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
                <img src={book.cover_url} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <span style={{ fontSize: 26 }}>{genreEmoji[book.genre] || '📖'}</span>
                  <span style={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 9, color: '#666' }}>{book.genre}</span>
                </>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{book.title}</div>
              <div style={{ color: '#888', fontSize: 13, marginBottom: 6 }}>{book.author}</div>
              <div style={{ fontSize: 12, color: '#aaa', fontStyle: 'italic', lineHeight: 1.4 }}>{book.description}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <span style={{ background: '#F2ECD7', borderRadius: 20, padding: '2px 10px', fontSize: 11, color: '#666' }}>
                  {book.language === 'engelska' ? '🇬🇧 Engelska' : '🇸🇪 Svenska'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#F2ECD7',
              borderRadius: '1.5rem 1.5rem 0 0',
              padding: '1.5rem 1.5rem 100px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Handtag */}
            <div style={{ width: 40, height: 4, background: '#ccc', borderRadius: 2, margin: '0 auto 1.5rem' }} />

            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: 16 }}>
              ➕ Lägg till bok
            </div>

            {/* ISBN-sökning */}
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>ISBN-nummer</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="t.ex. 9789127174641"
                value={isbn}
                onChange={e => setIsbn(e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={e => e.key === 'Enter' && handleIsbnLookup()}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 14,
                  background: '#fff',
                  outline: 'none',
                  fontFamily: '-apple-system, sans-serif',
                }}
              />
              <button
                onClick={handleIsbnLookup}
                disabled={fetching}
                style={{
                  background: '#26562F',
                  color: '#F2ECD7',
                  border: 'none',
                  borderRadius: 12,
                  padding: '0 1.25rem',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: fetching ? 0.7 : 1,
                }}
              >
                {fetching ? '...' : 'Sök'}
              </button>
            </div>

            {/* Förhandsvisning */}
            {bookPreview && (
              <>
                <div style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '1rem',
                  display: 'flex',
                  gap: 12,
                  marginBottom: 16,
                }}>
                  {bookPreview.cover_url ? (
                    <img
                      src={bookPreview.cover_url}
                      alt={bookPreview.title}
                      style={{ width: 60, height: 80, objectFit: 'cover', borderRadius: 8 }}
                    />
                  ) : (
                    <div style={{ width: 60, height: 80, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📖</div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{bookPreview.title}</div>
                    <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{bookPreview.author}</div>
                  </div>
                </div>

                {/* Antal sidor */}
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Antal sidor</div>
                <input
                  type="number"
                  placeholder="t.ex. 312"
                  value={totalPages}
                  onChange={e => setTotalPages(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    border: 'none',
                    fontSize: 14,
                    background: '#fff',
                    outline: 'none',
                    marginBottom: 16,
                    boxSizing: 'border-box',
                    fontFamily: '-apple-system, sans-serif',
                  }}
                />

                {/* Genre */}
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Genre</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {genres.map(g => (
                    <div
                      key={g}
                      onClick={() => setGenre(g)}
                      style={{
                        background: genre === g ? '#26562F' : '#fff',
                        color: genre === g ? '#F2ECD7' : '#1a1a1a',
                        borderRadius: 20,
                        padding: '6px 14px',
                        fontSize: 13,
                        cursor: 'pointer',
                        fontWeight: genre === g ? 700 : 400,
                      }}
                    >
                      {genreEmoji[g]} {g}
                    </div>
                  ))}
                </div>

                {/* Språk */}
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Språk</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                  {languages.map(l => (
                    <div
                      key={l}
                      onClick={() => setLanguage(l)}
                      style={{
                        background: language === l ? '#26562F' : '#fff',
                        color: language === l ? '#F2ECD7' : '#1a1a1a',
                        borderRadius: 20,
                        padding: '6px 14px',
                        fontSize: 13,
                        cursor: 'pointer',
                        fontWeight: language === l ? 700 : 400,
                      }}
                    >
                      {l === 'svenska' ? '🇸🇪' : '🇬🇧'} {l}
                    </div>
                  ))}
                </div>

                {/* Spara */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: '100%',
                    background: '#26562F',
                    color: '#F2ECD7',
                    border: 'none',
                    borderRadius: 16,
                    padding: '1rem',
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Sparar...' : '✓ Lägg till bok'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <NavBar />
    </div>
  )
}