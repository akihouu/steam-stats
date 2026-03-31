export interface MilestoneDefinition {
  category: string
  statKey: string
  targets: number[]
  icon: string
}

export const MILESTONE_DEFINITIONS: MilestoneDefinition[] = [
  {
    category: "Kills",
    statKey: "totalKills",
    targets: [1000, 5000, 10000, 25000, 50000, 100000],
    icon: "crosshair",
  },
  {
    category: "Wins",
    statKey: "totalWins",
    targets: [500, 1000, 2500, 5000],
    icon: "trophy",
  },
  {
    category: "Headshots",
    statKey: "headshotKills",
    targets: [500, 1000, 5000, 10000],
    icon: "target",
  },
  {
    category: "MVPs",
    statKey: "totalMvps",
    targets: [500, 1000, 5000],
    icon: "star",
  },
  {
    category: "Bomb Plants",
    statKey: "totalPlantedBombs",
    targets: [500, 1000, 2500],
    icon: "bomb",
  },
]

export interface MilestoneProgress {
  category: string
  icon: string
  current: number
  target: number
  remaining: number
  percentage: number
  projectedDate: string | null
  completed: boolean
}

export function calculateMilestones(
  stats: Record<string, number>,
  playtimeSeconds: number,
  headshotPercentage: number,
  totalKills: number
): MilestoneProgress[] {
  const milestones: MilestoneProgress[] = []

  for (const def of MILESTONE_DEFINITIONS) {
    let currentValue: number
    if (def.statKey === "headshotKills") {
      currentValue = Math.round((headshotPercentage / 100) * totalKills)
    } else {
      currentValue = stats[def.statKey] ?? 0
    }

    // Find next uncompleted milestone
    const nextTarget = def.targets.find((t) => currentValue < t)
    const lastCompleted = [...def.targets]
      .reverse()
      .find((t) => currentValue >= t)

    if (nextTarget) {
      const remaining = nextTarget - currentValue
      const percentage = (currentValue / nextTarget) * 100

      // Project completion date based on rate
      let projectedDate: string | null = null
      if (playtimeSeconds > 0 && currentValue > 0) {
        const playtimeHours = playtimeSeconds / 3600
        const ratePerHour = currentValue / playtimeHours
        if (ratePerHour > 0) {
          const hoursNeeded = remaining / ratePerHour
          const date = new Date()
          date.setHours(date.getHours() + hoursNeeded)
          projectedDate = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        }
      }

      milestones.push({
        category: def.category,
        icon: def.icon,
        current: currentValue,
        target: nextTarget,
        remaining,
        percentage,
        projectedDate,
        completed: false,
      })
    } else if (lastCompleted) {
      // All milestones completed for this category
      milestones.push({
        category: def.category,
        icon: def.icon,
        current: currentValue,
        target: lastCompleted,
        remaining: 0,
        percentage: 100,
        projectedDate: null,
        completed: true,
      })
    }
  }

  return milestones
}
