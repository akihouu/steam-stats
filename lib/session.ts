import "server-only"

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { SteamPlayer } from "./steam-types"

const COOKIE_NAME = "steam_session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

interface SessionPayload {
  steamid: string
  personaname: string
  avatarfull: string
}

function getSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error("Missing SESSION_SECRET")
  return new TextEncoder().encode(secret)
}

export async function createSession(player: SteamPlayer): Promise<string> {
  const token = await new SignJWT({
    steamid: player.steamid,
    personaname: player.personaname,
    avatarfull: player.avatarfull,
  } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())

  return token
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
  }
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  }
}
