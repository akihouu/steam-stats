"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeaponAccuracy } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { motion as m } from "motion/react"

interface AccuracyStatsProps {
  accuracy: number
  totalShotsFired: number
  totalShotsHit: number
  headshotPercentage: number
  weaponAccuracy: WeaponAccuracy[]
}

function AccuracyGauge({ value }: { value: number }) {
  const radius = 54
  const stroke = 8
  const circumference = 2 * Math.PI * radius
  const progress = (value / 100) * circumference
  const color =
    value >= 50
      ? "text-emerald-500"
      : value >= 30
        ? "text-amber-500"
        : "text-red-500"

  return (
    <div className="relative flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <m.circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cn("stroke-current", color)}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${progress} ${circumference}` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-2xl font-bold tabular-nums", color)}>
          {value.toFixed(1)}%
        </span>
        <span className="text-muted-foreground text-xs">Accuracy</span>
      </div>
    </div>
  )
}

function HeadshotDonut({ value }: { value: number }) {
  const radius = 36
  const stroke = 6
  const circumference = 2 * Math.PI * radius
  const progress = (value / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <m.circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-current text-primary"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${progress} ${circumference}` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold tabular-nums">
          {value.toFixed(1)}%
        </span>
        <span className="text-muted-foreground text-[10px]">HS Rate</span>
      </div>
    </div>
  )
}

export function AccuracyStats({
  accuracy,
  totalShotsFired,
  totalShotsHit,
  headshotPercentage,
  weaponAccuracy,
}: AccuracyStatsProps) {
  const topWeapons = weaponAccuracy.slice(0, 5)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overall Accuracy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <AccuracyGauge value={accuracy} />
          <div className="flex gap-6 text-center text-sm">
            <div>
              <p className="font-semibold tabular-nums">
                {totalShotsFired.toLocaleString()}
              </p>
              <p className="text-muted-foreground text-xs">Shots Fired</p>
            </div>
            <div>
              <p className="font-semibold tabular-nums">
                {totalShotsHit.toLocaleString()}
              </p>
              <p className="text-muted-foreground text-xs">Shots Hit</p>
            </div>
            <div>
              <HeadshotDonut value={headshotPercentage} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weapon Accuracy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {topWeapons.map((w) => {
            const color =
              w.accuracy >= 50
                ? "bg-emerald-500"
                : w.accuracy >= 30
                  ? "bg-amber-500"
                  : "bg-red-500"
            return (
              <div key={w.weapon} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{w.weapon}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {w.accuracy.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <m.div
                    className={cn("h-full rounded-full", color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(w.accuracy, 100)}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            )
          })}
          {topWeapons.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No weapon accuracy data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
