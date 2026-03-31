import type { PlayerAchievement } from "./steam-types"

export const ACHIEVEMENT_NAMES: Record<string, string> = {
  KILL_ENEMY_RELOADING: "Kill an enemy while they reload",
  KILL_ENEMY_BLINDED: "Kill a blinded enemy",
  KILL_ENEMIES_WHILE_BLIND: "Kill an enemy while blinded",
  KILL_ENEMIES_WHILE_BLINDED: "Kill an enemy while blinded",
  KILLS_WITH_LAST_ROUND: "Kill with last round in magazine",
  KILL_ENEMY_WITH_KNIFE: "Knife kill",
  KILL_WHILE_IN_AIR: "Kill while in mid-air",
  KILL_ENEMY_IN_AIR: "Kill an airborne enemy",
  HEADSHOTS: "500 headshot kills",
  KILLS_ENEMY_WEAPON: "Kill with enemy weapon",
  KILL_WITH_EVERY_WEAPON: "Kill with every weapon",
  WIN_BOMB_DEFUSE: "Win a bomb defuse round",
  BOMB_PLANT_LOW: "Plant with < 1s left",
  BOMB_DEFUSE_LOW: "Defuse with < 1s left",
  KILL_BOMB_DEFUSER: "Kill the defuser",
  PLANT_BOMB_WITHIN_25SEC: "Plant within 25 seconds",
  RESCUE_ALL_HOSTAGES: "Rescue all hostages",
  KILL_ALL_HOSTAGE_RESCUERS: "Kill all hostage rescuers",
  FAST_ROUND_WIN: "Win round in 30 seconds",
  PISTOL_ROUND_KNIFE_KILL: "Knife kill in pistol round",
  WIN_ROUNDS_LOW: "Win after being down 0-3",
  WIN_MAP_DE_DUST2: "Win on Dust 2",
  WIN_MAP_DE_INFERNO: "Win on Inferno",
  WIN_MAP_DE_NUKE: "Win on Nuke",
  WIN_MAP_DE_TRAIN: "Win on Train",
  KILL_ENEMY_TEAM: "Ace (kill entire enemy team)",
  LOSSLESS_EXTERMINATION: "Flawless round (no deaths on team)",
  FLAWLESS_VICTORY: "Win without taking damage",
  WIN_PISTOLROUNDS_LOW: "Win pistol round",
  WIN_GUN_GAME_ROUNDS_LOW: "Win arms race rounds",
  WIN_GUN_GAME_ROUNDS_MED: "Win 25 arms race rounds",
  WIN_GUN_GAME_ROUNDS_HIGH: "Win 100 arms race rounds",
  PLAY_EVERY_GUNGAME_MAP: "Play every arms race map",
  WIN_EVERY_GUNGAME_MAP: "Win on every arms race map",
  PLAY_EVERY_DE_MAP: "Play every defuse map",
  META_PISTOL: "Pistol master",
  META_RIFLE: "Rifle master",
  META_SMG: "SMG master",
  META_SHOTGUN: "Shotgun master",
  META_WEAPONMASTER: "Weapon master",
  UNSTOPPABLE_FORCE: "Win 100 rounds",
  IMMOVABLE_OBJECT: "Win 250 rounds",
  HEAD_SHRED_EXPERT: "1000 headshot kills",
  EARN_101_POINTS: "Earn 101 points in a match",
  HIT_ACCURACY: "Hit 75% accuracy in a match",
  SURVIVE_GRENADE: "Survive a grenade",
  EARNED_A_NUKE: "Earn a nuke (100 kills in deathmatch)",
  KILL_SNIPERS: "Kill 100 snipers",
  DAMAGE_NO_KILL: "Deal 500+ damage without killing",
  KILL_LOW_DAMAGE: "Kill with 1 HP remaining",
  GG_FIRST_KILL: "First kill in arms race",
  BASE_SCAMPER: "Win a round with bomb planted",
  BORN_READY: "Kill within 1 second of spawning",
  STILL_ALIVE: "Survive 5 rounds in a row",
  MEDALIST: "Earn 1000 MVP stars",
  THE_UNSTOPPABLE_FORCE: "Win 500 rounds",
  COLD_KILLER: "10 kills in a single round",
  SAFARI_HUNTER: "Kill every type of bot",
}

export type AchievementRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "ultra-rare"

export interface AchievementWithRarity {
  name: string
  displayName: string
  achieved: boolean
  rarity: AchievementRarity
  friendPercentage: number
}

export function getAchievementDisplayName(name: string): string {
  return ACHIEVEMENT_NAMES[name] ?? name.replace(/_/g, " ").toLowerCase()
}

export function getRarity(percentage: number): AchievementRarity {
  if (percentage > 75) return "common"
  if (percentage > 50) return "uncommon"
  if (percentage > 25) return "rare"
  return "ultra-rare"
}

export const RARITY_CONFIG: Record<
  AchievementRarity,
  { label: string; color: string; bg: string }
> = {
  common: {
    label: "Common",
    color: "text-zinc-400",
    bg: "bg-zinc-400/10",
  },
  uncommon: {
    label: "Uncommon",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  rare: {
    label: "Rare",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  "ultra-rare": {
    label: "Ultra Rare",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
}

export function calculateAchievementRarity(
  userAchievements: PlayerAchievement[],
  friendAchievements: PlayerAchievement[][]
): AchievementWithRarity[] {
  const allPlayers = [userAchievements, ...friendAchievements]
  const totalPlayers = allPlayers.length

  return userAchievements.map((achievement) => {
    const achievedCount = allPlayers.filter((playerAchs) =>
      playerAchs.some(
        (a) => a.name === achievement.name && a.achieved
      )
    ).length

    const friendPercentage =
      totalPlayers > 0 ? (achievedCount / totalPlayers) * 100 : 0

    return {
      name: achievement.name,
      displayName: getAchievementDisplayName(achievement.name),
      achieved: achievement.achieved,
      rarity: getRarity(friendPercentage),
      friendPercentage,
    }
  })
}
