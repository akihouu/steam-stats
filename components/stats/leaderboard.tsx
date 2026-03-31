"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  formatKD,
  formatNumber,
  formatPercent,
  formatPlaytime,
} from "@/lib/cs2"
import type { CS2PlayerStats, SteamPlayer } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"
import { useState } from "react"

interface LeaderboardProps {
  players: { profile: SteamPlayer; stats: CS2PlayerStats }[]
  currentSteamId: string
}

const STAT_OPTIONS = [
  { key: "totalKills", label: "Kills", format: formatNumber },
  { key: "kdRatio", label: "K/D", format: formatKD },
  { key: "headshotPercentage", label: "HS%", format: formatPercent },
  { key: "totalWins", label: "Wins", format: formatNumber },
  { key: "totalMvps", label: "MVPs", format: formatNumber },
  { key: "totalTimePlayed", label: "Time", format: formatPlaytime },
] as const

type StatKey = (typeof STAT_OPTIONS)[number]["key"]

export function Leaderboard({ players, currentSteamId }: LeaderboardProps) {
  const [activeStat, setActiveStat] = useState<StatKey>("totalKills")

  const option = STAT_OPTIONS.find((o) => o.key === activeStat)!
  const sorted = [...players].sort(
    (a, b) =>
      (b.stats[activeStat] as number) - (a.stats[activeStat] as number)
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {STAT_OPTIONS.map((opt) => (
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
                isUser && "bg-primary/5 border-primary/20 border"
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
                {idx === 0 ? (
                  <Trophy className="size-3.5" />
                ) : (
                  idx + 1
                )}
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
                  <span className="text-muted-foreground ml-1 text-xs font-normal">
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
