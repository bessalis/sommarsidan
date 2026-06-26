import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import NavBar from '../components/NavBar'

const badgeImages = import.meta.glob('../assets/badges/*.png', { eager: true })

function getBadgeImage(filename) {
  if (!filename) return null
  const key = Object.keys(badgeImages).find(k => k.endsWith(filename))
  return key ? badgeImages[key].default : null
}

const CATEGORY_LABELS = {
  plats: 'Plats',
  uthallighet: 'Uthallighet',
  bocker: 'Bocker',
  engagemang: 'Engagemang',
  sommar: 'Sommar',
  bingo: 'Bingo',
}

export default function Badges() {
  const [badges, setBadges] = useState([])
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [unlockedIds, setUnlockedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: allBadges } = await supabase.from('badges').select('*').order('category')
      if (allBadges) setBadges(allBadges)
      const { data: m } = await supabase.from('family_members').select('*')
      if (m) setMembers(m)
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchUnlocked() {
      if (!selectedMember) {
        setUnlockedIds(new Set())
        return
      }
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('family_member_id', selectedMember)
      if (userBadges) setUnlockedIds(new Set(userBadges.map(b => b.badge_id)))
    }
    fetchUnlocked()
  }, [selectedMember])

  const grouped = badges.reduce((acc, badge) => {
    const cat = badge.category || 'ovrigt'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(badge)
    return acc
  }, {})

  if (loading) return <div style={{ padding: '2rem', background: '#F2ECD7', minHeight: '100vh' }}>Laddar...</div>

  return (
    <div style={{ background: '#F2ECD7', minHeight: '100vh', paddingBottom: 100 }}>
      <div style={{ padding: '1.5rem 1rem 0' }}>
        <div style={{ fontFamily: 'Slang, Georgia, serif', fontSize: 36, color: '#26562F', marginBottom: 16 }}>
          Bragder
        </div>

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

        {selectedMember && (
          <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
            {unlockedIds.size} av {badges.length} upplasta
          </div>
        )}

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#888', marginBottom: 12 }}>
              {CATEGORY_LABELS[category] || category.toUpperCase()}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {items.map(badge => {
                const unlocked = unlockedIds.has(badge.id)
                const img = getBadgeImage(badge.image_url)
                return (
                  <div key={badge.id} style={{
                    background: unlocked ? '#F8F2DF' : 'rgba(248,242,223,0.4)',
                    borderRadius: 16,
                    padding: '1rem',
                    textAlign: 'center',
                    border: unlocked ? '2px solid #26562F' : '2px solid transparent',
                  }}>
                    {img ? (
                      <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: '0 auto 8px',
                        filter: unlocked ? 'none' : 'grayscale(100%) opacity(0.4)',
                      }}>
                        <img src={img} alt={badge.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ fontSize: 40, marginBottom: 8 }}>🏅</div>
                    )}
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2, color: '#1A3418' }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#888', leHeight: 1.4 }}>
                      {badge.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <NavBar />
    </div>
  )
}
