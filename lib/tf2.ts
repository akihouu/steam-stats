import type {
  CS2RawStats,
  PlayerAchievement,
  SteamGameStat,
  TF2ClassStat,
  TF2PlayerStats,
} from "./steam-types"

function statValue(stats: SteamGameStat[], name: string): number {
  return stats.find((s) => s.name === name)?.value ?? 0
}

// ---------- TF2 Class Names ----------

const TF2_CLASSES = [
  "Scout",
  "Soldier",
  "Pyro",
  "Demoman",
  "Heavy",
  "Engineer",
  "Medic",
  "Sniper",
  "Spy",
] as const

const CLASS_DISPLAY_NAMES: Record<string, string> = {
  Scout: "Scout",
  Soldier: "Soldier",
  Pyro: "Pyro",
  Demoman: "Demoman",
  Heavy: "Heavy",
  Engineer: "Engineer",
  Medic: "Medic",
  Sniper: "Sniper",
  Spy: "Spy",
}

// ---------- Stat Parsing ----------

export function parseTF2Stats(
  raw: CS2RawStats,
  steamid: string,
  playtimeMinutes?: number
): TF2PlayerStats {
  const s = raw.stats

  // Class-specific stats
  const classes: TF2ClassStat[] = TF2_CLASSES.map((cls) => ({
    className: CLASS_DISPLAY_NAMES[cls] ?? cls,
    playtime: statValue(s, `${cls}.accum.iPlayTime`),
    kills: statValue(s, `${cls}.accum.iNumberOfKills`),
    assists: statValue(s, `${cls}.accum.iKillAssists`),
    deaths: statValue(s, `${cls}.accum.iNumberOfDeaths`),
    damage: statValue(s, `${cls}.accum.iDamageDealt`),
    points: statValue(s, `${cls}.accum.iPointsScored`),
  }))
    .filter((c) => c.playtime > 0 || c.kills > 0)
    .sort((a, b) => b.playtime - a.playtime)

  // Aggregate stats across all classes
  const totalKills = classes.reduce((sum, c) => sum + c.kills, 0)
  const totalDeaths = classes.reduce((sum, c) => sum + c.deaths, 0)
  const totalDamage = classes.reduce((sum, c) => sum + c.damage, 0)
  const totalPoints = classes.reduce((sum, c) => sum + c.points, 0)

  // Use playtime_forever from GetOwnedGames when available
  const totalPlaytime =
    playtimeMinutes !== undefined
      ? playtimeMinutes * 60
      : classes.reduce((sum, c) => sum + c.playtime, 0)

  // Aggregate combat stats
  const totalCaptures =
    statValue(s, "Scout.accum.iPointCaptures") +
    statValue(s, "Soldier.accum.iPointCaptures") +
    statValue(s, "Pyro.accum.iPointCaptures") +
    statValue(s, "Demoman.accum.iPointCaptures") +
    statValue(s, "Heavy.accum.iPointCaptures") +
    statValue(s, "Engineer.accum.iPointCaptures") +
    statValue(s, "Medic.accum.iPointCaptures") +
    statValue(s, "Sniper.accum.iPointCaptures") +
    statValue(s, "Spy.accum.iPointCaptures")

  const totalDefenses =
    statValue(s, "Scout.accum.iPointDefenses") +
    statValue(s, "Soldier.accum.iPointDefenses") +
    statValue(s, "Pyro.accum.iPointDefenses") +
    statValue(s, "Demoman.accum.iPointDefenses") +
    statValue(s, "Heavy.accum.iPointDefenses") +
    statValue(s, "Engineer.accum.iPointDefenses") +
    statValue(s, "Medic.accum.iPointDefenses") +
    statValue(s, "Sniper.accum.iPointDefenses") +
    statValue(s, "Spy.accum.iPointDefenses")

  const totalDominations =
    statValue(s, "Scout.accum.iDominations") +
    statValue(s, "Soldier.accum.iDominations") +
    statValue(s, "Pyro.accum.iDominations") +
    statValue(s, "Demoman.accum.iDominations") +
    statValue(s, "Heavy.accum.iDominations") +
    statValue(s, "Engineer.accum.iDominations") +
    statValue(s, "Medic.accum.iDominations") +
    statValue(s, "Sniper.accum.iDominations") +
    statValue(s, "Spy.accum.iDominations")

  const totalRevenges =
    statValue(s, "Scout.accum.iRevenge") +
    statValue(s, "Soldier.accum.iRevenge") +
    statValue(s, "Pyro.accum.iRevenge") +
    statValue(s, "Demoman.accum.iRevenge") +
    statValue(s, "Heavy.accum.iRevenge") +
    statValue(s, "Engineer.accum.iRevenge") +
    statValue(s, "Medic.accum.iRevenge") +
    statValue(s, "Sniper.accum.iRevenge") +
    statValue(s, "Spy.accum.iRevenge")

  // Class-specific highlight stats
  const totalHeadshots = statValue(s, "Sniper.accum.iHeadshots")
  const totalBackstabs = statValue(s, "Spy.accum.iBackstabs")
  const totalHealingDone = statValue(s, "Medic.accum.iHealthPointsHealed")
  const totalBuildingsBuilt = statValue(s, "Engineer.accum.iBuildingsBuilt")
  const totalBuildingsDestroyed =
    statValue(s, "Spy.accum.iBuildingsDestroyed") +
    statValue(s, "Demoman.accum.iBuildingsDestroyed") +
    statValue(s, "Soldier.accum.iBuildingsDestroyed")
  const totalSentryKills = statValue(s, "Engineer.accum.iSentryKills")
  const totalTeleports = statValue(s, "Engineer.accum.iNumTeleports")
  const totalInvulns = statValue(s, "Medic.accum.iNumInvulnerable")

  return {
    steamid,
    totalKills,
    totalDeaths,
    kdRatio: totalDeaths > 0 ? totalKills / totalDeaths : totalKills,
    totalPointsScored: totalPoints,
    totalDamage,
    totalPlaytime,
    totalCaptures,
    totalDefenses,
    totalDominations,
    totalRevenges,
    totalHeadshots,
    totalBackstabs,
    totalHealingDone,
    totalBuildingsBuilt,
    totalBuildingsDestroyed,
    totalSentryKills,
    totalTeleports,
    totalInvulns,
    classes,
    achievements: getAchievements(raw),
  }
}

