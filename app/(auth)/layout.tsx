import { NavBar } from "@/components/nav-bar"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/")

  return (
    <div className="min-h-svh">
      <NavBar user={session} />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}
