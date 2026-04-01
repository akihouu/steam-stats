"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GAME_CONFIGS, GAME_IDS } from "@/lib/games"
import type { GameId } from "@/lib/steam-types"
import { Crosshair, Shield, Swords } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

const GAME_ICONS: Record<
  GameId,
  React.ComponentType<{ className?: string }>
> = {
  cs2: Crosshair,
  dota2: Swords,
  tf2: Shield,
}

interface GameTabsProps {
  activeGame: GameId
}

export function GameTabs({ activeGame }: GameTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleGameChange = useCallback(
    (game: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("game", game)
      // Clear friends when switching games since stats are game-specific
      params.delete("friends")
      router.push(`/stats?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <Tabs value={activeGame} onValueChange={handleGameChange}>
      <TabsList>
        {GAME_IDS.map((id) => {
          const config = GAME_CONFIGS[id]
          const Icon = GAME_ICONS[id]
          return (
            <TabsTrigger key={id} value={id} className="gap-1.5">
              <Icon className="size-3.5" />
              {config.shortName}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
