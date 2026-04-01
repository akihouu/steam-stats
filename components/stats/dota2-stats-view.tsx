"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  formatKDA,
  formatNumber,
  formatPercent,
  formatPlaytime,
  generateFunFacts,
} from "@/lib/dota2"
import { staggerContainer, fadeIn } from "@/lib/motion"
import type { Dota2PlayerStats, SteamPlayer } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import {
  Clock,
  Crown,
  Heart,
  Shield,
  Skull,
  Swords,
  Target,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react"
import { motion as m } from "motion/react"
import { useState } from "react"
import { FunFacts } from "./fun-facts"
import { StatCard } from "./stat-card"

interface Dota2StatsViewProps {
  userProfile: SteamPlayer
  userStats: Dota2PlayerStats
  friendData: { profile: SteamPlayer; stats: Dota2PlayerStats }[]
}

const DOTA2_LEADERBOARD_STATS = [
  { key: "totalKills", label: "Kills", format: formatNumber },
  { key: "kdaRatio", label: "KDA", format: formatKDA },
  { key: "totalWins", label: "Wins", format: formatNumber },
  { key: "winRate", label: "Win%", format: formatPercent },
  { key: "totalTimePlayed", label: "Time", format: formatPlaytime },
] as const

type LeaderboardStatKey = (typeof DOTA2_LEADERBOARD_STATS)[number]["key"]

export function Dota2StatsView({
  userProfile,
  userStats,
  friendData,
}: Dota2StatsViewProps) {
  const funFacts = generateFunFacts(
    userStats,
    friendData.map((f) => f.stats),
    userProfile.personaname
  )

  const allPlayers = [{ profile: userProfile, stats: userStats }, ...friendData]

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
          <h2 className="text-xl font-semibold">Your Dota 2 Stats</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard
            label="Total Kills"
            value={userStats.totalKills}
            icon={Swords}
            highlight
          />
          <StatCard
            label="Total Deaths"
            value={userStats.totalDeaths}
            icon={Skull}
          />
          <StatCard
            label="Total Assists"
            value={userStats.totalAssists}
            icon={Shield}
          />
          <StatCard
            label="KDA Ratio"
            value={userStats.kdaRatio}
            format={formatKDA}
            icon={Target}
            highlight
          />
          <StatCard
            label="Wins"
            value={userStats.totalWins}
            icon={Trophy}
            highlight
          />
          <StatCard label="Losses" value={userStats.totalLosses} icon={Skull} />
          <StatCard
            label="Win Rate"
            value={userStats.winRate}
            format={formatPercent}
            icon={TrendingUp}
          />
          <StatCard
            label="Playtime"
            value={userStats.totalTimePlayed}
            format={formatPlaytime}
            icon={Clock}
          />
          <StatCard
            label="Avg GPM"
            value={userStats.totalGoldPerMin}
            format={(n) => Math.round(n).toLocaleString()}
            icon={Zap}
          />
          <StatCard
            label="Avg XPM"
            value={userStats.totalXpPerMin}
            format={(n) => Math.round(n).toLocaleString()}
            icon={TrendingUp}
          />
          <StatCard
            label="Hero Damage"
            value={userStats.totalHeroDamage}
            icon={Swords}
          />
          <StatCard
            label="Hero Healing"
            value={userStats.totalHeroHealing}
            icon={Heart}
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

      {/* Top Heroes */}
      {userStats.heroes.length > 0 && (
        <m.section variants={fadeIn}>
          <h2 className="mb-4 text-xl font-semibold">Top Heroes</h2>
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col gap-2">
                {userStats.heroes.slice(0, 10).map((hero, idx) => {
                  const maxGames = userStats.heroes[0].games
                  const pct = maxGames > 0 ? (hero.games / maxGames) * 100 : 0
                  return (
                    <div key={hero.heroId} className="flex items-center gap-3">
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
                        {idx + 1}
                      </span>
                      <span className="w-32 truncate text-sm font-medium">
                        {hero.heroName}
                      </span>
                      <div className="flex-1 overflow-hidden rounded-full bg-muted">
                        <m.div
                          className="h-2 rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.05 }}
                        />
                      </div>
                      <span className="w-20 text-right text-xs text-muted-foreground tabular-nums">
                        {hero.games} games
                      </span>
                      <span
                        className={cn(
                          "w-14 text-right text-xs font-semibold tabular-nums",
                          hero.winRate >= 55
                            ? "text-emerald-500"
                            : hero.winRate >= 45
                              ? "text-muted-foreground"
                              : "text-red-500"
                        )}
                      >
                        {formatPercent(hero.winRate)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
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
                <Dota2Leaderboard
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
              <Dota2ComparisonCard
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

// ---------- Dota 2 Leaderboard ----------

function Dota2Leaderboard({
  players,
  currentSteamId,
}: {
  players: { profile: SteamPlayer; stats: Dota2PlayerStats }[]
  currentSteamId: string
}) {
  const [activeStat, setActiveStat] = useState<LeaderboardStatKey>("totalKills")

  const option = DOTA2_LEADERBOARD_STATS.find((o) => o.key === activeStat)!
  const sorted = [...players].sort(
    (a, b) => (b.stats[activeStat] as number) - (a.stats[activeStat] as number)
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {DOTA2_LEADERBOARD_STATS.map((opt) => (
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

// ---------- Dota 2 Comparison Card ----------

const DOTA2_COMPARE_STATS = [
  { key: "totalKills", label: "Kills", format: formatNumber },
  { key: "kdaRatio", label: "KDA", format: formatKDA },
  { key: "winRate", label: "Win%", format: formatPercent },
  { key: "totalWins", label: "Wins", format: formatNumber },
  { key: "totalHeroDamage", label: "Hero DMG", format: formatNumber },
] as const

function Dota2ComparisonCard({
  playerA,
  playerB,
}: {
  playerA: { profile: SteamPlayer; stats: Dota2PlayerStats }
  playerB: { profile: SteamPlayer; stats: Dota2PlayerStats }
}) {
  let winsA = 0
  let winsB = 0
  for (const stat of DOTA2_COMPARE_STATS) {
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
          {DOTA2_COMPARE_STATS.map((stat) => {
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
