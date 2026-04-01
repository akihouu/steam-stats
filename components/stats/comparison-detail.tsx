"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  formatKD,
  formatNumber,
  formatPercent,
  formatPlaytime,
} from "@/lib/cs2"
import type { CS2PlayerStats, SteamPlayer } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { Crown, X } from "lucide-react"
import { motion as m } from "motion/react"

interface ComparisonDetailProps {
  playerA: { profile: SteamPlayer; stats: CS2PlayerStats }
  playerB: { profile: SteamPlayer; stats: CS2PlayerStats }
  onClose: () => void
}

const ALL_STATS = [
  { key: "totalKills", label: "Kills", format: formatNumber },
  { key: "totalDeaths", label: "Deaths", format: formatNumber },
  { key: "kdRatio", label: "K/D Ratio", format: formatKD },
  { key: "headshotPercentage", label: "HS%", format: formatPercent },
  { key: "totalWins", label: "Wins", format: formatNumber },
  { key: "totalMvps", label: "MVPs", format: formatNumber },
  { key: "totalDamage", label: "Damage", format: formatNumber },
  { key: "totalPlantedBombs", label: "Bomb Plants", format: formatNumber },
  { key: "totalDefusedBombs", label: "Bomb Defuses", format: formatNumber },
  {
    key: "totalTimePlayed",
    label: "Playtime",
    format: formatPlaytime,
  },
] as const

export function ComparisonDetail({
  playerA,
  playerB,
  onClose,
}: ComparisonDetailProps) {
  let winsA = 0
  let winsB = 0

  for (const stat of ALL_STATS) {
    // Deaths: lower is better
    const aVal = playerA.stats[stat.key] as number
    const bVal = playerB.stats[stat.key] as number
    if (stat.key === "totalDeaths") {
      if (aVal < bVal) winsA++
      else if (bVal < aVal) winsB++
    } else {
      if (aVal > bVal) winsA++
      else if (bVal > aVal) winsB++
    }
  }

  const winner = winsA > winsB ? "A" : winsB > winsA ? "B" : "tie"
  const winnerProfile =
    winner === "A" ? playerA.profile : winner === "B" ? playerB.profile : null

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Detailed Comparison</span>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Winner */}
          <div className="flex items-center justify-center gap-2 rounded-lg border py-3">
            {winnerProfile ? (
              <>
                <Crown className="size-5 text-amber-500" />
                <span className="font-semibold">
                  {winnerProfile.personaname}
                </span>
                <span className="text-sm text-muted-foreground">
                  wins {Math.max(winsA, winsB)} to {Math.min(winsA, winsB)}
                </span>
              </>
            ) : (
              <span className="font-medium text-muted-foreground">
                It&apos;s a tie! {winsA}-{winsB}
              </span>
            )}
          </div>

          {/* Player headers */}
          <div className="flex items-center justify-between">
            <PlayerBadge player={playerA.profile} isWinner={winner === "A"} />
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              vs
            </span>
            <PlayerBadge player={playerB.profile} isWinner={winner === "B"} />
          </div>

          {/* All stats */}
          <div className="flex flex-col gap-2">
            {ALL_STATS.map((stat) => {
              const valA = playerA.stats[stat.key] as number
              const valB = playerB.stats[stat.key] as number
              const isDeaths = stat.key === "totalDeaths"
              const aWins = isDeaths ? valA < valB : valA > valB
              const bWins = isDeaths ? valB < valA : valB > valA
              const total = (isDeaths ? 1 : valA + valB) || 1
              const pctA = isDeaths ? 50 : (valA / total) * 100

              return (
                <div key={stat.key} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span
                      className={cn(
                        "font-semibold tabular-nums",
                        aWins ? "text-emerald-500" : "text-muted-foreground"
                      )}
                    >
                      {stat.format(valA)}
                    </span>
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span
                      className={cn(
                        "font-semibold tabular-nums",
                        bWins ? "text-emerald-500" : "text-muted-foreground"
                      )}
                    >
                      {stat.format(valB)}
                    </span>
                  </div>
                  {!isDeaths && (
                    <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                      <m.div
                        className={cn(
                          "rounded-l-full",
                          aWins ? "bg-primary" : "bg-muted"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${pctA}%` }}
                        transition={{ duration: 0.5 }}
                      />
                      <m.div
                        className={cn(
                          "rounded-r-full",
                          bWins ? "bg-primary" : "bg-muted"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - pctA}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </m.div>
  )
}

function PlayerBadge({
  player,
  isWinner,
}: {
  player: SteamPlayer
  isWinner: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className={cn("size-8", isWinner && "ring-2 ring-amber-500")}>
        <AvatarImage src={player.avatarmedium} alt={player.personaname} />
        <AvatarFallback>
          {player.personaname.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="max-w-[100px] truncate text-sm font-medium">
        {player.personaname}
      </span>
    </div>
  )
}
