import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import NavBar from '../components/NavBar'

export default function Recension() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [members, setMembers] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedMember, setSelectedMember] = useState('')
  const [rating, setRating] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const { data: b } = await supabase.from('books').select('*').eq('id', bookId).single()
      if (b) setBook(b)
      const { data: m } = await supabase.from('family_members').select('*')
      if (m) setMembers(m)
      const { data: q } = await supabase.from('review_questions').select('*').order('sort_order')
      if (q) setQuestions(q)
    }
    fetchData()
  }, [bookId])

  async function handleSave() {
    if (!selectedMember || rating === 0) {
      alert('Valj vem som recenserar och ge ett betyg!')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('reviews').insert({
      family_member_id: selectedMember,
      book_id: bookId,
      rating,
      answers,
    })
    if (error) {
      alert('Nagot gick fel: ' + error.message)
    } else {
      navigate('/bok/' + bookId)
    }
    setSaving(false)
  }

  if (!book) return <div style={{ padding: '2rem', background: '#F2ECD7', minHeight: '100vh' }}>Laddar...</div>

  return (
    <div style={{ background: '#F2ECD7', minHeight: '100vh', paddingBottom: 100 }}>
      <div style={{ padding: '1.5rem 1rem 0' }}>
        <button onClick={() => navigate('/bok/' + bookId)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#666' }}>
          Tillbaka
        </button>

        <div style={{ fontFamily: 'Slang, Georgia, serif', fontSize: 32, color: '#26562F', margin: '1rem 0 0.25rem' }}>
          Recension
        </div>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>{book.title}</div>

        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Vem recenserar?</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
          {members.map(m => (
            <div key={m.id} onClick={() => setSelectedMember(m.id)} style={{
              background: selectedMember === m.id ? '#26562F' : '#F8F2DF',
              color: selectedMember === m.id ? 'white' : '#1a1a1a',
              borderRadius: 12,
              padding: '0.75rem 0.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px solid',
              borderColor: selectedMember === m.id ? '#26562F' : 'transparent',
            }}>
              <div style={{ fontSize: 22 }}>{m.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{m.name}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Betyg</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[1,2,3,4,5].map(s => (
            <div key={s} onClick={() => setRating(s)} style={{
              fontSize: 36,
              cursor: 'pointer',
              opacity: s <= rating ? 1 : 0.25,
            }}>⭐</div>
          ))}
        </div>

        {questions.map(q => (
          <div key={q.id} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{q.question_text}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(q.options || []).map((opt, i) => (
                <div key={i} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))} style={{
                  background: answers[q.id] === opt ? '#26562F' : '#F8F2DF',
                  color: answers[q.id] === opt ? 'white' : '#1a1a1a',
                  borderRadius: 12,
                  padding: '0.75rem 1rem',
                  fontSize: 14,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: answers[q.id] === opt ? '#26562F' : 'transparent',
                }}>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button onClick={handleSave} disabled={saving} style={{
          width: '100%',
          background: '#26562F',
          color: 'white',
          border: 'none',
          borderRadius: 16,
          padding: '1.1rem',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: '1rem',
          opacity: saving ? 0.7 : 1,
        }}>
          {saving ? 'Sparar...' : 'Spara recension'}
        </button>
      </div>
      <NavBar />
    </div>
  )
}
