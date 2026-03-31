import { parseCS2Stats } from "@/lib/cs2"
import { getSession } from "@/lib/session"
import { getCS2Stats, getOwnedGames } from "@/lib/steam"
import { CS2_APP_ID } from "@/lib/steam-types"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ steamid: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { steamid } = await params

  const [raw, ownedGames] = await Promise.all([
    getCS2Stats(steamid),
    getOwnedGames(steamid),
  ])
  if (!raw) {
    return NextResponse.json(
      { error: "Stats unavailable (profile may be private)" },
      { status: 404 }
    )
  }

  const cs2Game = ownedGames?.find((g) => g.appid === CS2_APP_ID)
  const stats = parseCS2Stats(raw, steamid, cs2Game?.playtime_forever)
  return NextResponse.json({ stats })
}
