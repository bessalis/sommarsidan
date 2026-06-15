import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import NavBar from "../components/NavBar"

const CATEGORY_LABELS = {
  plats: "📍 Plats",
  uthallighet: "⏱️ Uthållighet",
  bocker: "📚 Böcker",
  engagemang: "✍️ Engagemang",
  sommar: "🌞 Sommar",
  bingo: "🎯 Bingo",
}

export default function Badges() {
  const [badges, setBadges] = useState([])
  const [unlockedIds, setUnlockedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: allBadges } = await supabase.from("badges").select("*").order("category")
      const { data: userBadges } = await supabase.from("user_badges").select("badge_id")
      if (allBadges) setBadges(allBadges)
      if (userBadges) setUnlockedIds(new Set(userBadges.map(b => b.badge_id)))
      setLoading(false)
    }
    fetchData()
  }, [])

  const grouped = badges.reduce((acc, badge) => {
    const cat = badge.category || "ovrigt"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(badge)
    return acc
  }, {})

  if (loading) return <div style={{ padding: "2rem", background: "#F2ECD7", minHeight: "100vh" }}>Laddar...</div>

  return (
    <div style={{ background: "#F2ECD7", minHeight: "100vh", paddingBottom: 100 }}>
      <div style={{ padding: "1.5rem 1rem 0" }}>
        <div style={{ fontFamily: "Slang, Georgia, serif", fontSize: 36, color: "#26562F", marginBottom: 4 }}>
          Bragder
        </div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
          {unlockedIds.size} av {badges.length} upplasta
        </div>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#888", marginBottom: 12 }}>
              {CATEGORY_LABELS[category] || category.toUpperCase()}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {items.map(badge => {
                const unlocked = unlockedIds.has(badge.id)
                return (
                  <div key={badge.id} style={{
                    background: unlocked ? "#F8F2DF" : "rgba(248,242,223,0.4)",
                    borderRadius: 16,
                    padding: "1rem",
                    opacity: unlocked ? 1 : 0.5,
                    border: unlocked ? "2px solid #26562F" : "2px solid transparent",
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{badge.emoji || "🏅"}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2, color: "#1A3418" }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#888", lineHeight: 1.4 }}>
                      {badge.description}
                    </div>
                    {unlocked && (
                      <div style={{ fontSize: 10, color: "#26562F", fontWeight: 700, marginTop: 6 }}>
                        UPPLAST
                      </div>
                    )}
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