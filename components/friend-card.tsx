"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PERSONA_STATES, type SteamPlayer } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { Check, Lock } from "lucide-react"

interface FriendCardProps {
  player: SteamPlayer
  selected: boolean
  onToggle: () => void
}

export function FriendCard({ player, selected, onToggle }: FriendCardProps) {
  const state = PERSONA_STATES[player.personastate] ?? "offline"
  const isOnline = state !== "offline"
  const isPrivate = player.communityvisibilitystate !== 3

  return (
    <button
      onClick={onToggle}
      className={cn(
        "bg-card flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "hover:bg-muted/50 border-transparent"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="size-10">
          <AvatarImage src={player.avatarmedium} alt={player.personaname} />
          <AvatarFallback>
            {player.personaname.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-zinc-900",
            isOnline ? "bg-emerald-500" : "bg-zinc-400"
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{player.personaname}</p>
        <p className="text-muted-foreground flex items-center gap-1 text-xs">
          {isPrivate ? (
            <>
              <Lock className="size-3" />
              Private
            </>
          ) : player.gameextrainfo ? (
            <span className="text-emerald-500">
              Playing {player.gameextrainfo}
            </span>
          ) : (
            state.replace("-", " ")
          )}
        </p>
      </div>
      {selected && (
        <div className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full">
          <Check className="size-3" />
        </div>
      )}
    </button>
  )
}
