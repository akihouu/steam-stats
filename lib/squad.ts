import type { CS2PlayerStats, SteamPlayer } from "./steam-types"

export interface SquadRole {
  id: string
  name: string
  icon: string
  description: string
}

export const ROLES: SquadRole[] = [
  {
    id: "entry",
    name: "Entry Fragger",
    icon: "swords",
    description: "First in, high kill count",
  },
  {
    id: "awper",
    name: "AWPer",
    icon: "crosshair",
    description: "Long-range specialist",
  },
  {
    id: "support",
    name: "Support",
    icon: "shield",
    description: "Team player & utility",
  },
  {
    id: "lurker",
    name: "Lurker",
    icon: "eye",
    description: "Efficient & precise",
  },
  {
    id: "igl",
    name: "IGL",
    icon: "crown",
    description: "Leader & strategist",
  },
]

export interface SquadMember {
  profile: SteamPlayer
  stats: CS2PlayerStats
  role: SquadRole
  roleScore: number
  strengths: string[]
}

function normalize(values: number[]): number[] {
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  return values.map((v) => (v - min) / range)
}

function getAwpKillRatio(stats: CS2PlayerStats): number {
  const awp = stats.weapons.find(
    (w) => w.weapon === "AWP"
  )
  if (!awp || stats.totalKills === 0) return 0
  return awp.kills / stats.totalKills
}

export function buildDreamTeam(
  allPlayers: { profile: SteamPlayer; stats: CS2PlayerStats }[]
): { members: SquadMember[]; synergyScore: number } {
  if (allPlayers.length === 0) return { members: [], synergyScore: 0 }

  const players = allPlayers.slice(0, 20)

  // Extract raw stat vectors
  const kills = players.map((p) => p.stats.totalKills)
  const kd = players.map((p) => p.stats.kdRatio)
  const hs = players.map((p) => p.stats.headshotPercentage)
  const awpRatio = players.map((p) => getAwpKillRatio(p.stats))
  const donated = players.map((p) => p.stats.totalWeaponsDonated)
  const bombs = players.map(
    (p) => p.stats.totalPlantedBombs + p.stats.totalDefusedBombs
  )
  const mvps = players.map((p) => p.stats.totalMvps)
  const winRate = players.map((p) => p.stats.winRate)

  // Normalize
  const nKills = normalize(kills)
  const nKD = normalize(kd)
  const nHS = normalize(hs)
  const nAwp = normalize(awpRatio)
  const nDonated = normalize(donated)
  const nBombs = normalize(bombs)
  const nMvps = normalize(mvps)
  const nWinRate = normalize(winRate)

  // Score each player for each role
  const roleScores: Record<string, number[]> = {
    entry: players.map(
      (_, i) => nKills[i] * 0.5 + nKD[i] * 0.3 + nHS[i] * 0.2
    ),
    awper: players.map(
      (_, i) => nAwp[i] * 0.6 + nKD[i] * 0.2 + nHS[i] * 0.2
    ),
    support: players.map(
      (_, i) => nDonated[i] * 0.4 + nBombs[i] * 0.4 + nWinRate[i] * 0.2
    ),
    lurker: players.map(
      (_, i) => nKD[i] * 0.4 + nHS[i] * 0.4 + (1 - nKills[i]) * 0.2
    ),
    igl: players.map(
      (_, i) => nMvps[i] * 0.5 + nWinRate[i] * 0.3 + nKD[i] * 0.2
    ),
  }

  // Greedy assignment
  const assigned = new Set<number>()
  const members: SquadMember[] = []

  // Create (role, player, score) tuples, sort by score desc
  const candidates: { roleId: string; playerIdx: number; score: number }[] =
    []
  for (const role of ROLES) {
    const scores = roleScores[role.id]
    for (let i = 0; i < players.length; i++) {
      candidates.push({ roleId: role.id, playerIdx: i, score: scores[i] })
    }
  }
  candidates.sort((a, b) => b.score - a.score)

  const assignedRoles = new Set<string>()
  for (const c of candidates) {
    if (assigned.has(c.playerIdx) || assignedRoles.has(c.roleId)) continue
    const role = ROLES.find((r) => r.id === c.roleId)!
    const player = players[c.playerIdx]

    const strengths: string[] = []
    const killRank =
      [...kills]
        .sort((a, b) => b - a)
        .indexOf(player.stats.totalKills) + 1
    if (killRank <= 3)
      strengths.push(`#${killRank} in kills`)
    if (player.stats.kdRatio >= Math.max(...kd) * 0.9)
      strengths.push("Top K/D")
    const maxHS = hs.some(Boolean) ? Math.max(...hs.filter(Boolean)) : 0
    if (maxHS > 0 && player.stats.headshotPercentage >= maxHS * 0.9)
      strengths.push("Sharp aim")
    if (player.stats.totalMvps >= Math.max(...mvps) * 0.9)
      strengths.push("MVP machine")
    if (getAwpKillRatio(player.stats) >= 0.15)
      strengths.push("AWP specialist")

    members.push({
      profile: player.profile,
      stats: player.stats,
      role,
      roleScore: Math.round(c.score * 100),
      strengths: strengths.slice(0, 2),
    })
    assigned.add(c.playerIdx)
    assignedRoles.add(c.roleId)

    if (members.length >= 5) break
  }

  const avgScore =
    members.length > 0
      ? members.reduce((s, m) => s + m.roleScore, 0) / members.length
      : 0

  return { members, synergyScore: Math.round(avgScore) }
}
