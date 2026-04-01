"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type AchievementWithRarity, RARITY_CONFIG } from "@/lib/achievements"
import { cn } from "@/lib/utils"
import { staggerContainer, fadeIn } from "@/lib/motion"
import { Check, Lock } from "lucide-react"
import { motion as m } from "motion/react"
import { useState } from "react"

interface AchievementsProps {
  achievements: AchievementWithRarity[]
}

const RARITY_ORDER = ["ultra-rare", "rare", "uncommon", "common"] as const

export function Achievements({ achievements }: AchievementsProps) {
  const [showAll, setShowAll] = useState(false)

  const achieved = achievements.filter((a) => a.achieved)
  const unachieved = achievements.filter((a) => !a.achieved)

  const grouped = RARITY_ORDER.map((rarity) => ({
    rarity,
    config: RARITY_CONFIG[rarity],
    items: achieved.filter((a) => a.rarity === rarity),
  })).filter((g) => g.items.length > 0)

  const displayedUnachieved = showAll ? unachieved : unachieved.slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>
            Achievements{" "}
            <span className="font-normal text-muted-foreground">
              ({achieved.length}/{achievements.length})
            </span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {grouped.map((group) => (
          <div key={group.rarity}>
            <div className="mb-2 flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn("text-xs", group.config.bg, group.config.color)}
              >
                {group.config.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {group.items.length} unlocked
              </span>
            </div>
            <m.div
              className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {group.items.map((achievement) => (
                <m.div
                  key={achievement.name}
                  variants={fadeIn}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2",
                    group.config.bg
                  )}
                >
                  <Check
                    className={cn("size-4 shrink-0", group.config.color)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {achievement.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(achievement.friendPercentage)}% of group
                    </p>
                  </div>
                </m.div>
              ))}
            </m.div>
          </div>
        ))}

        {unachieved.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Locked ({unachieved.length})
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {displayedUnachieved.map((achievement) => (
                <div
                  key={achievement.name}
                  className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 opacity-50"
                >
                  <Lock className="size-4 shrink-0 text-muted-foreground" />
                  <p className="truncate text-sm text-muted-foreground">
                    {achievement.displayName}
                  </p>
                </div>
              ))}
            </div>
            {unachieved.length > 6 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {showAll
                  ? "Show less"
                  : `Show ${unachieved.length - 6} more...`}
              </button>
            )}
          </div>
        )}

        {achievements.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No achievement data available
          </p>
        )}
      </CardContent>
    </Card>
  )
}
