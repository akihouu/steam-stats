"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function StatsError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <AlertCircle className="size-10 text-destructive" />
      <h2 className="text-lg font-semibold">Failed to load stats</h2>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        Could not fetch CS2 stats. Make sure your profile and game details are
        set to public.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
