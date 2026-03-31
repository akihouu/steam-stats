"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <AlertCircle className="text-destructive size-10" />
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground max-w-sm text-center text-sm">
        Failed to load your dashboard. The Steam API might be temporarily
        unavailable.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
