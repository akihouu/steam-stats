import type {
  CS2PlayerStats,
  CS2RawStats,
  MapStat,
  PlayerAchievement,
  SteamGameStat,
  WeaponAccuracy,
  WeaponStat,
} from "./steam-types"

function statValue(stats: SteamGameStat[], name: string): number {
  return stats.find((s) => s.name === name)?.value ?? 0
}

const WEAPON_NAMES: Record<string, string> = {
  ak47: "AK-47",
  m4a1: "M4A1-S / M4A4",
  awp: "AWP",
  deagle: "Desert Eagle",
  p90: "P90",
  glock: "Glock-18",
  hkp2000: "P2000 / USP-S",
  famas: "FAMAS",
  elite: "Dual Berettas",
  fiveseven: "Five-SeveN",
  aug: "AUG",
  sg556: "SG 553",
  ssg08: "SSG 08",
  mac10: "MAC-10",
  mp7: "MP7",
  mp9: "MP9",
  ump45: "UMP-45",
  bizon: "PP-Bizon",
  p250: "P250",
  tec9: "Tec-9",
  negev: "Negev",
  m249: "M249",
  scar20: "SCAR-20",
  g3sg1: "G3SG1",
  nova: "Nova",
  xm1014: "XM1014",
  sawedoff: "Sawed-Off",
  mag7: "MAG-7",
  galilar: "Galil AR",
  mp5sd: "MP5-SD",
  knife: "Knife",
  hegrenade: "HE Grenade",
  molotov: "Molotov",
  taser: "Zeus x27",
}

const MAP_DISPLAY_NAMES: Record<string, string> = {
  de_dust2: "Dust 2",
  de_inferno: "Inferno",
  de_mirage: "Mirage",
  de_nuke: "Nuke",
  de_overpass: "Overpass",
  de_vertigo: "Vertigo",
  de_ancient: "Ancient",
  de_anubis: "Anubis",
  de_train: "Train",
  de_cache: "Cache",
  de_cobblestone: "Cobblestone",
  cs_office: "Office",
  cs_italy: "Italy",
}

export function parseCS2Stats(
  raw: CS2RawStats,
  steamid: string,
  playtimeMinutes?: number
): CS2PlayerStats {
  const s = raw.stats

  const totalKills = statValue(s, "total_kills")
  const totalDeaths = statValue(s, "total_deaths")
  const totalWins = statValue(s, "total_wins")
  const totalRounds = statValue(s, "total_rounds_played")
  const totalHeadshots = statValue(s, "total_kills_headshot")

  // Use playtime_forever from GetOwnedGames (minutes) when available,
  // as total_time_played from stats API is cumulative in-round seconds
  // and doesn't reflect real-world playtime
  const totalTimePlayed =
    playtimeMinutes !== undefined
      ? playtimeMinutes * 60 // convert minutes to seconds
      : statValue(s, "total_time_played")

  const totalShotsFired = statValue(s, "total_shots_fired")
  const totalShotsHit = statValue(s, "total_shots_hit")

  return {
    steamid,
    totalKills,
    totalDeaths,
    totalWins,
    totalTimePlayed,
    kdRatio: totalDeaths > 0 ? totalKills / totalDeaths : totalKills,
    winRate: totalRounds > 0 ? (totalWins / totalRounds) * 100 : 0,
    headshotPercentage:
      totalKills > 0 ? (totalHeadshots / totalKills) * 100 : 0,
    totalMvps: statValue(s, "total_mvps"),
    totalDamage: statValue(s, "total_damage_done"),
    totalMoneyEarned: statValue(s, "total_money_earned"),
    totalWeaponsDonated: statValue(s, "total_weapons_donated"),
    totalBrokenWindows: statValue(s, "total_broken_windows"),
    totalPlantedBombs: statValue(s, "total_planted_bombs"),
    totalDefusedBombs: statValue(s, "total_defused_bombs"),
    totalKnifeKills: statValue(s, "total_kills_knife"),
    lastMatchKills: statValue(s, "last_match_kills"),
    lastMatchDeaths: statValue(s, "last_match_deaths"),
    totalShotsFired,
    totalShotsHit,
    accuracy: totalShotsFired > 0 ? (totalShotsHit / totalShotsFired) * 100 : 0,
    weaponAccuracy: getWeaponAccuracy(s),
    achievements: getAchievements(raw),
    weapons: getWeaponStats(s),
    maps: getMapStats(s),
  }
}

function getWeaponStats(stats: SteamGameStat[]): WeaponStat[] {
  const weapons: WeaponStat[] = []
  for (const stat of stats) {
    const match = stat.name.match(/^total_kills_(.+)$/)
    if (
      match &&
      match[1] !== "headshot" &&
      match[1] !== "enemy_weapon" &&
      match[1] !== "enemy_blinded" &&
      match[1] !== "knife_fight" &&
      stat.value > 0
    ) {
      weapons.push({
        weapon: WEAPON_NAMES[match[1]] ?? match[1],
        kills: stat.value,
      })
    }
  }
  return weapons.sort((a, b) => b.kills - a.kills)
}

const AGGREGATE_SHOT_KEYS = new Set(["fired", "hit"])

