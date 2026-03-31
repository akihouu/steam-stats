"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { formatKD, formatNumber, formatPercent } from "@/lib/cs2"
import type { CS2PlayerStats, SteamPlayer } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { motion as m } from "motion/react"

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

export function ComparisonCard({
  playerA,
  playerB,
}: ComparisonCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <PlayerBadge player={playerA.profile} />
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            vs
          </span>
          <PlayerBadge player={playerB.profile} />
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
                      valA > valB
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {stat.format(valA)}
                  </span>
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      valB > valA
                        ? "text-emerald-500"
                        : "text-muted-foreground"
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
      </CardContent>
    </Card>
  )
}

function PlayerBadge({ player }: { player: SteamPlayer }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-8">
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
