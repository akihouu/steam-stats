import {
  formatKD,
  formatNumber,
  formatPercent,
  formatPlaytime,
} from "./cs2"
import type { CS2PlayerStats } from "./steam-types"

export interface WrappedSlide {
  type: string
  title: string
  value: string
  subtitle: string
  color: string
}

function getSuperlative(
  userStats: CS2PlayerStats,
  friendStats: CS2PlayerStats[]
): { title: string; subtitle: string } {
  const all = [userStats, ...friendStats]

  const kdRank =
    [...all]
      .sort((a, b) => b.kdRatio - a.kdRatio)
      .findIndex((s) => s.steamid === userStats.steamid) + 1
  const killsRank =
    [...all]
      .sort((a, b) => b.totalKills - a.totalKills)
      .findIndex((s) => s.steamid === userStats.steamid) + 1
  const hsRank =
    [...all]
      .sort((a, b) => b.headshotPercentage - a.headshotPercentage)
      .findIndex((s) => s.steamid === userStats.steamid) + 1
  const bombsRank =
    [...all]
      .sort((a, b) => b.totalPlantedBombs - a.totalPlantedBombs)
      .findIndex((s) => s.steamid === userStats.steamid) + 1
  const mvpRank =
    [...all]
      .sort((a, b) => b.totalMvps - a.totalMvps)
      .findIndex((s) => s.steamid === userStats.steamid) + 1

  if (hsRank === 1 && userStats.headshotPercentage > 45)
    return { title: "The Surgeon", subtitle: "Precision personified" }
  if (bombsRank === 1)
    return {
      title: "The Demolition Expert",
      subtitle: "Bomb sites fear you",
    }
  if (kdRank === 1)
    return { title: "The Terminator", subtitle: "Unstoppable force" }
  if (killsRank === 1)
    return { title: "The War Machine", subtitle: "Maximum carnage" }
  if (mvpRank === 1)
    return { title: "The Showstopper", subtitle: "Always in the spotlight" }
  if (userStats.totalKnifeKills > 50)
    return { title: "The Blade Runner", subtitle: "Up close and personal" }
  if (userStats.headshotPercentage > 50)
    return { title: "The Headhunter", subtitle: "One tap wonder" }

  return { title: "The Competitor", subtitle: "Always in the fight" }
}

export function generateWrappedSlides(
  userStats: CS2PlayerStats,
  friendStats: CS2PlayerStats[],
  userName: string
): WrappedSlide[] {
  const slides: WrappedSlide[] = []
  const all = [userStats, ...friendStats]

  // Slide 1: Intro
  slides.push({
    type: "intro",
    title: `${userName}'s CS2 Wrapped`,
    value: "",
    subtitle: "Let's see what you've been up to...",
    color: "from-blue-600 to-purple-600",
  })

  // Slide 2: Total Kills
  const killsRank =
    [...all]
      .sort((a, b) => b.totalKills - a.totalKills)
      .findIndex((s) => s.steamid === userStats.steamid) + 1
  slides.push({
    type: "stat",
    title: "Total Kills",
    value: formatNumber(userStats.totalKills),
    subtitle:
      friendStats.length > 0
        ? `#${killsRank} among your friends`
        : "And counting...",
    color: "from-red-600 to-orange-600",
  })

  // Slide 3: Weapon of Choice
  const topWeapon = userStats.weapons[0]
  if (topWeapon) {
    slides.push({
      type: "weapon",
      title: "Weapon of Choice",
      value: topWeapon.weapon,
      subtitle: `${formatNumber(topWeapon.kills)} kills`,
      color: "from-emerald-600 to-teal-600",
    })
  }

  // Slide 4: Sharpshooter
  slides.push({
    type: "stat",
    title: "Sharpshooter",
    value: formatPercent(userStats.headshotPercentage),
    subtitle: "of your kills were headshots",
    color: "from-amber-600 to-yellow-600",
  })

  // Slide 5: Map Master
  const topMap = userStats.maps[0]
  if (topMap) {
    slides.push({
      type: "map",
      title: "Map Master",
      value: topMap.map,
      subtitle: `${formatNumber(topMap.wins)} wins`,
      color: "from-cyan-600 to-blue-600",
    })
  }

  // Slide 6: Superlative
  const superlative = getSuperlative(userStats, friendStats)
  slides.push({
    type: "superlative",
    title: superlative.title,
    value: "",
    subtitle: superlative.subtitle,
    color: "from-purple-600 to-pink-600",
  })

  // Slide 7: Summary
  slides.push({
    type: "summary",
    title: "Your Stats at a Glance",
    value: "",
    subtitle: [
      `${formatNumber(userStats.totalKills)} kills`,
      `${formatKD(userStats.kdRatio)} K/D`,
      `${formatPercent(userStats.headshotPercentage)} HS`,
      `${formatNumber(userStats.totalWins)} wins`,
      `${formatNumber(userStats.totalMvps)} MVPs`,
      `${formatPlaytime(userStats.totalTimePlayed)} played`,
    ].join(" · "),
    color: "from-indigo-600 to-violet-600",
  })

  return slides
}
