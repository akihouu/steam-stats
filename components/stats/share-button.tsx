"use client"

import { Check, Share2 } from "lucide-react"
import { useState } from "react"

interface ShareButtonProps {
  steamId: string
}

export function ShareButton({ steamId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/api/og/${steamId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My CS2 Stats",
          text: "Check out my CS2 stats!",
          url,
        })
        return
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
    >
      {copied ? (
        <>
          <Check className="size-3.5" />
          <span className="hidden sm:inline">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="size-3.5" />
          <span className="hidden sm:inline">Share</span>
        </>
      )}
    </button>
  )
}
