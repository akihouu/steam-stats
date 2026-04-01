"use client"

import { staggerContainer, fadeIn } from "@/lib/motion"
import type { MapStat } from "@/lib/steam-types"
import { motion as m } from "motion/react"

interface MapStatsProps {
  maps: MapStat[]
}

export function MapStats({ maps }: MapStatsProps) {
  const maxWins = maps[0]?.wins ?? 1

  return (
    <m.div
      className="flex flex-col gap-2"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {maps.map((mp) => {
        const pct = (mp.wins / maxWins) * 100
        return (
          <m.div key={mp.map} variants={fadeIn} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{mp.map}</span>
              <span className="text-muted-foreground tabular-nums">
                {mp.wins.toLocaleString()} wins
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <m.div
                className="h-full rounded-full bg-chart-2"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </m.div>
        )
      })}
    </m.div>
  )
}
