"use client"

import { FriendCard } from "@/components/friend-card"
import { useComparisonStore } from "@/hooks/use-comparison-store"
import { staggerContainer, fadeIn } from "@/lib/motion"
import type { SteamPlayer } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { motion as m, AnimatePresence } from "motion/react"
import { useState } from "react"

interface ActivityGroupProps {
  label: string
  friends: SteamPlayer[]
  accent?: string
  defaultExpanded?: boolean
}

export function ActivityGroup({
  label,
  friends,
  accent,
  defaultExpanded = true,
}: ActivityGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const { selectedFriendIds, toggleFriend } = useComparisonStore()

  if (friends.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-2 flex w-full items-center gap-2"
      >
        <ChevronDown
          className={cn(
            "text-muted-foreground size-4 transition-transform",
            !expanded && "-rotate-90"
          )}
        />
        <span
          className={cn(
            "text-sm font-medium",
            accent ?? "text-foreground"
          )}
        >
          {label}
        </span>
        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
          {friends.length}
        </span>
      </button>
      <AnimatePresence>
        {expanded && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <m.div
              className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {friends.map((friend) => (
                <m.div key={friend.steamid} variants={fadeIn}>
                  <FriendCard
                    player={friend}
                    selected={selectedFriendIds.includes(
                      friend.steamid
                    )}
                    onToggle={() => toggleFriend(friend.steamid)}
                  />
                </m.div>
              ))}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
