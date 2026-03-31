"use client"

import { Card, CardContent } from "@/components/ui/card"
import { staggerContainer, fadeIn } from "@/lib/motion"
import type { FunFact } from "@/lib/cs2"
import { motion as m } from "motion/react"

interface FunFactsProps {
  facts: FunFact[]
}

export function FunFacts({ facts }: FunFactsProps) {
  if (facts.length === 0) return null

  return (
    <m.div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {facts.map((fact, i) => (
        <m.div key={i} variants={fadeIn}>
          <Card>
            <CardContent className="flex items-start gap-3 p-4">
              <span className="text-xl">{fact.emoji}</span>
              <p className="text-sm">{fact.text}</p>
            </CardContent>
          </Card>
        </m.div>
      ))}
    </m.div>
  )
}
