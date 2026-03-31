import { parseCS2Stats } from "@/lib/cs2"
import { getSession } from "@/lib/session"
import { getCS2Stats } from "@/lib/steam"
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

  const raw = await getCS2Stats(steamid)
  if (!raw) {
    return NextResponse.json(
      { error: "Stats unavailable (profile may be private)" },
      { status: 404 }
    )
  }

  const stats = parseCS2Stats(raw, steamid)
  return NextResponse.json({ stats })
}
