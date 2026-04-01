"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type MilestoneProgress, calculateMilestones } from "@/lib/milestones"
import type { CS2PlayerStats } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { staggerContainer, fadeIn } from "@/lib/motion"
import { Bomb, Check, Crosshair, Star, Target, Trophy } from "lucide-react"
import { motion as m } from "motion/react"
import type { LucideIcon } from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  crosshair: Crosshair,
  trophy: Trophy,
  target: Target,
  star: Star,
  bomb: Bomb,
}

interface MilestonesProps {
  stats: CS2PlayerStats
}

function MilestoneCard({ milestone }: { milestone: MilestoneProgress }) {
  const Icon = ICON_MAP[milestone.icon] ?? Crosshair

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        milestone.completed && "border-amber-500/30 bg-amber-500/5"
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          milestone.completed
            ? "bg-amber-500/20 text-amber-500"
            : "bg-muted text-muted-foreground"
        )}
      >
        {milestone.completed ? (
          <Check className="size-5" />
        ) : (
          <Icon className="size-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{milestone.category}</p>
          <p className="text-xs font-semibold tabular-nums">
            {milestone.current.toLocaleString()}/
            {milestone.target.toLocaleString()}
          </p>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <m.div
            className={cn(
              "h-full rounded-full",
              milestone.completed ? "bg-amber-500" : "bg-primary"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${milestone.percentage}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <div className="mt-1 flex justify-between">
          {milestone.completed ? (
            <p className="text-xs font-medium text-amber-500">Completed!</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {milestone.remaining.toLocaleString()} remaining
            </p>
          )}
          {milestone.projectedDate && !milestone.completed && (
            <p className="text-xs text-muted-foreground">
              ~{milestone.projectedDate}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function Milestones({ stats }: MilestonesProps) {
  const milestones = calculateMilestones(
    {
      totalKills: stats.totalKills,
      totalWins: stats.totalWins,
      totalMvps: stats.totalMvps,
      totalPlantedBombs: stats.totalPlantedBombs,
    },
    stats.totalTimePlayed,
    stats.headshotPercentage,
    stats.totalKills
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <m.div
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {milestones.map((milestone) => (
            <m.div key={milestone.category} variants={fadeIn}>
              <MilestoneCard milestone={milestone} />
            </m.div>
          ))}
        </m.div>
      </CardContent>
    </Card>
  )
}
