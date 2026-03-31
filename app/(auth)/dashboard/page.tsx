import { FriendList } from "@/components/friend-list"
import { ProfileCard } from "@/components/profile-card"
import { getSession } from "@/lib/session"
import { getFriendList, getOwnedGames, getPlayerSummaries } from "@/lib/steam"
import { CS2_APP_ID } from "@/lib/steam-types"
import { AlertCircle, Lock } from "lucide-react"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/")

  const [playerSummaries, friends, ownedGames] = await Promise.all([
    getPlayerSummaries([session.steamid]),
    getFriendList(session.steamid),
    getOwnedGames(session.steamid),
  ])

  const player = playerSummaries[0]
  if (!player) redirect("/")

  const cs2 = ownedGames?.find((g) => g.appid === CS2_APP_ID)

  // Fetch friend profiles if friend list is available
  let friendProfiles = null
  if (friends && friends.length > 0) {
    const friendIds = friends.map((f) => f.steamid)
    friendProfiles = await getPlayerSummaries(friendIds)
  }

  // Group friends by activity status
  const groups = friendProfiles
    ? {
        playingCS2: friendProfiles.filter(
          (f) => f.gameid === "730"
        ),
        inOtherGame: friendProfiles.filter(
          (f) => f.gameid && f.gameid !== "730"
        ),
        online: friendProfiles.filter(
          (f) => !f.gameid && f.personastate > 0
        ),
        offline: friendProfiles.filter(
          (f) => !f.gameid && f.personastate === 0
        ),
      }
    : null

  return (
    <div className="flex flex-col gap-6">
      <ProfileCard player={player} cs2Playtime={cs2?.playtime_forever} />

      {friends === null ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-12">
          <Lock className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-sm">
            Your friend list is set to private.
          </p>
          <p className="text-muted-foreground text-xs">
            Change your Steam privacy settings to see friends here.
          </p>
        </div>
      ) : friendProfiles && friendProfiles.length > 0 ? (
        <FriendList friends={friendProfiles} groups={groups!} />
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-12">
          <AlertCircle className="text-muted-foreground size-8" />
          <p className="text-muted-foreground text-sm">No friends found.</p>
        </div>
      )}
    </div>
  )
}
