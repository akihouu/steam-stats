"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PERSONA_STATES, type SteamPlayer } from "@/lib/steam-types"
import { fadeIn } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { motion as m } from "motion/react"

interface ProfileCardProps {
  player: SteamPlayer
  cs2Playtime?: number
}

export function ProfileCard({ player, cs2Playtime }: ProfileCardProps) {
  const state = PERSONA_STATES[player.personastate] ?? "offline"
  const isOnline = state !== "offline"

  return (
    <m.div variants={fadeIn} initial="initial" animate="animate">
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="relative">
            <Avatar className="size-16">
              <AvatarImage
                src={player.avatarfull}
                alt={player.personaname}
              />
              <AvatarFallback className="text-lg">
                {player.personaname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute bottom-0 right-0 size-4 rounded-full border-2 border-white dark:border-zinc-900",
                isOnline ? "bg-emerald-500" : "bg-zinc-400"
              )}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">{player.personaname}</h2>
            <div className="flex items-center gap-2">
              <Badge variant={isOnline ? "default" : "secondary"}>
                {state.replace("-", " ")}
              </Badge>
              {player.gameextrainfo && (
                <span className="text-muted-foreground text-sm">
                  Playing {player.gameextrainfo}
                </span>
              )}
            </div>
            {cs2Playtime !== undefined && (
              <p className="text-muted-foreground text-sm">
                {Math.round(cs2Playtime / 60)} hours in CS2
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </m.div>
  )
}
