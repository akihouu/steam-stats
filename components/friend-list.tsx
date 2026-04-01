"use client"

import { ActivityGroup } from "@/components/activity-group"
import { FriendCard } from "@/components/friend-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useComparisonStore } from "@/hooks/use-comparison-store"
import { staggerContainer, fadeIn } from "@/lib/motion"
import type { SteamPlayer } from "@/lib/steam-types"
import { BarChart3, Search, X } from "lucide-react"
import { motion as m } from "motion/react"
import Link from "next/link"
import { useMemo, useState } from "react"

interface FriendListProps {
  friends: SteamPlayer[]
  groups?: {
    playingCS2: SteamPlayer[]
    inOtherGame: SteamPlayer[]
    online: SteamPlayer[]
    offline: SteamPlayer[]
  }
}

export function FriendList({ friends, groups }: FriendListProps) {
  const [search, setSearch] = useState("")
  const { selectedFriendIds, toggleFriend, clearSelection } =
    useComparisonStore()

  // Sort: online first, then alphabetical (used for flat view)
  const sorted = useMemo(() => {
    let filtered = friends
    if (search) {
      const q = search.toLowerCase()
      filtered = friends.filter((f) => f.personaname.toLowerCase().includes(q))
    }
    return [...filtered].sort((a, b) => {
      if (a.personastate !== b.personastate) {
        if (a.personastate === 0) return 1
        if (b.personastate === 0) return -1
        return 0
      }
      return a.personaname.localeCompare(b.personaname)
    })
  }, [friends, search])

  const hasGroups = groups && !search
  const onlineCount = groups
    ? groups.playingCS2.length +
      groups.inOtherGame.length +
      groups.online.length
    : friends.filter((f) => f.personastate > 0).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">
          Friends{" "}
          <span className="font-normal text-muted-foreground">
            ({friends.length})
          </span>
          <span className="ml-1 text-xs text-emerald-500">
            {onlineCount} online
          </span>
        </h3>
        {selectedFriendIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedFriendIds.length} selected
            </span>
            <Button variant="ghost" size="xs" onClick={clearSelection}>
              <X className="size-3" />
              Clear
            </Button>
            <Button size="xs" asChild>
              <Link href={`/stats?friends=${selectedFriendIds.join(",")}`}>
                <BarChart3 className="size-3" />
                Compare
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {hasGroups ? (
        <div className="flex flex-col gap-4">
          <ActivityGroup
            label="Playing CS2"
            friends={groups.playingCS2}
            accent="text-emerald-500"
          />
          <ActivityGroup
            label="In Other Game"
            friends={groups.inOtherGame}
            accent="text-blue-500"
          />
          <ActivityGroup label="Online" friends={groups.online} />
          <ActivityGroup
            label="Offline"
            friends={groups.offline}
            defaultExpanded={false}
          />
          <p className="text-center text-xs text-muted-foreground">
            Data refreshes every ~2 minutes
          </p>
        </div>
      ) : (
        <m.div
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {sorted.map((friend) => (
            <m.div key={friend.steamid} variants={fadeIn}>
              <FriendCard
                player={friend}
                selected={selectedFriendIds.includes(friend.steamid)}
                onToggle={() => toggleFriend(friend.steamid)}
              />
            </m.div>
          ))}
        </m.div>
      )}

      {sorted.length === 0 && search && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No friends match your search.
        </p>
      )}
    </div>
  )
}
