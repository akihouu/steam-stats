"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { calculateAchievementRarity } from "@/lib/achievements"
import {
  formatKD,
  formatNumber,
  formatPercent,
  formatPlaytime,
  generateFunFacts,
} from "@/lib/cs2"
import { staggerContainer, fadeIn } from "@/lib/motion"
import type { CS2PlayerStats, SteamPlayer } from "@/lib/steam-types"
import {
  Bomb,
  Clock,
  Crosshair,
  Medal,
  Skull,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
} from "lucide-react"
import { motion as m } from "motion/react"
import { useState } from "react"
import { AccuracyStats } from "./accuracy-stats"
import { Achievements } from "./achievements"
import { ComparisonCard } from "./comparison-card"
import { FunFacts } from "./fun-facts"
import { Leaderboard } from "./leaderboard"
import { MapStats } from "./map-stats"
import { Milestones } from "./milestones"
import { ShareButton } from "./share-button"
import { SquadBuilder } from "./squad-builder"
import { StatCard } from "./stat-card"
import { WeaponChart } from "./weapon-chart"
import { WeaponMastery } from "./weapon-mastery"
import { WeaponRadar } from "./weapon-radar"
import { WrappedOverlay } from "./wrapped-overlay"

interface StatsViewProps {
  userProfile: SteamPlayer
  userStats: CS2PlayerStats
  friendData: { profile: SteamPlayer; stats: CS2PlayerStats }[]
}

