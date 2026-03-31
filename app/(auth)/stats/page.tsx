import { StatsView } from "@/components/stats/stats-view"
import { parseCS2Stats } from "@/lib/cs2"
import { getSession } from "@/lib/session"
import { getCS2Stats, getFriendList, getPlayerSummaries } from "@/lib/steam"
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
  const [userSummary, userRawStats] = await Promise.all([
    getPlayerSummaries([session.steamid]),
    getCS2Stats(session.steamid),
  ])

  const userProfile = userSummary[0]
  if (!userProfile) redirect("/")

  const userStats = userRawStats
    ? parseCS2Stats(userRawStats, session.steamid)
    : null

  if (!userStats) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <AlertCircle className="text-muted-foreground size-10" />
        <h2 className="text-lg font-semibold">No CS2 Stats Found</h2>
        <p className="text-muted-foreground max-w-sm text-center text-sm">
          Your CS2 stats are not available. Make sure your game details are
          set to public in your Steam privacy settings.
        </p>
      </div>
    )
  }

  // Fetch friend stats if friends are selected
  let friendData: {
    profile: NonNullable<Awaited<ReturnType<typeof getPlayerSummaries>>>[number]
    stats: NonNullable<ReturnType<typeof parseCS2Stats>>
  }[] = []

  if (selectedFriendIds.length > 0) {
    const friendProfiles = await getPlayerSummaries(selectedFriendIds)
    const friendStatsResults = await Promise.all(
      selectedFriendIds.map((id) => getCS2Stats(id))
    )

    friendData = selectedFriendIds
      .map((id, i) => {
        const profile = friendProfiles.find((p) => p.steamid === id)
        const raw = friendStatsResults[i]
        if (!profile || !raw) return null
        return { profile, stats: parseCS2Stats(raw, id) }
      })
      .filter(
        (d): d is NonNullable<typeof d> => d !== null
      )
  }

  // If no friends selected, try to load some automatically
  if (friendData.length === 0 && selectedFriendIds.length === 0) {
    const friendList = await getFriendList(session.steamid)
    if (friendList && friendList.length > 0) {
      // Try first 10 friends to find some with stats
      const sampleIds = friendList.slice(0, 10).map((f) => f.steamid)
      const profiles = await getPlayerSummaries(sampleIds)
      const rawStats = await Promise.all(
        sampleIds.map((id) => getCS2Stats(id))
      )
      friendData = sampleIds
        .map((id, i) => {
          const profile = profiles.find((p) => p.steamid === id)
          const raw = rawStats[i]
          if (!profile || !raw) return null
          return { profile, stats: parseCS2Stats(raw, id) }
        })
        .filter(
          (d): d is NonNullable<typeof d> => d !== null
        )
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
