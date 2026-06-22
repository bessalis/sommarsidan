import { supabase } from './supabase'

const BADGE_IDS = {
  friluftslasare: 'b763b8da-51c1-478d-9995-8291dcb474de',
  sandlasare: 'a207fd32-3730-4d3f-bc5f-e1561308f8d5',
  hangmattesmastare: '0d2811a4-8dc9-4f11-b3fd-4ad84c18a31a',
  eldssjal: '4a24fd58-f390-4191-b8a1-254cc5e7354d',
  vaglasare: '4c2d9768-fca6-4137-badf-bb68747753b6',
  igang: '252dbfbf-acf0-456a-a414-beddb9ed3e00',
  femtiosidaren: '3619ce79-6be9-40b8-9b13-8d96f7ded34c',
  hundrasidaren: '66534bc4-61d6-4931-bddf-29d5e34adb3d',
  sidodrottning: 'cb4f8748-6ecc-4d46-89d2-5cdbd7843cd0',
  treIRad: '60acae29-9a1a-489f-8fbe-80075370f4eb',
  maratonlasare: '0e538f1e-c9ef-4b7e-857d-79835e88bf59',
}

async function awardBadge(familyMemberId, badgeId) {
  const { data: existing } = await supabase
    .from('user_badges')
    .select('id')
    .eq('family_member_id', familyMemberId)
    .eq('badge_id', badgeId)
    .maybeSingle()
  if (!existing) {
    await supabase.from('user_badges').insert({
      family_member_id: familyMemberId,
      badge_id: badgeId,
      earned_at: new Date().toISOString(),
    })
  }
}

export async function checkAndAwardBadges(familyMemberId) {
  const { data: logs } = await supabase
    .from('reading_logs')
    .select('pages, minutes, date, location_type')
    .eq('family_member_id', familyMemberId)

  if (!logs) return

  const totalPages = logs.reduce((sum, l) => sum + (l.pages || 0), 0)

  const totalMinutesPerDay = {}
  logs.forEach(l => {
    if (l.date) {
      totalMinutesPerDay[l.date] = (totalMinutesPerDay[l.date] || 0) + (l.minutes || 0)
    }
  })

  if (totalPages >= 10) await awardBadge(familyMemberId, BADGE_IDS.igang)
  if (totalPages >= 50) await awardBadge(familyMemberId, BADGE_IDS.femtiosidaren)
  if (totalPages >= 100) await awardBadge(familyMemberId, BADGE_IDS.hundrasidaren)
  if (totalPages >= 500) await awardBadge(familyMemberId, BADGE_IDS.sidodrottning)

  const hasMarathon = Object.values(totalMinutesPerDay).some(m => m >= 60)
  if (hasMarathon) await awardBadge(familyMemberId, BADGE_IDS.maratonlasare)

  const dates = [...new Set(logs.map(l => l.date))].sort()
  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (curr - prev) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      streak++
      if (streak >= 3) {
        await awardBadge(familyMemberId, BADGE_IDS.treIRad)
        break
      }
    } else {
      streak = 1
    }
  }

  const locations = logs.map(l => l.location_type)
  if (locations.includes('utomhus')) await awardBadge(familyMemberId, BADGE_IDS.friluftslasare)
  if (locations.includes('bil')) await awardBadge(familyMemberId, BADGE_IDS.vaglasare)
  if (locations.includes('strand')) await awardBadge(familyMemberId, BADGE_IDS.sandlasare)
  if (locations.includes('hangmatta')) await awardBadge(familyMemberId, BADGE_IDS.hangmattesmastare)
  if (locations.includes('lagereld')) await awardBadge(familyMemberId, BADGE_IDS.eldssjal)
}
