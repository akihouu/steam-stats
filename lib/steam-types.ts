export interface SteamPlayer {
  steamid: string
  personaname: string
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  personastate: number
  communityvisibilitystate: number
  lastlogoff?: number
  timecreated?: number
  loccountrycode?: string
  gameextrainfo?: string
  gameid?: string
}

export interface SteamFriend {
  steamid: string
  relationship: string
  friend_since: number
}

export interface SteamGameStat {
  name: string
  value: number
}

export interface SteamPlayerAchievement {
  name: string
  achieved: number
}

export interface OwnedGame {
  appid: number
  name: string
  playtime_forever: number
  playtime_2weeks?: number
  img_icon_url: string
  has_community_visible_stats?: boolean
}

export interface CS2RawStats {
  stats: SteamGameStat[]
  achievements?: SteamPlayerAchievement[]
}

export interface WeaponAccuracy {
  weapon: string
  shots: number
  hits: number
  accuracy: number
}

export interface PlayerAchievement {
  name: string
  achieved: boolean
}

export interface CS2PlayerStats {
  steamid: string
  totalKills: number
  totalDeaths: number
  totalWins: number
  totalTimePlayed: number
  kdRatio: number
  winRate: number
  headshotPercentage: number
  totalMvps: number
  totalDamage: number
  totalMoneyEarned: number
  totalWeaponsDonated: number
  totalBrokenWindows: number
  totalPlantedBombs: number
  totalDefusedBombs: number
  totalKnifeKills: number
  lastMatchKills: number
  lastMatchDeaths: number
  totalShotsFired: number
  totalShotsHit: number
  accuracy: number
  weaponAccuracy: WeaponAccuracy[]
  achievements: PlayerAchievement[]
  weapons: WeaponStat[]
  maps: MapStat[]
}

export interface WeaponStat {
  weapon: string
  kills: number
}

export interface MapStat {
  map: string
  wins: number
}

export interface FriendWithProfile extends SteamPlayer {
  friendSince: number
}

export interface PlayerComparison {
  player: SteamPlayer
  stats: CS2PlayerStats | null
}

export type PersonaState =
  | "offline"
  | "online"
  | "busy"
  | "away"
  | "snooze"
  | "looking-to-trade"
  | "looking-to-play"

export const PERSONA_STATES: Record<number, PersonaState> = {
  0: "offline",
  1: "online",
  2: "busy",
  3: "away",
  4: "snooze",
  5: "looking-to-trade",
  6: "looking-to-play",
}

export const CS2_APP_ID = 730
export const DOTA2_APP_ID = 570
export const TF2_APP_ID = 440

export type GameId = "cs2" | "dota2" | "tf2"

// ---------- Dota 2 Types ----------

export interface Dota2PlayerStats {
  steamid: string
  totalKills: number
  totalDeaths: number
  totalAssists: number
  kdaRatio: number
  totalWins: number
  totalLosses: number
  winRate: number
  totalLastHits: number
  totalDenies: number
  totalGoldPerMin: number
  totalXpPerMin: number
  totalHeroDamage: number
  totalHeroHealing: number
  totalTowerDamage: number
  totalTimePlayed: number
  heroes: Dota2HeroStat[]
  achievements: PlayerAchievement[]
}

export interface Dota2HeroStat {
  heroId: number
  heroName: string
  games: number
  wins: number
  winRate: number
}

// ---------- TF2 Types ----------

export interface TF2PlayerStats {
  steamid: string
  totalKills: number
  totalDeaths: number
  kdRatio: number
  totalPointsScored: number
  totalDamage: number
  totalPlaytime: number
  totalCaptures: number
  totalDefenses: number
  totalDominations: number
  totalRevenges: number
  totalHeadshots: number
  totalBackstabs: number
  totalHealingDone: number
  totalBuildingsBuilt: number
  totalBuildingsDestroyed: number
  totalSentryKills: number
  totalTeleports: number
  totalInvulns: number
  classes: TF2ClassStat[]
  achievements: PlayerAchievement[]
}

export interface TF2ClassStat {
  className: string
  playtime: number
  kills: number
  assists: number
  deaths: number
  damage: number
  points: number
}

// ---------- Generic Game Stats Union ----------

export type GamePlayerStats =
  | { game: "cs2"; stats: CS2PlayerStats }
  | { game: "dota2"; stats: Dota2PlayerStats }
  | { game: "tf2"; stats: TF2PlayerStats }

export type AnyPlayerStats = CS2PlayerStats | Dota2PlayerStats | TF2PlayerStats
