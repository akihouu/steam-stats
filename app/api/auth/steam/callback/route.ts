import { getEnv } from "@/lib/env"
import { createSession, sessionCookieOptions } from "@/lib/session"
import { getPlayerSummaries } from "@/lib/steam"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

async function verifySteamLogin(
  params: URLSearchParams
): Promise<boolean> {
  const verifyParams = new URLSearchParams(params)
  verifyParams.set("openid.mode", "check_authentication")

  const res = await fetch(
    "https://steamcommunity.com/openid/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: verifyParams.toString(),
    }
  )

  const text = await res.text()
  return text.includes("is_valid:true")
}

function extractSteamId(claimedId: string): string | null {
  const match = claimedId.match(
    /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/
  )
  return match?.[1] ?? null
}

export async function GET(request: NextRequest) {
  const { baseUrl } = getEnv()
  const { searchParams } = request.nextUrl

  const isValid = await verifySteamLogin(searchParams)
  if (!isValid) {
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`)
  }

  const claimedId = searchParams.get("openid.claimed_id")
  if (!claimedId) {
    return NextResponse.redirect(`${baseUrl}/?error=no_claimed_id`)
  }

  const steamid = extractSteamId(claimedId)
  if (!steamid) {
    return NextResponse.redirect(`${baseUrl}/?error=invalid_steam_id`)
  }

  const players = await getPlayerSummaries([steamid])
  const player = players[0]
  if (!player) {
    return NextResponse.redirect(`${baseUrl}/?error=player_not_found`)
  }

  const token = await createSession(player)
  const cookieStore = await cookies()
  const opts = sessionCookieOptions(token)
  cookieStore.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  })

  return NextResponse.redirect(`${baseUrl}/dashboard`)
}