function getWeaponAccuracy(stats: SteamGameStat[]): WeaponAccuracy[] {
  const accuracy: WeaponAccuracy[] = []
  const shotMap = new Map<string, number>()
  const hitMap = new Map<string, number>()

  for (const stat of stats) {
    const shotMatch = stat.name.match(/^total_shots_(.+)$/)
    if (shotMatch && stat.value > 0 && !AGGREGATE_SHOT_KEYS.has(shotMatch[1])) {
      shotMap.set(shotMatch[1], stat.value)
    }
    const hitMatch = stat.name.match(/^total_hits_(.+)$/)
    if (hitMatch && stat.value > 0) {
      hitMap.set(hitMatch[1], stat.value)
    }
  }

  for (const [weapon, shots] of shotMap) {
    const hits = hitMap.get(weapon) ?? 0
    if (shots > 0) {
      accuracy.push({
        weapon: WEAPON_NAMES[weapon] ?? weapon,
        shots,
        hits,
        accuracy: (hits / shots) * 100,
      })
    }
  }

  return accuracy.sort((a, b) => b.shots - a.shots)
}

function getAchievements(raw: CS2RawStats): PlayerAchievement[] {
  if (!raw.achievements) return []
  return raw.achievements.map((a) => ({
    name: a.name,
    achieved: a.achieved === 1,
  }))
}

function getMapStats(stats: SteamGameStat[]): MapStat[] {
  const maps: MapStat[] = []
  for (const stat of stats) {
    const match = stat.name.match(/^total_wins_map_(.+)$/)
    if (match && stat.value > 0) {
      maps.push({
        map: MAP_DISPLAY_NAMES[match[1]] ?? match[1],
        wins: stat.value,
      })
    }
  }
  return maps.sort((a, b) => b.wins - a.wins)
}

export function formatPlaytime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  if (hours > 0) return `${hours.toLocaleString()}h`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m`
}

export function formatNumber(n: number): string {
  return n.toLocaleString()
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`
}

export function formatKD(n: number): string {
  return n.toFixed(2)
}

export interface FunFact {
  emoji: string
  text: string
}

export function generateFunFacts(
  userStats: CS2PlayerStats,
  friendStats: CS2PlayerStats[],
  userName: string
): FunFact[] {
  const facts: FunFact[] = []
  const allStats = [userStats, ...friendStats]

  // Best K/D ratio
  const bestKD = [...allStats].sort((a, b) => b.kdRatio - a.kdRatio)
  const userKDRank =
    bestKD.findIndex((s) => s.steamid === userStats.steamid) + 1
  if (userKDRank === 1) {
    facts.push({
      emoji: "👑",
      text: `${userName} has the best K/D ratio in the group at ${formatKD(userStats.kdRatio)}`,
    })
  } else {
    facts.push({
      emoji: "📊",
      text: `${userName}'s K/D of ${formatKD(userStats.kdRatio)} ranks #${userKDRank} among friends`,
    })
  }

  // Most kills total
  const mostKills = [...allStats].sort((a, b) => b.totalKills - a.totalKills)
  if (mostKills[0].steamid === userStats.steamid) {
    facts.push({
      emoji: "🔫",
      text: `${userName} leads the group with ${formatNumber(userStats.totalKills)} total kills`,
    })
  }

  // Headshot percentage comparison
  if (userStats.headshotPercentage > 50) {
    facts.push({
      emoji: "🎯",
      text: `${userName} lands headshots ${formatPercent(userStats.headshotPercentage)} of the time — a true sharpshooter`,
    })
  }

  // Knife kills
  if (userStats.totalKnifeKills > 100) {
    const totalFriendKnifeKills = friendStats.reduce(
      (sum, s) => sum + s.totalKnifeKills,
      0
    )
    if (userStats.totalKnifeKills > totalFriendKnifeKills) {
      facts.push({
        emoji: "🔪",
        text: `${userName} has more knife kills (${formatNumber(userStats.totalKnifeKills)}) than all friends combined`,
      })
    }
  }

  // Bomb plants
  if (userStats.totalPlantedBombs > 0) {
    const bombRank = [...allStats]
      .sort((a, b) => b.totalPlantedBombs - a.totalPlantedBombs)
      .findIndex((s) => s.steamid === userStats.steamid)
    if (bombRank === 0) {
      facts.push({
        emoji: "💣",
        text: `${userName} is the bomb planting champion with ${formatNumber(userStats.totalPlantedBombs)} plants`,
      })
    }
  }

  // MVP awards
  if (userStats.totalMvps > 0) {
    facts.push({
      emoji: "⭐",
      text: `${userName} has earned ${formatNumber(userStats.totalMvps)} MVP stars — that's roughly ${Math.round((userStats.totalMvps / Math.max(1, userStats.totalWins)) * 100)}% of wins`,
    })
  }

  // Favorite weapon
  if (userStats.weapons.length > 0) {
    facts.push({
      emoji: "❤️",
      text: `${userName}'s weapon of choice is the ${userStats.weapons[0].weapon} with ${formatNumber(userStats.weapons[0].kills)} kills`,
    })
  }

  // Playtime comparison
  const mostPlaytime = [...allStats].sort(
    (a, b) => b.totalTimePlayed - a.totalTimePlayed
  )
  if (mostPlaytime[0].steamid === userStats.steamid) {
    facts.push({
      emoji: "⏰",
      text: `${userName} has the most playtime in the group at ${formatPlaytime(userStats.totalTimePlayed)}`,
    })
  }

  // Broken windows easter egg
  if (userStats.totalBrokenWindows > 50) {
    facts.push({
      emoji: "🪟",
      text: `${userName} has broken ${formatNumber(userStats.totalBrokenWindows)} windows. Someone's a menace.`,
    })
  }

  return facts.slice(0, 6)
}
