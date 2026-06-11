import NavBar from '../components/NavBar'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoggaLasning() {
  const [members, setMembers] = useState([])
  const [books, setBooks] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [minutes, setMinutes] = useState(30)
  const [pages, setPages] = useState(15)
  const [location, setLocation] = useState('hemma')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function fetchData() {
      const { data: m } = await supabase.from('family_members').select('*')
      if (m) setMembers(m)
      const { data: b } = await supabase.from('books').select('*')
      if (b) setBooks(b)
    }
    fetchData()
  }, [])

  const locations = [
    { key: 'hemma', label: 'Hemma', emoji: '🏠' },
    { key: 'bil', label: 'I bilen', emoji: '🚗' },
    { key: 'utomhus', label: 'Utomhus', emoji: '🌿' },
    { key: 'annat', label: 'Annat', emoji: '✨' },
  ]

  async function handleSave() {
    console.log('Sparar:', { selectedMember, selectedBook, minutes, pages, location })
    if (!selectedMember || !selectedBook) {
      alert('Välj vem som läser och vilken bok!')
      return
    }
    setSaving(true)
    console.log('Sparar:', { selectedMember, selectedBook, minutes, pages, location })
const { error } = await supabase.from('reading_logs').insert({
  family_member_id: selectedMember,
  book_id: selectedBook,
  date: today,
  minutes,
  pages,
  location_type: location,
  note: note || null,
})
    if (error) {
        console.log('FEL:', error)
      alert('Något gick fel: ' + error.message)
    } else {
      // Uppdatera familjens framsteg
      const member = members.find(m => m.id === selectedMember)
      if (member) {
        await supabase.from('family_members').update({
          current_book_id: selectedBook,
          current_page: (member.current_page || 0) + pages,
        }).eq('id', selectedMember)
      }
      navigate('/')
    }
    setSaving(false)
  }

  return (
    <div style={{ background: '#F2ECD7', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #d4e8c2 0%, #F2ECD7 100%)',
        padding: '2rem 1.5rem 1.5rem',
      }}>
        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
          📖 Logga läsning
        </div>
        <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Berätta om din lässstund</div>
      </div>

      <div style={{ padding: '0 1rem' }}>

        {/* Vem läser */}
        <div style={{ fontSize: 13, fontWeight: 700, margin: '1.5rem 0 0.75rem' }}>Vem läser?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {members.map(m => (
            <div
              key={m.id}
              onClick={() => setSelectedMember(m.id)}
              style={{
                background: selectedMember === m.id ? '#26562F' : '#fff',
                color: selectedMember === m.id ? 'white' : '#1a1a1a',
                borderRadius: 16,
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                border: '2px solid',
                borderColor: selectedMember === m.id ? '#26562F' : 'transparent',
              }}
            >
              <span style={{ fontSize: 24 }}>{m.emoji}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{m.name}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Vilken bok */}
        <div style={{ fontSize: 13, fontWeight: 700, margin: '1.5rem 0 0.75rem' }}>Vilken bok?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {books.map(b => (
            <div
              key={b.id}
              onClick={() => setSelectedBook(b.id)}
              style={{
                background: selectedBook === b.id ? '#26562F' : '#fff',
                color: selectedBook === b.id ? 'white' : '#1a1a1a',
                borderRadius: 12,
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: selectedBook === b.id ? '#26562F' : 'transparent',
              }}
            >
              <div style={{ fontWeight: 600 }}>{b.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{b.author}</div>
            </div>
          ))}
        </div>

        {/* Tid och sidor */}
        <div style={{ fontSize: 13, fontWeight: 700, margin: '1.5rem 0 0.75rem' }}>Tid och sidor</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Minuter', value: minutes, set: setMinutes, unit: 'min', step: 5 },
            { label: 'Sidor', value: pages, set: setPages, unit: 'sid', step: 1 },
          ].map(({ label, value, set, unit, step }) => (
            <div key={label} style={{ background: '#F8F2DF', borderRadius: 16, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{label}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <button
                  onClick={() => set(Math.max(0, value - step))}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#e0d9c8', fontSize: 18, cursor: 'pointer' }}
                >−</button>
                <span style={{ fontSize: 28, fontWeight: 700 }}>{value}</span>
                <button
                  onClick={() => set(value + step)}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#e0d9c8', fontSize: 18, cursor: 'pointer' }}
                >+</button>
              </div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>{unit}</div>
            </div>
          ))}
        </div>

        {/* Var läste du */}
        <div style={{ fontSize: 13, fontWeight: 700, margin: '1.5rem 0 0.75rem' }}>Var läste du?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {locations.map(l => (
            <div
              key={l.key}
              onClick={() => setLocation(l.key)}
              style={{
                background: location === l.key ? '#26562F' : '#fff',
                color: location === l.key ? 'white' : '#1a1a1a',
                borderRadius: 16,
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: location === l.key ? '#26562F' : 'transparent',
              }}
            >
              <div style={{ fontSize: 28 }}>{l.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{l.label}</div>
            </div>
          ))}
        </div>

        {/* Anteckning */}
        <div style={{ fontSize: 13, fontWeight: 700, margin: '1.5rem 0 0.75rem' }}>
          Anteckning <span style={{ fontWeight: 400, color: '#aaa' }}>(valfritt)</span>
        </div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Vad läste du? Hur var det?"
          style={{
            width: '100%',
            background: '#fff',
            border: 'none',
            borderRadius: 16,
            padding: '1rem',
            fontSize: 14,
            fontFamily: '-apple-system, sans-serif',
            resize: 'none',
            height: 100,
            outline: 'none',
          }}
        />

        {/* Spara */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            background: '#26562F',
            color: 'white',
            border: 'none',
            borderRadius: 16,
            padding: '1.1rem',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '1.5rem',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Sparar...' : '✓ Spara läsning'}
        </button>

      </div>
      <NavBar />
    </div>
  )
}