"use client"

import { useEffect, useRef, useCallback } from "react"

interface KeyboardShortcuts {
  onToggleTheme?: () => void
  onOpenPalette?: () => void
  onShowHelp?: () => void
  onNavigate?: (path: string) => void
}

export function useKeyboardShortcuts({
  onToggleTheme,
  onOpenPalette,
  onShowHelp,
  onNavigate,
}: KeyboardShortcuts) {
  const pendingChord = useRef<string | null>(null)
  const chordTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearChord = useCallback(() => {
    pendingChord.current = null
    if (chordTimer.current) {
      clearTimeout(chordTimer.current)
      chordTimer.current = null
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable

      if (isInput) return

      // Ctrl+K or / for command palette
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && !e.shiftKey)
      ) {
        e.preventDefault()
        onOpenPalette?.()
        clearChord()
        return
      }

      // ? for help
      if (e.key === "?" && e.shiftKey) {
        e.preventDefault()
        onShowHelp?.()
        clearChord()
        return
      }

      // d for theme toggle (no modifiers)
      if (e.key === "d" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Don't interfere with existing theme toggle if it exists
        // The existing app already handles 'd' for theme
        clearChord()
        return
      }

      // Chord: g + key
      if (pendingChord.current === "g") {
        clearChord()
        if (e.key === "d") {
          e.preventDefault()
          onNavigate?.("/dashboard")
        } else if (e.key === "s") {
          e.preventDefault()
          onNavigate?.("/stats")
        } else if (e.key === "q") {
          e.preventDefault()
          onNavigate?.("/quiz")
        }
        return
      }

      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        pendingChord.current = "g"
        chordTimer.current = setTimeout(clearChord, 500)
        return
      }
    }

    window.addEventListener("keydown", handler)
    return () => {
      window.removeEventListener("keydown", handler)
      clearChord()
    }
  }, [onToggleTheme, onOpenPalette, onShowHelp, onNavigate, clearChord])
}
