import { GameTabs } from "@/components/stats/game-tabs"
import { StatsView } from "@/components/stats/stats-view"
import { getDota2Stats } from "@/lib/dota2"
import { isValidGameId } from "@/lib/games"
import { parseCS2Stats } from "@/lib/cs2"
import { parseTF2Stats } from "@/lib/tf2"
import { getSession } from "@/lib/session"
import {
  getCS2Stats,
  getFriendList,
  getOwnedGames,
  getPlayerSummaries,
  getTF2Stats,
} from "@/lib/steam"
import { CS2_APP_ID, TF2_APP_ID } from "@/lib/steam-types"
import type {
  CS2PlayerStats,
  Dota2PlayerStats,
  GameId,
  SteamPlayer,
  TF2PlayerStats,
} from "@/lib/steam-types"
import { AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

interface StatsPageProps {
  searchParams: Promise<{ friends?: string; game?: string }>
}

type AnyStats = CS2PlayerStats | Dota2PlayerStats | TF2PlayerStats

async function fetchUserStats(
  steamid: string,
  game: GameId
): Promise<AnyStats | null> {
  if (game === "dota2") {
    return getDota2Stats(steamid)
  }

  const appId = game === "tf2" ? TF2_APP_ID : CS2_APP_ID
  const fetchFn = game === "tf2" ? getTF2Stats : getCS2Stats

  const [raw, ownedGames] = await Promise.all([
    fetchFn(steamid),
    getOwnedGames(steamid),
  ])

  if (!raw) return null

  const gameEntry = ownedGames?.find((g) => g.appid === appId)
  return game === "tf2"
    ? parseTF2Stats(raw, steamid, gameEntry?.playtime_forever)
    : parseCS2Stats(raw, steamid, gameEntry?.playtime_forever)
}

async function fetchFriendStats(
  friendIds: string[],
  game: GameId
): Promise<{ profile: SteamPlayer; stats: AnyStats }[]> {
  if (friendIds.length === 0) return []

  const profiles = await getPlayerSummaries(friendIds)

  if (game === "dota2") {
    const statsResults = await Promise.all(
      friendIds.map((id) => getDota2Stats(id))
    )
    return friendIds
      .map((id, i) => {
        const profile = profiles.find((p) => p.steamid === id)
        const stats = statsResults[i]
        if (!profile || !stats) return null
        return { profile, stats }
      })
      .filter((d): d is NonNullable<typeof d> => d !== null)
  }

  const appId = game === "tf2" ? TF2_APP_ID : CS2_APP_ID
  const fetchFn = game === "tf2" ? getTF2Stats : getCS2Stats

  const [rawResults, ownedGamesResults] = await Promise.all([
    Promise.all(friendIds.map((id) => fetchFn(id))),
    Promise.all(friendIds.map((id) => getOwnedGames(id))),
  ])

  return friendIds
    .map((id, i) => {
      const profile = profiles.find((p) => p.steamid === id)
      const raw = rawResults[i]
      if (!profile || !raw) return null
      const gameEntry = ownedGamesResults[i]?.find((g) => g.appid === appId)
      const stats =
        game === "tf2"
          ? parseTF2Stats(raw, id, gameEntry?.playtime_forever)
          : parseCS2Stats(raw, id, gameEntry?.playtime_forever)
      return { profile, stats }
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)
}

const GAME_LABELS: Record<GameId, string> = {
  cs2: "CS2",
  dota2: "Dota 2",
  tf2: "TF2",
}

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const session = await getSession()
  if (!session) redirect("/")

  const { friends: friendsParam, game: gameParam } = await searchParams
  const game: GameId = isValidGameId(gameParam ?? "")
    ? (gameParam as GameId)
    : "cs2"
  const selectedFriendIds = friendsParam?.split(",").filter(Boolean) ?? []

  // Fetch user data
  const [userSummary, userStats] = await Promise.all([
    getPlayerSummaries([session.steamid]),
    fetchUserStats(session.steamid, game),
  ])

  const userProfile = userSummary[0]
  if (!userProfile) redirect("/")

  if (!userStats) {
    return (
      <div className="flex flex-col gap-6">
        <GameTabs activeGame={game} />
        <div className="flex flex-col items-center gap-4 py-20">
          <AlertCircle className="size-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">
            No {GAME_LABELS[game]} Stats Found
          </h2>
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Your {GAME_LABELS[game]} stats are not available. Make sure you
            own the game and your game details are set to public.
          </p>
          <div className="max-w-sm rounded-lg bg-muted p-4 text-sm">
            <p className="mb-2 font-medium">How to fix:</p>
            <ol className="list-inside list-decimal space-y-1 text-xs text-muted-foreground">
              <li>
                Open Steam → Profile → Edit Profile → Privacy Settings
              </li>
              <li>Set &quot;Game details&quot; to Public</li>
              <li>Come back and refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  // Fetch friend stats
  let friendData = await fetchFriendStats(selectedFriendIds, game)

  // If no friends selected, try to load some automatically
  if (friendData.length === 0 && selectedFriendIds.length === 0) {
    const friendList = await getFriendList(session.steamid)
    if (friendList && friendList.length > 0) {
      const sampleIds = friendList.slice(0, 10).map((f) => f.steamid)
      friendData = await fetchFriendStats(sampleIds, game)
    }
  }

  return (
    <StatsView
      game={game}
      userProfile={userProfile}
      userStats={userStats}
      friendData={friendData}
    />
  )
}
