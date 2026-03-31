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
