import type { CS2PlayerStats, SteamPlayer } from "./steam-types"
import { formatKD, formatNumber, formatPercent } from "./cs2"

export interface QuizQuestion {
  question: string
  hint: string
  correctId: string
  options: { steamid: string; name: string }[]
}

type PlayerEntry = { profile: SteamPlayer; stats: CS2PlayerStats }

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function makeQuestion(
  question: string,
  hint: string,
  correct: PlayerEntry,
  allPlayers: PlayerEntry[],
  optionCount: number = 4
): QuizQuestion {
  const others = allPlayers.filter(
    (p) => p.profile.steamid !== correct.profile.steamid
  )
  const wrongOptions = pickRandom(others, optionCount - 1)
  const options = [correct, ...wrongOptions]
    .sort(() => Math.random() - 0.5)
    .map((p) => ({
      steamid: p.profile.steamid,
      name: p.profile.personaname,
    }))

  return {
    question,
    hint,
    correctId: correct.profile.steamid,
    options,
  }
}

export function generateQuizQuestions(
  players: PlayerEntry[]
): QuizQuestion[] {
  if (players.length < 2) return []

  const questions: QuizQuestion[] = []
  const pool = players.length >= 4 ? players : players

  // Most kills
  const mostKills = [...pool].sort(
    (a, b) => b.stats.totalKills - a.stats.totalKills
  )[0]
  questions.push(
    makeQuestion(
      "Who has the most total kills?",
      `${formatNumber(mostKills.stats.totalKills)} kills`,
      mostKills,
      pool
    )
  )

  // Best K/D
  const bestKD = [...pool].sort(
    (a, b) => b.stats.kdRatio - a.stats.kdRatio
  )[0]
  questions.push(
    makeQuestion(
      "Who has the best K/D ratio?",
      `${formatKD(bestKD.stats.kdRatio)} K/D`,
      bestKD,
      pool
    )
  )

  // Best HS%
  const bestHS = [...pool].sort(
    (a, b) =>
      b.stats.headshotPercentage - a.stats.headshotPercentage
  )[0]
  questions.push(
    makeQuestion(
      "Who has the highest headshot percentage?",
      `${formatPercent(bestHS.stats.headshotPercentage)}`,
      bestHS,
      pool
    )
  )

  // Most wins
  const mostWins = [...pool].sort(
    (a, b) => b.stats.totalWins - a.stats.totalWins
  )[0]
  questions.push(
    makeQuestion(
      "Who has the most wins?",
      `${formatNumber(mostWins.stats.totalWins)} wins`,
      mostWins,
      pool
    )
  )

  // Most MVPs
  const mostMVPs = [...pool].sort(
    (a, b) => b.stats.totalMvps - a.stats.totalMvps
  )[0]
  questions.push(
    makeQuestion(
      "Who has earned the most MVP stars?",
      `${formatNumber(mostMVPs.stats.totalMvps)} MVPs`,
      mostMVPs,
      pool
    )
  )

  // Most bomb plants
  const mostBombs = [...pool].sort(
    (a, b) => b.stats.totalPlantedBombs - a.stats.totalPlantedBombs
  )[0]
  if (mostBombs.stats.totalPlantedBombs > 0) {
    questions.push(
      makeQuestion(
        "Who has planted the most bombs?",
        `${formatNumber(mostBombs.stats.totalPlantedBombs)} plants`,
        mostBombs,
        pool
      )
    )
  }

  // Favorite weapon questions — only if the answer is unambiguous
  const weaponUsers = pool.filter((p) => p.stats.weapons.length > 0)
  if (weaponUsers.length >= 2) {
    // Find a player whose top weapon is unique among the group
    const shuffled = pickRandom(weaponUsers, weaponUsers.length)
    const uniqueWeaponUser = shuffled.find((player) => {
      const topWeapon = player.stats.weapons[0].weapon
      return weaponUsers.filter(
        (p) => p.stats.weapons[0]?.weapon === topWeapon
      ).length === 1
    })
    if (uniqueWeaponUser) {
      const favWeapon = uniqueWeaponUser.stats.weapons[0]
      questions.push(
        makeQuestion(
          `Whose favorite weapon is the ${favWeapon.weapon}?`,
          `${formatNumber(favWeapon.kills)} kills with it`,
          uniqueWeaponUser,
          pool
        )
      )
    }
  }

  // Most playtime
  const mostPlaytime = [...pool].sort(
    (a, b) => b.stats.totalTimePlayed - a.stats.totalTimePlayed
  )[0]
  questions.push(
    makeQuestion(
      "Who has the most playtime?",
      `${Math.floor(mostPlaytime.stats.totalTimePlayed / 3600)}h`,
      mostPlaytime,
      pool
    )
  )

  // Shuffle and limit
  return questions.sort(() => Math.random() - 0.5).slice(0, 7)
}
