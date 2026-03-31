"use client"

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
}

export function FriendList({ friends }: FriendListProps) {
  const [search, setSearch] = useState("")
  const { selectedFriendIds, toggleFriend, clearSelection } =
    useComparisonStore()

  const filtered = useMemo(() => {
    if (!search) return friends
    const q = search.toLowerCase()
    return friends.filter((f) => f.personaname.toLowerCase().includes(q))
  }, [friends, search])

  // Sort: online first, then alphabetical
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.personastate !== b.personastate) {
        if (a.personastate === 0) return 1
        if (b.personastate === 0) return -1
        return 0
      }
      return a.personaname.localeCompare(b.personaname)
    })
  }, [filtered])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">
          Friends{" "}
          <span className="text-muted-foreground font-normal">
            ({friends.length})
          </span>
        </h3>
        {selectedFriendIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {selectedFriendIds.length} selected
            </span>
            <Button variant="ghost" size="xs" onClick={clearSelection}>
              <X className="size-3" />
              Clear
            </Button>
            <Button size="xs" asChild>
              <Link
                href={`/stats?friends=${selectedFriendIds.join(",")}`}
              >
                <BarChart3 className="size-3" />
                Compare
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

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

      {sorted.length === 0 && (
        <p className="text-muted-foreground py-8 text-center text-sm">
          {search ? "No friends match your search." : "No friends found."}
        </p>
      )}
    </div>
  )
}
