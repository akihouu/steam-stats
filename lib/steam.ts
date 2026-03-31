import "server-only"

import { getEnv } from "./env"
import type {
  CS2RawStats,
  OwnedGame,
  SteamFriend,
  SteamPlayer,
} from "./steam-types"
import { CS2_APP_ID } from "./steam-types"

const STEAM_API = "https://api.steampowered.com"

async function steamFetch<T>(
  path: string,
  params: Record<string, string>,
  revalidate: number
): Promise<T | null> {
  const { steamApiKey } = getEnv()
  const url = new URL(`${STEAM_API}${path}`)
  url.searchParams.set("key", steamApiKey)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }

  const res = await fetch(url.toString(), {
    next: { revalidate },
  } as RequestInit)

  if (!res.ok) return null

  return res.json() as Promise<T>
}

export async function getPlayerSummaries(
  steamids: string[]
): Promise<SteamPlayer[]> {
  if (steamids.length === 0) return []

  // Steam API accepts max 100 IDs per request
  const chunks: string[][] = []
  for (let i = 0; i < steamids.length; i += 100) {
    chunks.push(steamids.slice(i, i + 100))
  }

  const results = await Promise.all(
    chunks.map((chunk) =>
      steamFetch<{ response: { players: SteamPlayer[] } }>(
        "/ISteamUser/GetPlayerSummaries/v2/",
        { steamids: chunk.join(",") },
        120
      )
    )
  )

  return results.flatMap((r) => r?.response.players ?? [])
}

export async function getFriendList(
  steamid: string
): Promise<SteamFriend[] | null> {
  const data = await steamFetch<{
    friendslist: { friends: SteamFriend[] }
  }>(
    "/ISteamUser/GetFriendList/v1/",
    { steamid, relationship: "friend" },
    300
  )

  return data?.friendslist.friends ?? null
}

export async function getCS2Stats(
  steamid: string
): Promise<CS2RawStats | null> {
  const data = await steamFetch<{
    playerstats: {
      stats: CS2RawStats["stats"]
      achievements?: CS2RawStats["achievements"]
    }
  }>(
    "/ISteamUserStats/GetUserStatsForGame/v2/",
    { steamid, appid: CS2_APP_ID.toString() },
    600
  )

  if (!data?.playerstats) return null

  return {
    stats: data.playerstats.stats,
    achievements: data.playerstats.achievements,
  }
}

export async function getOwnedGames(
  steamid: string
): Promise<OwnedGame[] | null> {
  const data = await steamFetch<{
    response: { game_count: number; games: OwnedGame[] }
  }>(
    "/IPlayerService/GetOwnedGames/v1/",
    {
      steamid,
      include_appinfo: "1",
      include_played_free_games: "1",
    },
    600
  )

  return data?.response.games ?? null
}

export async function getRecentlyPlayedGames(
  steamid: string
): Promise<OwnedGame[] | null> {
  const data = await steamFetch<{
    response: { total_count: number; games: OwnedGame[] }
  }>(
    "/IPlayerService/GetRecentlyPlayedGames/v1/",
    { steamid },
    300
  )

  return data?.response.games ?? null
}
