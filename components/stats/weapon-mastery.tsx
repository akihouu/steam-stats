"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { staggerContainer, fadeIn } from "@/lib/motion"
import {
  type WeaponMasteryData,
  TIER_CONFIG,
  getWeaponMasteryData,
} from "@/lib/weapon-mastery"
import type { WeaponStat } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { motion as m } from "motion/react"

interface WeaponMasteryProps {
  weapons: WeaponStat[]
}

function ProgressRing({
  percentage,
  tier,
}: {
  percentage: number
  tier: WeaponMasteryData["tier"]
}) {
  const radius = 22
  const stroke = 3
  const circumference = 2 * Math.PI * radius
  const progress = (percentage / 100) * circumference
  const config = TIER_CONFIG[tier]

  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90">
      <circle
        cx="26"
        cy="26"
        r={radius}
        fill="none"
        strokeWidth={stroke}
        className="stroke-muted"
      />
      <m.circle
        cx="26"
        cy="26"
        r={radius}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        className={cn(
          "stroke-current",
          tier === "none" ? "text-muted-foreground" : config.color
        )}
        initial={{ strokeDasharray: `0 ${circumference}` }}
        animate={{
          strokeDasharray: `${progress} ${circumference}`,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  )
}

function MasteryCard({ data }: { data: WeaponMasteryData }) {
  const config = TIER_CONFIG[data.tier]
  const isMaxTier = data.tier === "diamond"

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-lg border p-3 transition-shadow",
        config.border,
        data.tier !== "none" && config.glow
      )}
    >
      <div className="relative flex items-center justify-center">
        <ProgressRing percentage={data.progress.percentage} tier={data.tier} />
        <span
          className={cn(
            "absolute text-xs font-bold tabular-nums",
            config.color
          )}
        >
          {isMaxTier ? "✦" : `${Math.round(data.progress.percentage)}%`}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{data.weapon}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {data.kills.toLocaleString()} kills
        </p>
        <p className={cn("text-xs font-medium", config.color)}>
          {config.label}
          {!isMaxTier && data.tier !== "none" && (
            <span className="font-normal text-muted-foreground">
              {" "}
              · {(data.progress.target - data.kills).toLocaleString()} to next
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

export function WeaponMastery({ weapons }: WeaponMasteryProps) {
  const masteryData = getWeaponMasteryData(weapons)
  const unlocked = masteryData.filter((d) => d.tier !== "none")
  const locked = masteryData.filter((d) => d.tier === "none")

  const diamondCount = masteryData.filter((d) => d.tier === "diamond").length
  const goldCount = masteryData.filter((d) => d.tier === "gold").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>Weapon Mastery</span>
          <span className="text-xs font-normal text-muted-foreground">
            {unlocked.length}/{masteryData.length} unlocked
            {diamondCount > 0 && ` · ${diamondCount} ✦`}
            {goldCount > 0 && ` · ${goldCount} gold`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <m.div
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {unlocked.map((data) => (
            <m.div key={data.weapon} variants={fadeIn}>
              <MasteryCard data={data} />
            </m.div>
          ))}
          {locked.map((data) => (
            <m.div key={data.weapon} variants={fadeIn}>
              <MasteryCard data={data} />
            </m.div>
          ))}
        </m.div>
      </CardContent>
    </Card>
  )
}
