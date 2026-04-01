import { Button } from "@/components/ui/button"
import { Crosshair } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <Crosshair className="size-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">404</h1>
      <p className="text-sm text-muted-foreground">
        This page doesn&apos;t exist.
      </p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
