"use client"

import { staggerContainer, fadeIn } from "@/lib/motion"
import type { WeaponStat } from "@/lib/steam-types"
import { motion as m } from "motion/react"

interface WeaponChartProps {
  weapons: WeaponStat[]
  maxItems?: number
}

export function WeaponChart({ weapons, maxItems = 10 }: WeaponChartProps) {
  const top = weapons.slice(0, maxItems)
  const maxKills = top[0]?.kills ?? 1

  return (
    <m.div
      className="flex flex-col gap-2"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {top.map((w) => {
        const pct = (w.kills / maxKills) * 100
        return (
          <m.div
            key={w.weapon}
            variants={fadeIn}
            className="flex flex-col gap-1"
          >
            <div className="flex justify-between text-sm">
              <span className="font-medium">{w.weapon}</span>
              <span className="text-muted-foreground tabular-nums">
                {w.kills.toLocaleString()}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <m.div
                className="h-full rounded-full bg-primary"
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
