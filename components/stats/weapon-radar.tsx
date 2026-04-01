"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CS2PlayerStats, SteamPlayer, WeaponStat } from "@/lib/steam-types"
import { motion as m } from "motion/react"
import { useState } from "react"

interface WeaponRadarProps {
  userWeapons: WeaponStat[]
  userName: string
  friends: { profile: SteamPlayer; stats: CS2PlayerStats }[]
}

const CATEGORIES = [
  {
    name: "Rifles",
    weapons: ["AK-47", "M4A1-S / M4A4", "FAMAS", "Galil AR", "AUG", "SG 553"],
  },
  {
    name: "SMGs",
    weapons: ["P90", "MAC-10", "MP7", "MP9", "UMP-45", "PP-Bizon", "MP5-SD"],
  },
  {
    name: "Pistols",
    weapons: [
      "Glock-18",
      "P2000 / USP-S",
      "Desert Eagle",
      "Five-SeveN",
      "Dual Berettas",
      "P250",
      "Tec-9",
    ],
  },
  {
    name: "Heavy",
    weapons: ["Nova", "XM1014", "Sawed-Off", "MAG-7", "Negev", "M249"],
  },
  {
    name: "Snipers",
    weapons: ["AWP", "SSG 08", "SCAR-20", "G3SG1"],
  },
  {
    name: "Other",
    weapons: ["Knife", "HE Grenade", "Molotov", "Zeus x27"],
  },
]

function getCategoryKills(
  weapons: WeaponStat[],
  categoryWeapons: string[]
): number {
  return weapons
    .filter((w) => categoryWeapons.includes(w.weapon))
    .reduce((sum, w) => sum + w.kills, 0)
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angle: number
): { x: number; y: number } {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function makePolygonPoints(
  values: number[],
  cx: number,
  cy: number,
  maxR: number
): string {
  const step = 360 / values.length
  return values
    .map((v, i) => {
      const { x, y } = polarToCartesian(cx, cy, v * maxR, i * step)
      return `${x},${y}`
    })
    .join(" ")
}

export function WeaponRadar({
  userWeapons,
  userName,
  friends,
}: WeaponRadarProps) {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(
    friends[0]?.profile.steamid ?? null
  )

  const cx = 150
  const cy = 150
  const maxR = 110
  const levels = [0.25, 0.5, 0.75, 1]
  const angleStep = 360 / CATEGORIES.length

  // Calculate kills per category for all players
  const userCatKills = CATEGORIES.map((c) =>
    getCategoryKills(userWeapons, c.weapons)
  )

  const friendWeapons =
    friends.find((f) => f.profile.steamid === selectedFriend)?.stats.weapons ??
    []
  const friendCatKills = CATEGORIES.map((c) =>
    getCategoryKills(friendWeapons, c.weapons)
  )

  // Normalize against max across both players
  const allValues = [...userCatKills, ...friendCatKills]
  const maxVal = Math.max(...allValues, 1)
  const userNorm = userCatKills.map((v) => v / maxVal)
  const friendNorm = friendCatKills.map((v) => v / maxVal)

  const userPoints = makePolygonPoints(userNorm, cx, cy, maxR)
  const friendPoints = makePolygonPoints(friendNorm, cx, cy, maxR)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>Weapon Radar</span>
          {friends.length > 0 && (
            <select
              value={selectedFriend ?? ""}
              onChange={(e) => setSelectedFriend(e.target.value)}
              className="rounded-md bg-muted px-2 py-1 text-xs"
            >
              {friends.map((f) => (
                <option key={f.profile.steamid} value={f.profile.steamid}>
                  vs {f.profile.personaname}
                </option>
              ))}
            </select>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
          {/* Grid lines */}
          {levels.map((level) => {
            const points = CATEGORIES.map((_, i) => {
              const { x, y } = polarToCartesian(
                cx,
                cy,
                level * maxR,
                i * angleStep
              )
              return `${x},${y}`
            }).join(" ")
            return (
              <polygon
                key={level}
                points={points}
                fill="none"
                className="stroke-muted"
                strokeWidth="0.5"
              />
            )
          })}

          {/* Axis lines */}
          {CATEGORIES.map((_, i) => {
            const { x, y } = polarToCartesian(cx, cy, maxR, i * angleStep)
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                className="stroke-muted"
                strokeWidth="0.5"
              />
            )
          })}

          {/* Friend polygon */}
          {selectedFriend && (
            <m.polygon
              points={friendPoints}
              fill="hsl(var(--muted-foreground) / 0.15)"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* User polygon */}
          <m.polygon
            points={userPoints}
            fill="hsl(var(--primary) / 0.2)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Labels */}
          {CATEGORIES.map((cat, i) => {
            const { x, y } = polarToCartesian(cx, cy, maxR + 18, i * angleStep)
            return (
              <text
                key={cat.name}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-muted-foreground text-[10px]"
              >
                {cat.name}
              </text>
            )
          })}

          {/* Data points - user */}
          {userNorm.map((v, i) => {
            const { x, y } = polarToCartesian(cx, cy, v * maxR, i * angleStep)
            return (
              <circle
                key={`user-${i}`}
                cx={x}
                cy={y}
                r="3"
                className="fill-primary"
              />
            )
          })}
        </svg>
      </CardContent>
      <div className="flex justify-center gap-4 pb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-primary" />
          <span>{userName}</span>
        </div>
        {selectedFriend && (
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-muted-foreground" />
            <span>
              {
                friends.find((f) => f.profile.steamid === selectedFriend)
                  ?.profile.personaname
              }
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
