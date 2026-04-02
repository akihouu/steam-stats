import "server-only"

import type { Dota2HeroStat, Dota2PlayerStats } from "./steam-types"

const OPENDOTA_API = "https://api.opendota.com/api"

// Convert Steam 64-bit ID to 32-bit account ID for OpenDota
export function steamIdToAccountId(steamid: string): number {
  return Number(BigInt(steamid) - BigInt("76561197960265728"))
}

// ---------- Dota 2 Hero Names ----------

const HERO_NAMES: Record<number, string> = {
  1: "Anti-Mage",
  2: "Axe",
  3: "Bane",
  4: "Bloodseeker",
  5: "Crystal Maiden",
  6: "Drow Ranger",
  7: "Earthshaker",
  8: "Juggernaut",
  9: "Mirana",
  10: "Morphling",
  11: "Shadow Fiend",
  12: "Phantom Lancer",
  13: "Puck",
  14: "Pudge",
  15: "Razor",
  16: "Sand King",
  17: "Storm Spirit",
  18: "Sven",
  19: "Tiny",
  20: "Vengeful Spirit",
  21: "Windranger",
  22: "Zeus",
  23: "Kunkka",
  25: "Lina",
  26: "Lion",
  27: "Shadow Shaman",
  28: "Slardar",
  29: "Tidehunter",
  30: "Witch Doctor",
  31: "Lich",
  32: "Riki",
  33: "Enigma",
  34: "Tinker",
  35: "Sniper",
  36: "Necrophos",
  37: "Warlock",
  38: "Beastmaster",
  39: "Queen of Pain",
  40: "Venomancer",
  41: "Faceless Void",
  42: "Wraith King",
  43: "Death Prophet",
  44: "Phantom Assassin",
  45: "Pugna",
  46: "Templar Assassin",
  47: "Viper",
  48: "Luna",
  49: "Dragon Knight",
  50: "Dazzle",
  51: "Clockwerk",
  52: "Leshrac",
  53: "Nature's Prophet",
  54: "Lifestealer",
  55: "Dark Seer",
  56: "Clinkz",
  57: "Omniknight",
  58: "Enchantress",
  59: "Huskar",
  60: "Night Stalker",
  61: "Broodmother",
  62: "Bounty Hunter",
  63: "Weaver",
  64: "Jakiro",
  65: "Batrider",
  66: "Chen",
  67: "Spectre",
  68: "Ancient Apparition",
  69: "Doom",
  70: "Ursa",
  71: "Spirit Breaker",
  72: "Gyrocopter",
  73: "Alchemist",
  74: "Invoker",
  75: "Silencer",
  76: "Outworld Destroyer",
  77: "Lycan",
  78: "Brewmaster",
  79: "Shadow Demon",
  80: "Lone Druid",
  81: "Chaos Knight",
  82: "Meepo",
  83: "Treant Protector",
  84: "Ogre Magi",
  85: "Undying",
  86: "Rubick",
  87: "Disruptor",
  88: "Nyx Assassin",
  89: "Naga Siren",
  90: "Keeper of the Light",
  91: "Io",
  92: "Visage",
  93: "Slark",
  94: "Medusa",
  95: "Troll Warlord",
  96: "Centaur Warrunner",
  97: "Magnus",
  98: "Timbersaw",
  99: "Bristleback",
  100: "Tusk",
  101: "Skywrath Mage",
  102: "Abaddon",
  103: "Elder Titan",
  104: "Legion Commander",
  105: "Techies",
  106: "Ember Spirit",
  107: "Earth Spirit",
  108: "Underlord",
  109: "Terrorblade",
  110: "Phoenix",
  111: "Oracle",
  112: "Winter Wyvern",
  113: "Arc Warden",
  114: "Monkey King",
  119: "Dark Willow",
  120: "Pangolier",
  121: "Grimstroke",
  123: "Hoodwink",
  126: "Void Spirit",
  128: "Snapfire",
  129: "Mars",
  131: "Ringmaster",
  135: "Dawnbreaker",
  136: "Marci",
  137: "Primal Beast",
  138: "Muerta",
  145: "Kez",
}

// ---------- OpenDota API Fetchers ----------

interface OpenDotaWinLoss {
  win: number
  lose: number
}

interface OpenDotaHero {
  hero_id: string
  games: number
  win: number
  last_played: number
}

interface OpenDotaTotal {
  field: string
  n: number
  sum: number
}

async function openDotaFetch<T>(path: string): Promise<T | null> {
  const res = await fetch(`${OPENDOTA_API}${path}`, {
    next: { revalidate: 600 },
  } as RequestInit)

  if (!res.ok) return null
  return res.json() as Promise<T>
}

