import { getSession } from "@/lib/session"
import { getFriendList, getPlayerSummaries } from "@/lib/steam"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const friends = await getFriendList(session.steamid)
  if (!friends) {
    return NextResponse.json({ error: "Friend list is private" }, { status: 403 })
  }

  const friendIds = friends.map((f) => f.steamid)
  const profiles = await getPlayerSummaries(friendIds)

  return NextResponse.json({ friends: profiles })
}
