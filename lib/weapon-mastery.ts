import type { WeaponStat } from "./steam-types"

export type MasteryTier = "none" | "bronze" | "silver" | "gold" | "diamond"

export interface MasteryThreshold {
  tier: MasteryTier
  min: number
}

export const MASTERY_THRESHOLDS: MasteryThreshold[] = [
  { tier: "diamond", min: 5000 },
  { tier: "gold", min: 2000 },
  { tier: "silver", min: 500 },
  { tier: "bronze", min: 100 },
]

export const TIER_CONFIG: Record<
  MasteryTier,
  { label: string; color: string; border: string; glow: string }
> = {
  none: {
    label: "Locked",
    color: "text-muted-foreground",
    border: "border-muted",
    glow: "",
  },
  bronze: {
    label: "Bronze",
    color: "text-[#CD7F32]",
    border: "border-[#CD7F32]/50",
    glow: "shadow-[0_0_8px_rgba(205,127,50,0.3)]",
  },
  silver: {
    label: "Silver",
    color: "text-[#C0C0C0]",
    border: "border-[#C0C0C0]/50",
    glow: "shadow-[0_0_8px_rgba(192,192,192,0.3)]",
  },
  gold: {
    label: "Gold",
    color: "text-[#FFD700]",
    border: "border-[#FFD700]/50",
    glow: "shadow-[0_0_8px_rgba(255,215,0,0.3)]",
  },
  diamond: {
    label: "Diamond",
    color: "text-[#B9F2FF]",
    border: "border-[#B9F2FF]/50",
    glow: "shadow-[0_0_12px_rgba(185,242,255,0.4)]",
  },
}

export function getWeaponTier(kills: number): MasteryTier {
  for (const threshold of MASTERY_THRESHOLDS) {
    if (kills >= threshold.min) return threshold.tier
  }
  return "none"
}

export function getNextTier(currentTier: MasteryTier): MasteryThreshold | null {
  const order: MasteryTier[] = ["none", "bronze", "silver", "gold", "diamond"]
  const idx = order.indexOf(currentTier)
  if (idx >= order.length - 1) return null
  const nextTier = order[idx + 1]
  return MASTERY_THRESHOLDS.find((t) => t.tier === nextTier) ?? null
}

export function getProgress(kills: number): {
  current: number
  target: number
  percentage: number
} {
  const tier = getWeaponTier(kills)
  const next = getNextTier(tier)

  if (!next) return { current: kills, target: kills, percentage: 100 }

  const currentMin = MASTERY_THRESHOLDS.find((t) => t.tier === tier)?.min ?? 0
  const progress = kills - currentMin
  const total = next.min - currentMin

  return {
    current: kills,
    target: next.min,
    percentage: total > 0 ? Math.min((progress / total) * 100, 100) : 0,
  }
}

export interface WeaponMasteryData {
  weapon: string
  kills: number
  tier: MasteryTier
  progress: { current: number; target: number; percentage: number }
}

export function getWeaponMasteryData(
  weapons: WeaponStat[]
): WeaponMasteryData[] {
  return weapons.map((w) => ({
    weapon: w.weapon,
    kills: w.kills,
    tier: getWeaponTier(w.kills),
    progress: getProgress(w.kills),
  }))
}