export async function getDota2Stats(
  steamid: string
): Promise<Dota2PlayerStats | null> {
  const accountId = steamIdToAccountId(steamid)

  const [wl, heroes, totals] = await Promise.all([
    openDotaFetch<OpenDotaWinLoss>(`/players/${accountId}/wl`),
    openDotaFetch<OpenDotaHero[]>(`/players/${accountId}/heroes`),
    openDotaFetch<OpenDotaTotal[]>(`/players/${accountId}/totals`),
  ])

  if (!wl) return null

  const totalMap = new Map<string, { n: number; sum: number }>()
  if (totals) {
    for (const t of totals) {
      totalMap.set(t.field, { n: t.n, sum: t.sum })
    }
  }

  function total(field: string): number {
    return totalMap.get(field)?.sum ?? 0
  }

  function avg(field: string): number {
    const entry = totalMap.get(field)
    if (!entry || entry.n === 0) return 0
    return entry.sum / entry.n
  }

  const totalKills = total("kills")
  const totalDeaths = total("deaths")
  const totalAssists = total("assists")
  const totalWins = wl.win
  const totalLosses = wl.lose
  const totalGames = totalWins + totalLosses

  const heroStats: Dota2HeroStat[] = (heroes ?? [])
    .filter((h) => h.games > 0)
    .map((h) => {
      const heroId = Number(h.hero_id)
      return {
        heroId,
        heroName: HERO_NAMES[heroId] ?? `Hero ${heroId}`,
        games: h.games,
        wins: h.win,
        winRate: h.games > 0 ? (h.win / h.games) * 100 : 0,
      }
    })
    .sort((a, b) => b.games - a.games)

  return {
    steamid,
    totalKills,
    totalDeaths,
    totalAssists,
    kdaRatio:
      totalDeaths > 0
        ? (totalKills + totalAssists) / totalDeaths
        : totalKills + totalAssists,
    totalWins,
    totalLosses,
    winRate: totalGames > 0 ? (totalWins / totalGames) * 100 : 0,
    totalLastHits: total("last_hits"),
    totalDenies: total("denies"),
    totalGoldPerMin: avg("gold_per_min"),
    totalXpPerMin: avg("xp_per_min"),
    totalHeroDamage: total("hero_damage"),
    totalHeroHealing: total("hero_healing"),
    totalTowerDamage: total("tower_damage"),
    totalTimePlayed: total("duration"),
    heroes: heroStats,
    achievements: [],
  }
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

export function formatKDA(n: number): string {
  return n.toFixed(2)
}

// ---------- Fun Facts ----------

export interface FunFact {
  emoji: string
  text: string
}

export function generateFunFacts(
  userStats: Dota2PlayerStats,
  friendStats: Dota2PlayerStats[],
  userName: string
): FunFact[] {
  const facts: FunFact[] = []
  const allStats = [userStats, ...friendStats]

  // Best KDA
  const bestKDA = [...allStats].sort((a, b) => b.kdaRatio - a.kdaRatio)
  const userKDARank =
    bestKDA.findIndex((s) => s.steamid === userStats.steamid) + 1
  if (userKDARank === 1) {
    facts.push({
      emoji: "👑",
      text: `${userName} has the best KDA in the group at ${formatKDA(userStats.kdaRatio)}`,
    })
  } else {
    facts.push({
      emoji: "📊",
      text: `${userName}'s KDA of ${formatKDA(userStats.kdaRatio)} ranks #${userKDARank} among friends`,
    })
  }

  // Most wins
  const mostWins = [...allStats].sort((a, b) => b.totalWins - a.totalWins)
  if (mostWins[0].steamid === userStats.steamid) {
    facts.push({
      emoji: "🏆",
      text: `${userName} leads the group with ${formatNumber(userStats.totalWins)} wins`,
    })
  }

  // Win rate
  if (userStats.winRate > 55) {
    facts.push({
      emoji: "🎯",
      text: `${userName} wins ${formatPercent(userStats.winRate)} of games — well above average`,
    })
  }

  // Most kills
  const mostKills = [...allStats].sort((a, b) => b.totalKills - a.totalKills)
  if (mostKills[0].steamid === userStats.steamid) {
    facts.push({
      emoji: "⚔️",
      text: `${userName} leads the group with ${formatNumber(userStats.totalKills)} total kills`,
    })
  }

  // Favorite hero
  if (userStats.heroes.length > 0) {
    const fav = userStats.heroes[0]
    facts.push({
      emoji: "❤️",
      text: `${userName}'s most-played hero is ${fav.heroName} with ${formatNumber(fav.games)} games (${formatPercent(fav.winRate)} WR)`,
    })
  }

  // Support player check (healing)
  if (userStats.totalHeroHealing > 0) {
    const mostHealing = [...allStats].sort(
      (a, b) => b.totalHeroHealing - a.totalHeroHealing
    )
    if (mostHealing[0].steamid === userStats.steamid) {
      facts.push({
        emoji: "💚",
        text: `${userName} is the group's top healer with ${formatNumber(userStats.totalHeroHealing)} total hero healing`,
      })
    }
  }

  // Tower damage
  if (userStats.totalTowerDamage > 0) {
    const mostTower = [...allStats].sort(
      (a, b) => b.totalTowerDamage - a.totalTowerDamage
    )
    if (mostTower[0].steamid === userStats.steamid) {
      facts.push({
        emoji: "🏰",
        text: `${userName} is the biggest tower threat with ${formatNumber(userStats.totalTowerDamage)} tower damage`,
      })
    }
  }

  // GPM
  if (userStats.totalGoldPerMin > 500) {
    facts.push({
      emoji: "💰",
      text: `${userName} averages ${Math.round(userStats.totalGoldPerMin)} GPM — a farming machine`,
    })
  }

  // Playtime
  const mostPlaytime = [...allStats].sort(
    (a, b) => b.totalTimePlayed - a.totalTimePlayed
  )
  if (mostPlaytime[0].steamid === userStats.steamid) {
    facts.push({
      emoji: "⏰",
      text: `${userName} has the most playtime in the group at ${formatPlaytime(userStats.totalTimePlayed)}`,
    })
  }

  return facts.slice(0, 6)
}
