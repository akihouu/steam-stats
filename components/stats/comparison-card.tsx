"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { formatKD, formatNumber, formatPercent } from "@/lib/cs2"
import type { CS2PlayerStats, SteamPlayer } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { Crown, Expand } from "lucide-react"
import { motion as m } from "motion/react"
import { useState } from "react"
import { ComparisonDetail } from "./comparison-detail"

interface ComparisonCardProps {
  playerA: { profile: SteamPlayer; stats: CS2PlayerStats }
  playerB: { profile: SteamPlayer; stats: CS2PlayerStats }
}

const COMPARE_STATS = [
  { key: "totalKills", label: "Kills", format: formatNumber },
  { key: "kdRatio", label: "K/D Ratio", format: formatKD },
  { key: "headshotPercentage", label: "HS%", format: formatPercent },
  { key: "totalWins", label: "Wins", format: formatNumber },
  { key: "totalMvps", label: "MVPs", format: formatNumber },
] as const

export function ComparisonCard({ playerA, playerB }: ComparisonCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Calculate overall winner
  let winsA = 0
  let winsB = 0
  for (const stat of COMPARE_STATS) {
    const a = playerA.stats[stat.key] as number
    const b = playerB.stats[stat.key] as number
    if (a > b) winsA++
    else if (b > a) winsB++
  }
  const winner = winsA > winsB ? "A" : winsB > winsA ? "B" : null

  if (expanded) {
    return (
      <ComparisonDetail
        playerA={playerA}
        playerB={playerB}
        onClose={() => setExpanded(false)}
      />
    )
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <PlayerBadge player={playerA.profile} isWinner={winner === "A"} />
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            vs
          </span>
          <PlayerBadge player={playerB.profile} isWinner={winner === "B"} />
        </div>

        <div className="flex flex-col gap-3">
          {COMPARE_STATS.map((stat) => {
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

        {/* Winner summary + expand */}
        <div className="flex items-center justify-between">
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
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Expand className="size-3" />
            Details
          </button>
        </div>
      </CardContent>
    </Card>
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
