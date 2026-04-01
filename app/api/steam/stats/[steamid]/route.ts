import { parseCS2Stats } from "@/lib/cs2"
import { getDota2Stats } from "@/lib/dota2"
import { isValidGameId } from "@/lib/games"
import { getSession } from "@/lib/session"
import { getCS2Stats, getOwnedGames, getTF2Stats } from "@/lib/steam"
import { CS2_APP_ID, TF2_APP_ID } from "@/lib/steam-types"
import type { GameId } from "@/lib/steam-types"
import { parseTF2Stats } from "@/lib/tf2"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ steamid: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { steamid } = await params
  const gameParam = request.nextUrl.searchParams.get("game") ?? "cs2"
  const game: GameId = isValidGameId(gameParam) ? gameParam : "cs2"

  if (game === "dota2") {
    const stats = await getDota2Stats(steamid)
    if (!stats) {
      return NextResponse.json(
        { error: "Stats unavailable (profile may be private)" },
        { status: 404 }
      )
    }
    return NextResponse.json({ game, stats })
  }

  const appId = game === "tf2" ? TF2_APP_ID : CS2_APP_ID
  const fetchStats = game === "tf2" ? getTF2Stats : getCS2Stats

  const [raw, ownedGames] = await Promise.all([
    fetchStats(steamid),
    getOwnedGames(steamid),
  ])

  if (!raw) {
    return NextResponse.json(
      { error: "Stats unavailable (profile may be private)" },
      { status: 404 }
    )
  }

  const gameEntry = ownedGames?.find((g) => g.appid === appId)
  const stats =
    game === "tf2"
      ? parseTF2Stats(raw, steamid, gameEntry?.playtime_forever)
      : parseCS2Stats(raw, steamid, gameEntry?.playtime_forever)

  return NextResponse.json({ game, stats })
}
