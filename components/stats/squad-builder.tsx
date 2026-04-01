"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { staggerContainer, fadeIn } from "@/lib/motion"
import { buildDreamTeam } from "@/lib/squad"
import type { CS2PlayerStats, SteamPlayer } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { Crown, Crosshair, Eye, Shield, Swords, Users } from "lucide-react"
import { motion as m } from "motion/react"
import type { LucideIcon } from "lucide-react"

const ROLE_ICONS: Record<string, LucideIcon> = {
  swords: Swords,
  crosshair: Crosshair,
  shield: Shield,
  eye: Eye,
  crown: Crown,
}

const ROLE_COLORS: Record<string, string> = {
  entry: "text-red-500 bg-red-500/10",
  awper: "text-green-500 bg-green-500/10",
  support: "text-blue-500 bg-blue-500/10",
  lurker: "text-purple-500 bg-purple-500/10",
  igl: "text-amber-500 bg-amber-500/10",
}

interface SquadBuilderProps {
  userProfile: SteamPlayer
  userStats: CS2PlayerStats
  friendData: { profile: SteamPlayer; stats: CS2PlayerStats }[]
}

export function SquadBuilder({
  userProfile,
  userStats,
  friendData,
}: SquadBuilderProps) {
  const allPlayers = [{ profile: userProfile, stats: userStats }, ...friendData]
  const { members, synergyScore } = buildDreamTeam(allPlayers)

  if (members.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Users className="size-4" />
            Dream Team
          </span>
          <span className="text-sm font-semibold text-primary tabular-nums">
            {synergyScore}% synergy
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <m.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {members.map((member) => {
            const Icon = ROLE_ICONS[member.role.icon] ?? Swords
            const colorClass =
              ROLE_COLORS[member.role.id] ?? "text-primary bg-primary/10"
            const [textColor, bgColor] = colorClass.split(" ")

            return (
              <m.div
                key={member.profile.steamid}
                variants={fadeIn}
                className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center"
              >
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full",
                    bgColor
                  )}
                >
                  <Icon className={cn("size-4", textColor)} />
                </div>
                <Avatar className="size-12">
                  <AvatarImage
                    src={member.profile.avatarmedium}
                    alt={member.profile.personaname}
                  />
                  <AvatarFallback>
                    {member.profile.personaname.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="max-w-[120px] truncate text-sm font-medium">
                    {member.profile.personaname}
                  </p>
                  <p className={cn("text-xs font-semibold", textColor)}>
                    {member.role.name}
                  </p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <m.div
                    className={cn("h-full rounded-full bg-current", textColor)}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${member.roleScore}%`,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {member.roleScore}% fit
                </p>
                {member.strengths.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1">
                    {member.strengths.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-muted px-1.5 py-0.5 text-[10px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </m.div>
            )
          })}

          {/* Placeholder slots if < 5 */}
          {Array.from({ length: Math.max(0, 5 - members.length) }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 opacity-40"
              >
                <Users className="size-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Recruit more friends
                </p>
              </div>
            )
          )}
        </m.div>
      </CardContent>
    </Card>
  )
}
