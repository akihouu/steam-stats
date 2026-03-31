import { StatsView } from "@/components/stats/stats-view"
import { parseCS2Stats } from "@/lib/cs2"
import { getSession } from "@/lib/session"
import {
  getCS2Stats,
  getFriendList,
  getOwnedGames,
  getPlayerSummaries,
} from "@/lib/steam"
import { CS2_APP_ID } from "@/lib/steam-types"
import { AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

interface StatsPageProps {
  searchParams: Promise<{ friends?: string }>
}

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const session = await getSession()
  if (!session) redirect("/")

  const { friends: friendsParam } = await searchParams
  const selectedFriendIds = friendsParam?.split(",").filter(Boolean) ?? []

  // Fetch user data
  const [userSummary, userRawStats, userOwnedGames] = await Promise.all([
    getPlayerSummaries([session.steamid]),
    getCS2Stats(session.steamid),
    getOwnedGames(session.steamid),
  ])

  const userProfile = userSummary[0]
  if (!userProfile) redirect("/")

  const cs2Game = userOwnedGames?.find((g) => g.appid === CS2_APP_ID)
  const userStats = userRawStats
    ? parseCS2Stats(userRawStats, session.steamid, cs2Game?.playtime_forever)
    : null

  if (!userStats) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <AlertCircle className="text-muted-foreground size-10" />
        <h2 className="text-lg font-semibold">No CS2 Stats Found</h2>
        <p className="text-muted-foreground max-w-sm text-center text-sm">
          Your CS2 stats are not available. The Steam API requires your
          game details to be public — even for your own account.
        </p>
        <div className="bg-muted max-w-sm rounded-lg p-4 text-sm">
          <p className="mb-2 font-medium">How to fix:</p>
          <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-xs">
            <li>Open Steam → Profile → Edit Profile → Privacy Settings</li>
            <li>Set &quot;Game details&quot; to Public</li>
            <li>Come back and refresh this page</li>
          </ol>
        </div>
      </div>
    )
  }

  // Fetch friend stats if friends are selected
  let friendData: {
    profile: NonNullable<Awaited<ReturnType<typeof getPlayerSummaries>>>[number]
    stats: NonNullable<ReturnType<typeof parseCS2Stats>>
  }[] = []

  if (selectedFriendIds.length > 0) {
    const [friendProfiles, friendStatsResults, friendOwnedGames] =
      await Promise.all([
        getPlayerSummaries(selectedFriendIds),
        Promise.all(selectedFriendIds.map((id) => getCS2Stats(id))),
        Promise.all(selectedFriendIds.map((id) => getOwnedGames(id))),
      ])

    friendData = selectedFriendIds
      .map((id, i) => {
        const profile = friendProfiles.find((p) => p.steamid === id)
        const raw = friendStatsResults[i]
        if (!profile || !raw) return null
        const friendCs2 = friendOwnedGames[i]?.find(
          (g) => g.appid === CS2_APP_ID
        )
        return {
          profile,
          stats: parseCS2Stats(raw, id, friendCs2?.playtime_forever),
        }
      })
      .filter((d): d is NonNullable<typeof d> => d !== null)
  }

  // If no friends selected, try to load some automatically
  if (friendData.length === 0 && selectedFriendIds.length === 0) {
    const friendList = await getFriendList(session.steamid)
    if (friendList && friendList.length > 0) {
      // Try first 10 friends to find some with stats
      const sampleIds = friendList.slice(0, 10).map((f) => f.steamid)
      const [profiles, rawStats, sampleOwnedGames] = await Promise.all([
        getPlayerSummaries(sampleIds),
        Promise.all(sampleIds.map((id) => getCS2Stats(id))),
        Promise.all(sampleIds.map((id) => getOwnedGames(id))),
      ])
      friendData = sampleIds
        .map((id, i) => {
          const profile = profiles.find((p) => p.steamid === id)
          const raw = rawStats[i]
          if (!profile || !raw) return null
          const friendCs2 = sampleOwnedGames[i]?.find(
            (g) => g.appid === CS2_APP_ID
          )
          return {
            profile,
            stats: parseCS2Stats(raw, id, friendCs2?.playtime_forever),
          }
        })
        .filter((d): d is NonNullable<typeof d> => d !== null)
    }
  }

  return (
    <StatsView
      userProfile={userProfile}
      userStats={userStats}
      friendData={friendData}
    />
  )
}
