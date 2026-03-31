import { QuizGame } from "@/components/quiz/quiz-game"
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

export default async function QuizPage() {
  const session = await getSession()
  if (!session) redirect("/")

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
        <p className="text-muted-foreground text-sm">
          You need CS2 stats to play the quiz.
        </p>
      </div>
    )
  }

  // Fetch friend stats
  const friendList = await getFriendList(session.steamid)
  const allPlayers: {
    profile: (typeof userProfile)
    stats: NonNullable<typeof userStats>
  }[] = [{ profile: userProfile, stats: userStats }]

  if (friendList && friendList.length > 0) {
    const sampleIds = friendList.slice(0, 15).map((f) => f.steamid)
    const [profiles, rawStats, ownedGames] = await Promise.all([
      getPlayerSummaries(sampleIds),
      Promise.all(sampleIds.map((id) => getCS2Stats(id))),
      Promise.all(sampleIds.map((id) => getOwnedGames(id))),
    ])

    for (let i = 0; i < sampleIds.length; i++) {
      const profile = profiles.find(
        (p) => p.steamid === sampleIds[i]
      )
      const raw = rawStats[i]
      if (!profile || !raw) continue
      const friendCs2 = ownedGames[i]?.find(
        (g) => g.appid === CS2_APP_ID
      )
      allPlayers.push({
        profile,
        stats: parseCS2Stats(
          raw,
          sampleIds[i],
          friendCs2?.playtime_forever
        ),
      })
    }
  }

  return (
    <div className="py-4">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Guess the Stats
      </h1>
      <QuizGame players={allPlayers} />
    </div>
  )
}
