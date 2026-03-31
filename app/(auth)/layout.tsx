import { CommandPalette } from "@/components/command-palette"
import { NavBar } from "@/components/nav-bar"
import { getSession } from "@/lib/session"
import { getFriendList, getPlayerSummaries } from "@/lib/steam"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/")

  // Fetch friend names for the command palette
  const friendList = await getFriendList(session.steamid)
  let friendNames: { steamid: string; name: string }[] = []
  if (friendList && friendList.length > 0) {
    const ids = friendList.slice(0, 50).map((f) => f.steamid)
    const profiles = await getPlayerSummaries(ids)
    friendNames = profiles.map((p) => ({
      steamid: p.steamid,
      name: p.personaname,
    }))
  }

  return (
    <div className="min-h-svh">
      <NavBar user={session} />
      <CommandPalette friends={friendNames} />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}