function getAchievements(raw: CS2RawStats): PlayerAchievement[] {
  if (!raw.achievements) return []
  return raw.achievements.map((a) => ({
    name: a.name,
    achieved: a.achieved === 1,
  }))
}

// ---------- Formatting ----------

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

// ---------- Fun Facts ----------

export interface FunFact {
  emoji: string
  text: string
}

export function generateFunFacts(
  userStats: TF2PlayerStats,
  friendStats: TF2PlayerStats[],
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

  // Most kills
  const mostKills = [...allStats].sort((a, b) => b.totalKills - a.totalKills)
  if (mostKills[0].steamid === userStats.steamid) {
    facts.push({
      emoji: "🔫",
      text: `${userName} leads the group with ${formatNumber(userStats.totalKills)} total kills`,
    })
  }

  // Favorite class
  if (userStats.classes.length > 0) {
    const fav = userStats.classes[0]
    facts.push({
      emoji: "❤️",
      text: `${userName}'s favorite class is ${fav.className} with ${formatPlaytime(fav.playtime)} of playtime`,
    })
  }

  // Sniper headshots
  if (userStats.totalHeadshots > 100) {
    facts.push({
      emoji: "🎯",
      text: `${userName} has landed ${formatNumber(userStats.totalHeadshots)} headshots as Sniper`,
    })
  }

  // Spy backstabs
  if (userStats.totalBackstabs > 100) {
    facts.push({
      emoji: "🔪",
      text: `${userName} has ${formatNumber(userStats.totalBackstabs)} backstabs — a sneaky one`,
    })
  }

  // Medic healing
  if (userStats.totalHealingDone > 0) {
    const mostHealing = [...allStats].sort(
      (a, b) => b.totalHealingDone - a.totalHealingDone
    )
    if (mostHealing[0].steamid === userStats.steamid) {
      facts.push({
        emoji: "💚",
        text: `${userName} is the group's top healer with ${formatNumber(userStats.totalHealingDone)} HP healed`,
      })
    }
  }

  // Engineer buildings
  if (userStats.totalBuildingsBuilt > 50) {
    facts.push({
      emoji: "🔧",
      text: `${userName} has built ${formatNumber(userStats.totalBuildingsBuilt)} buildings as Engineer`,
    })
  }

  // Dominations
  if (userStats.totalDominations > 0) {
    const mostDom = [...allStats].sort(
      (a, b) => b.totalDominations - a.totalDominations
    )
    if (mostDom[0].steamid === userStats.steamid) {
      facts.push({
        emoji: "💀",
        text: `${userName} has the most dominations (${formatNumber(userStats.totalDominations)}) — absolute menace`,
      })
    }
  }

  // Playtime
  const mostPlaytime = [...allStats].sort(
    (a, b) => b.totalPlaytime - a.totalPlaytime
  )
  if (mostPlaytime[0].steamid === userStats.steamid) {
    facts.push({
      emoji: "⏰",
      text: `${userName} has the most playtime in the group at ${formatPlaytime(userStats.totalPlaytime)}`,
    })
  }

  return facts.slice(0, 6)
}
