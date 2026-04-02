"use client"

import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"
import { AnimatePresence, motion as m } from "motion/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

interface CommandPaletteProps {
  friends?: { steamid: string; name: string }[]
}

interface CommandItem {
  id: string
  label: string
  section: string
  action: () => void
  shortcut?: string
}

export function CommandPalette({ friends = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const commands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      {
        id: "nav-dashboard",
        label: "Go to Dashboard",
        section: "Navigation",
        action: () => router.push("/dashboard"),
        shortcut: "g d",
      },
      {
        id: "nav-stats",
        label: "Go to Stats",
        section: "Navigation",
        action: () => router.push("/stats"),
        shortcut: "g s",
      },
      {
        id: "nav-quiz",
        label: "Go to Quiz",
        section: "Navigation",
        action: () => router.push("/quiz"),
        shortcut: "g q",
      },
    ]

    for (const friend of friends) {
      items.push({
        id: `friend-${friend.steamid}`,
        label: `Compare with ${friend.name}`,
        section: "Friends",
        action: () => router.push(`/stats?friends=${friend.steamid}`),
      })
    }

    return items
  }, [friends, router])

  const filtered = useMemo(() => {
    if (!query) return commands
    const q = query.toLowerCase()
    return commands.filter((c) => c.label.toLowerCase().includes(q))
  }, [commands, query])

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery)
    setSelectedIdx(0)
  }, [])

  const executeSelected = useCallback(() => {
    const item = filtered[selectedIdx]
    if (item) {
      item.action()
      setOpen(false)
      setQuery("")
    }
  }, [filtered, selectedIdx])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useKeyboardShortcuts({
    onOpenPalette: () => setOpen(true),
    onShowHelp: () => setShowHelp(true),
    onNavigate: (path) => router.push(path),
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      executeSelected()
    } else if (e.key === "Escape") {
      setOpen(false)
      setQuery("")
    }
  }

  return (
    <>
      {/* Command Palette */}
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[90] flex items-start justify-center pt-[20vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                setOpen(false)
                setQuery("")
              }}
            />
            <m.div
              className="relative z-10 w-full max-w-md overflow-hidden rounded-lg border bg-card shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center gap-2 border-b px-3">
                <Search className="size-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent py-3 text-sm outline-none"
                />
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  esc
                </kbd>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-1">
                {filtered.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No results found
                  </p>
                )}
                {filtered.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.action()
                      setOpen(false)
                      setQuery("")
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm",
                      i === selectedIdx
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Help overlay */}
      <AnimatePresence>
        {showHelp && (
          <m.div
            className="fixed inset-0 z-[90] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowHelp(false)}
            />
            <m.div
              className="relative z-10 w-full max-w-sm rounded-lg border bg-card p-6 shadow-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Keyboard Shortcuts</h3>
                <button onClick={() => setShowHelp(false)}>
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                {[
                  ["Ctrl+K or /", "Command palette"],
                  ["g d", "Go to Dashboard"],
                  ["g s", "Go to Stats"],
                  ["g q", "Go to Quiz"],
                  ["d", "Toggle theme"],
                  ["?", "Show this help"],
                ].map(([key, desc]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{desc}</span>
                    <kbd className="rounded bg-muted px-2 py-0.5 text-xs">
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
