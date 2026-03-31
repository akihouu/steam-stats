"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Crosshair,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

interface NavBarProps {
  user: {
    steamid: string
    personaname: string
    avatarfull: string
  }
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/stats", label: "CS2 Stats", icon: BarChart3 },
]

export function NavBar({ user }: NavBarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-card sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Crosshair className="text-primary size-5" />
          <span className="hidden sm:inline">Steam Stats</span>
        </Link>

        <Separator orientation="vertical" className="!h-6" />

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant={pathname.startsWith(link.href) ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "gap-2",
                pathname.startsWith(link.href) && "font-medium"
              )}
              asChild
            >
              <Link href={link.href}>
                <link.icon className="size-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="size-4 scale-100 dark:scale-0" />
            <Moon className="absolute size-4 scale-0 dark:scale-100" />
          </Button>

          <Separator orientation="vertical" className="!h-6" />

          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarImage src={user.avatarfull} alt={user.personaname} />
              <AvatarFallback>
                {user.personaname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">
              {user.personaname}
            </span>
          </div>

          <Button variant="ghost" size="icon-sm" asChild>
            <a href="/api/auth/steam/logout">
              <LogOut className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
