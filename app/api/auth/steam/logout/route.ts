import { getEnv } from "@/lib/env"
import { clearSessionCookie } from "@/lib/session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const { baseUrl } = getEnv()
  const cookieStore = await cookies()
  const opts = clearSessionCookie()
  cookieStore.set(opts.name, opts.value, {
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
    path: opts.path,
    maxAge: opts.maxAge,
  })

  return NextResponse.redirect(baseUrl)
}
