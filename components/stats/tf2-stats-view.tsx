"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { calculateAchievementRarity } from "@/lib/achievements"
import { staggerContainer, fadeIn } from "@/lib/motion"
import type { TF2PlayerStats, SteamPlayer } from "@/lib/steam-types"
import {
  formatKD,
  formatNumber,
  formatPlaytime,
  generateFunFacts,
} from "@/lib/tf2"
import { cn } from "@/lib/utils"
import {
  Clock,
  Crown,
  Crosshair,
  Flag,
  Hammer,
  Heart,
  Shield,
  Skull,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react"
import { motion as m } from "motion/react"
import { useState } from "react"
import { Achievements } from "./achievements"
import { FunFacts } from "./fun-facts"
import { StatCard } from "./stat-card"

interface TF2StatsViewProps {
  userProfile: SteamPlayer
  userStats: TF2PlayerStats
  friendData: { profile: SteamPlayer; stats: TF2PlayerStats }[]
}

const TF2_LEADERBOARD_STATS = [
  { key: "totalKills", label: "Kills", format: formatNumber },
  { key: "kdRatio", label: "K/D", format: formatKD },
  { key: "totalPointsScored", label: "Points", format: formatNumber },
  { key: "totalDominations", label: "Doms", format: formatNumber },
  { key: "totalPlaytime", label: "Time", format: formatPlaytime },
] as const

type LeaderboardStatKey = (typeof TF2_LEADERBOARD_STATS)[number]["key"]

export function TF2StatsView({
  userProfile,
  userStats,
  friendData,
}: TF2StatsViewProps) {
  const funFacts = generateFunFacts(
    userStats,
    friendData.map((f) => f.stats),
    userProfile.personaname
  )

  const allPlayers = [{ profile: userProfile, stats: userStats }, ...friendData]

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
      {/* Overview Stats */}
      <m.section variants={fadeIn}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your TF2 Stats</h2>
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
            label="Points Scored"
            value={userStats.totalPointsScored}
            icon={Target}
          />
          <StatCard
            label="Dominations"
            value={userStats.totalDominations}
            icon={Zap}
            highlight
          />
          <StatCard
            label="Revenges"
            value={userStats.totalRevenges}
            icon={Flag}
          />
          <StatCard
            label="Headshots"
            value={userStats.totalHeadshots}
            icon={Target}
          />
          <StatCard
            label="Backstabs"
            value={userStats.totalBackstabs}
            icon={Swords}
          />
          <StatCard
            label="Healing Done"
            value={userStats.totalHealingDone}
            icon={Heart}
          />
          <StatCard
            label="Buildings Built"
            value={userStats.totalBuildingsBuilt}
            icon={Hammer}
          />
          <StatCard
            label="Sentry Kills"
            value={userStats.totalSentryKills}
            icon={Shield}
          />
          <StatCard
            label="Playtime"
            value={userStats.totalPlaytime}
            format={formatPlaytime}
            icon={Clock}
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

      <Separator />

      {/* Class Stats */}
      {userStats.classes.length > 0 && (
        <m.section variants={fadeIn}>
          <h2 className="mb-4 text-xl font-semibold">Class Breakdown</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {userStats.classes.map((cls, idx) => (
              <Card key={cls.className}>
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{cls.className}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatPlaytime(cls.playtime)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kills</span>
                      <span className="font-semibold tabular-nums">
                        {formatNumber(cls.kills)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deaths</span>
                      <span className="font-semibold tabular-nums">
                        {formatNumber(cls.deaths)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assists</span>
                      <span className="font-semibold tabular-nums">
                        {formatNumber(cls.assists)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Points</span>
                      <span className="font-semibold tabular-nums">
                        {formatNumber(cls.points)}
                      </span>
                    </div>
                  </div>
                  {/* Playtime bar */}
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <m.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${userStats.classes[0].playtime > 0 ? (cls.playtime / userStats.classes[0].playtime) * 100 : 0}%`,
                      }}
                      transition={{ duration: 0.6, delay: idx * 0.05 }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </m.section>
      )}

      {/* Achievements */}
      {achievementsWithRarity.length > 0 && (
        <m.section variants={fadeIn}>
          <h2 className="mb-4 text-xl font-semibold">Achievements</h2>
          <Achievements achievements={achievementsWithRarity} />
        </m.section>
      )}

      {/* Leaderboard */}
      {friendData.length > 0 && (
        <>
          <Separator />
          <m.section variants={fadeIn}>
            <h2 className="mb-4 text-xl font-semibold">Friend Leaderboard</h2>
            <Card>
              <CardContent className="p-5">
                <TF2Leaderboard
                  players={allPlayers}
                  currentSteamId={userProfile.steamid}
                />
              </CardContent>
            </Card>
          </m.section>
        </>
      )}

      {/* Head-to-head comparisons */}
      {friendData.length > 0 && (
        <m.section variants={fadeIn}>
          <h2 className="mb-4 text-xl font-semibold">Head to Head</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {friendData.slice(0, 4).map((friend) => (
              <TF2ComparisonCard
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
          <Trophy className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Select friends from the dashboard to compare stats
          </p>
        </m.div>
      )}
    </m.div>
  )
}

// ---------- TF2 Leaderboard ----------

function TF2Leaderboard({
  players,
  currentSteamId,
}: {
  players: { profile: SteamPlayer; stats: TF2PlayerStats }[]
  currentSteamId: string
}) {
  const [activeStat, setActiveStat] = useState<LeaderboardStatKey>("totalKills")

  const option = TF2_LEADERBOARD_STATS.find((o) => o.key === activeStat)!
  const sorted = [...players].sort(
    (a, b) => (b.stats[activeStat] as number) - (a.stats[activeStat] as number)
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {TF2_LEADERBOARD_STATS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setActiveStat(opt.key)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              activeStat === opt.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {sorted.map((entry, idx) => {
          const isUser = entry.profile.steamid === currentSteamId
          return (
            <div
              key={entry.profile.steamid}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2",
                isUser && "border border-primary/20 bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  idx === 0
                    ? "bg-amber-500/20 text-amber-500"
                    : idx === 1
                      ? "bg-zinc-300/20 text-zinc-400"
                      : idx === 2
                        ? "bg-orange-500/20 text-orange-500"
                        : "text-muted-foreground"
                )}
              >
                {idx === 0 ? <Trophy className="size-3.5" /> : idx + 1}
              </span>
              <Avatar className="size-7">
                <AvatarImage
                  src={entry.profile.avatarmedium}
                  alt={entry.profile.personaname}
                />
                <AvatarFallback>
                  {entry.profile.personaname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "flex-1 truncate text-sm",
                  isUser && "font-semibold"
                )}
              >
                {entry.profile.personaname}
                {isUser && (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (you)
                  </span>
                )}
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {option.format(entry.stats[activeStat] as number)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------- TF2 Comparison Card ----------

const TF2_COMPARE_STATS = [
  { key: "totalKills", label: "Kills", format: formatNumber },
  { key: "kdRatio", label: "K/D", format: formatKD },
  { key: "totalPointsScored", label: "Points", format: formatNumber },
  { key: "totalDominations", label: "Doms", format: formatNumber },
  { key: "totalDamage", label: "Damage", format: formatNumber },
] as const

function TF2ComparisonCard({
  playerA,
  playerB,
}: {
  playerA: { profile: SteamPlayer; stats: TF2PlayerStats }
  playerB: { profile: SteamPlayer; stats: TF2PlayerStats }
}) {
  let winsA = 0
  let winsB = 0
  for (const stat of TF2_COMPARE_STATS) {
    const a = playerA.stats[stat.key] as number
    const b = playerB.stats[stat.key] as number
    if (a > b) winsA++
    else if (b > a) winsB++
  }
  const winner = winsA > winsB ? "A" : winsB > winsA ? "B" : null

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              className={cn(
                "size-8",
                winner === "A" && "ring-2 ring-amber-500"
              )}
            >
              <AvatarImage
                src={playerA.profile.avatarmedium}
                alt={playerA.profile.personaname}
              />
              <AvatarFallback>
                {playerA.profile.personaname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[100px] truncate text-sm font-medium">
              {playerA.profile.personaname}
            </span>
          </div>
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            vs
          </span>
          <div className="flex items-center gap-2">
            <Avatar
              className={cn(
                "size-8",
                winner === "B" && "ring-2 ring-amber-500"
              )}
            >
              <AvatarImage
                src={playerB.profile.avatarmedium}
                alt={playerB.profile.personaname}
              />
              <AvatarFallback>
                {playerB.profile.personaname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[100px] truncate text-sm font-medium">
              {playerB.profile.personaname}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {TF2_COMPARE_STATS.map((stat) => {
            const valA = playerA.stats[stat.key] as number
            const valB = playerB.stats[stat.key] as number
            const total = valA + valB || 1
            const pctA = (valA / total) * 100

            return (
              <div key={stat.key} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      valA > valB ? "text-emerald-500" : "text-muted-foreground"
                    )}
                  >
                    {stat.format(valA)}
                  </span>
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      valB > valA ? "text-emerald-500" : "text-muted-foreground"
                    )}
                  >
                    {stat.format(valB)}
                  </span>
                </div>
                <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
                  <m.div
                    className={cn(
                      "rounded-l-full",
                      valA >= valB ? "bg-primary" : "bg-muted"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${pctA}%` }}
                    transition={{ duration: 0.6 }}
                  />
                  <m.div
                    className={cn(
                      "rounded-r-full",
                      valB > valA ? "bg-primary" : "bg-muted"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - pctA}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {winner && (
            <>
              <Crown className="size-3.5 text-amber-500" />
              <span className="text-muted-foreground">
                {winner === "A"
                  ? playerA.profile.personaname
                  : playerB.profile.personaname}{" "}
                wins {Math.max(winsA, winsB)}-{Math.min(winsA, winsB)}
              </span>
            </>
          )}
          {!winner && <span className="text-muted-foreground">Tied!</span>}
        </div>
      </CardContent>
    </Card>
  )
}
