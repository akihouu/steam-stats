"use client"

import { Card, CardContent } from "@/components/ui/card"
import { scaleIn } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { useMotionValue, useSpring, useTransform } from "motion/react"
import { motion as m } from "motion/react"
import { useEffect } from "react"

interface StatCardProps {
  label: string
  value: number
  format?: (n: number) => string
  icon: LucideIcon
  highlight?: boolean
  subtitle?: string
}

export function StatCard({
  label,
  value,
  format = (n) => n.toLocaleString(),
  icon: Icon,
  highlight,
  subtitle,
}: StatCardProps) {
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 50, damping: 20 })
  const display = useTransform(spring, (v) => format(Math.round(v)))

  useEffect(() => {
    motionValue.set(value)
  }, [motionValue, value])

  return (
    <m.div variants={scaleIn} initial="initial" animate="animate">
      <Card
        className={cn(
          highlight && "border-primary/50 bg-primary/5"
        )}
      >
        <CardContent className="flex items-start gap-3 p-4">
          <div
            className={cn(
              "rounded-md p-2",
              highlight
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="size-4" />
          </div>
          <div className="flex flex-col">
            <m.span className="text-2xl font-bold tabular-nums">
              {display}
            </m.span>
            <span className="text-muted-foreground text-sm">{label}</span>
            {subtitle && (
              <span className="text-muted-foreground text-xs">
                {subtitle}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </m.div>
  )
}
