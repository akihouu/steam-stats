import type { GameId } from "./steam-types"
import { CS2_APP_ID, DOTA2_APP_ID, TF2_APP_ID } from "./steam-types"

export interface GameConfig {
  id: GameId
  name: string
  shortName: string
  appId: number
  color: string
  features: readonly string[]
}

export const GAME_CONFIGS: Record<GameId, GameConfig> = {
  cs2: {
    id: "cs2",
    name: "Counter-Strike 2",
    shortName: "CS2",
    appId: CS2_APP_ID,
    color: "orange",
    features: [
      "weapons",
      "maps",
      "accuracy",
      "achievements",
      "milestones",
      "weapon-mastery",
      "squad-builder",
      "wrapped",
      "quiz",
    ],
  },
  dota2: {
    id: "dota2",
    name: "Dota 2",
    shortName: "Dota 2",
    appId: DOTA2_APP_ID,
    color: "red",
    features: ["heroes", "achievements"],
  },
  tf2: {
    id: "tf2",
    name: "Team Fortress 2",
    shortName: "TF2",
    appId: TF2_APP_ID,
    color: "amber",
    features: ["classes", "achievements"],
  },
} as const

export const GAME_IDS = Object.keys(GAME_CONFIGS) as GameId[]

export function isValidGameId(id: string): id is GameId {
  return id in GAME_CONFIGS
}