export function StatsView({
  userProfile,
  userStats,
  friendData,
}: StatsViewProps) {
  const [showWrapped, setShowWrapped] = useState(false)

  const funFacts = generateFunFacts(
    userStats,
    friendData.map((f) => f.stats),
    userProfile.personaname
  )

  const allPlayers = [
    { profile: userProfile, stats: userStats },
    ...friendData,
  ]

  const achievementsWithRarity = calculateAchievementRarity(
    userStats.achievements,
    friendData.map((f) => f.stats.achievements)
  )

  return (
    <m.div
      className="flex flex-col gap-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {showWrapped && (
        <WrappedOverlay
          userStats={userStats}
          friendStats={friendData.map((f) => f.stats)}
          userName={userProfile.personaname}
          onClose={() => setShowWrapped(false)}
        />
      )}

      {/* Overview Stats */}
      <m.section variants={fadeIn}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your CS2 Stats</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWrapped(true)}
              className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <Sparkles className="size-3.5" />
              <span className="hidden sm:inline">Your Wrapped</span>
            </button>
            <ShareButton steamId={userProfile.steamid} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard
            label="Total Kills"
            value={userStats.totalKills}
            icon={Crosshair}
            highlight
          />
          <StatCard
            label="Total Deaths"
            value={userStats.totalDeaths}
            icon={Skull}
          />
          <StatCard
            label="K/D Ratio"
            value={userStats.kdRatio}
            format={formatKD}
            icon={Swords}
            highlight
          />
          <StatCard
            label="Win Rate"
            value={userStats.winRate}
            format={formatPercent}
            icon={Trophy}
          />
          <StatCard
            label="Headshot %"
            value={userStats.headshotPercentage}
            format={formatPercent}
            icon={Target}
            highlight
          />
          <StatCard
            label="Total Wins"
            value={userStats.totalWins}
            icon={Medal}
          />
          <StatCard
            label="MVP Stars"
            value={userStats.totalMvps}
            icon={Star}
          />
          <StatCard
            label="Playtime"
            value={userStats.totalTimePlayed}
            format={formatPlaytime}
            icon={Clock}
          />
          <StatCard
            label="Bombs Planted"
            value={userStats.totalPlantedBombs}
            icon={Bomb}
          />
          <StatCard
            label="Bombs Defused"
            value={userStats.totalDefusedBombs}
            icon={Bomb}
            subtitle="🛡️ Counter-terrorist duty"
          />
          <StatCard
            label="Total Damage"
            value={userStats.totalDamage}
            icon={Crosshair}
          />
          <StatCard
            label="Money Earned"
            value={userStats.totalMoneyEarned}
            format={(n) => `$${formatNumber(n)}`}
            icon={Star}
          />
        </div>
      </m.section>

      {/* Fun Facts */}
      {funFacts.length > 0 && (
        <m.section variants={fadeIn}>
          <h2 className="mb-4 text-xl font-semibold">Fun Facts</h2>
          <FunFacts facts={funFacts} />
        </m.section>
      )}

      {/* Accuracy Analytics */}
      <m.section variants={fadeIn}>
        <h2 className="mb-4 text-xl font-semibold">Accuracy</h2>
        <AccuracyStats
          accuracy={userStats.accuracy}
          totalShotsFired={userStats.totalShotsFired}
          totalShotsHit={userStats.totalShotsHit}
          headshotPercentage={userStats.headshotPercentage}
          weaponAccuracy={userStats.weaponAccuracy}
        />
      </m.section>

      <Separator />

      {/* Weapons & Maps side by side */}
      <m.section variants={fadeIn}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Weapons</CardTitle>
            </CardHeader>
            <CardContent>
              <WeaponChart weapons={userStats.weapons} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Map Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <MapStats maps={userStats.maps} />
            </CardContent>
          </Card>
        </div>
      </m.section>

      {/* Weapon Radar Chart */}
      {friendData.length > 0 && (
        <m.section variants={fadeIn}>
          <h2 className="mb-4 text-xl font-semibold">
            Weapon Profile
          </h2>
          <WeaponRadar
            userWeapons={userStats.weapons}
            userName={userProfile.personaname}
            friends={friendData}
          />
        </m.section>
      )}

      {/* Weapon Mastery */}
      <m.section variants={fadeIn}>
        <h2 className="mb-4 text-xl font-semibold">Weapon Mastery</h2>
        <WeaponMastery weapons={userStats.weapons} />
      </m.section>

      {/* Milestones */}
      <m.section variants={fadeIn}>
        <h2 className="mb-4 text-xl font-semibold">Milestones</h2>
        <Milestones stats={userStats} />
      </m.section>

      <Separator />

      {/* Achievements */}
      {achievementsWithRarity.length > 0 && (
        <m.section variants={fadeIn}>
          <h2 className="mb-4 text-xl font-semibold">Achievements</h2>
          <Achievements achievements={achievementsWithRarity} />
        </m.section>
      )}

      {/* Leaderboard (if friends have stats) */}
      {friendData.length > 0 && (
        <>
          <Separator />
          <m.section variants={fadeIn}>
            <h2 className="mb-4 text-xl font-semibold">
              Friend Leaderboard
            </h2>
            <Card>
              <CardContent className="p-5">
                <Leaderboard
                  players={allPlayers}
                  currentSteamId={userProfile.steamid}
                />
              </CardContent>
            </Card>
          </m.section>
        </>
      )}

      {/* Squad Builder */}
      {friendData.length >= 2 && (
        <m.section variants={fadeIn}>
          <h2 className="mb-4 text-xl font-semibold">
            Dream Team — Who Should You Queue With?
          </h2>
          <SquadBuilder
            userProfile={userProfile}
            userStats={userStats}
            friendData={friendData}
          />
        </m.section>
      )}

      {/* Head-to-head comparisons */}
      {friendData.length > 0 && (
        <m.section variants={fadeIn}>
          <h2 className="mb-4 text-xl font-semibold">Head to Head</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {friendData.slice(0, 4).map((friend) => (
              <ComparisonCard
                key={friend.profile.steamid}
                playerA={{ profile: userProfile, stats: userStats }}
                playerB={friend}
              />
            ))}
          </div>
        </m.section>
      )}

      {friendData.length === 0 && (
        <m.div
          variants={fadeIn}
          className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-12"
        >
          <Trophy className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-sm">
            Select friends from the dashboard to compare stats
          </p>
        </m.div>
      )}
    </m.div>
  )
}
