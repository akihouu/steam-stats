"use client"

import { Button } from "@/components/ui/button"
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/motion"
import { Crosshair, Gamepad2, Trophy, Users } from "lucide-react"
import { motion as m } from "motion/react"

const features = [
  {
    icon: Users,
    title: "Friend Insights",
    description: "See how your friends stack up across CS2",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Rank your friend group by kills, K/D, wins, and more",
  },
  {
    icon: Crosshair,
    title: "Weapon Stats",
    description: "Discover everyone's favorite weapons and playstyles",
  },
  {
    icon: Gamepad2,
    title: "Fun Facts",
    description: "Uncover surprising stats you never knew about",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4">
      <m.div
        className="flex max-w-2xl flex-col items-center gap-8 text-center"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <m.div variants={fadeIn} className="flex flex-col items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-full p-3">
            <Crosshair className="size-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Steam Stats
          </h1>
          <p className="text-muted-foreground max-w-md text-lg">
            Log in with Steam and discover fun stats about you and your
            friends in Counter-Strike 2.
          </p>
        </m.div>

        <m.div variants={fadeIn}>
          <Button size="lg" className="gap-2 text-base" asChild>
            <a href="/api/auth/steam/login">
              <SteamIcon className="size-5" />
              Sign in with Steam
            </a>
          </Button>
        </m.div>

        <m.div
          variants={fadeInUp}
          className="mt-4 grid w-full max-w-lg grid-cols-2 gap-4"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-lg border p-4 text-left"
            >
              <feature.icon className="text-muted-foreground mb-2 size-5" />
              <p className="text-sm font-medium">{feature.title}</p>
              <p className="text-muted-foreground text-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </m.div>

        <m.p variants={fadeIn} className="text-muted-foreground text-xs">
          Your Steam data is only used during your session. Nothing is stored.
        </m.p>
      </m.div>
    </div>
  )
}

function SteamIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658a3.387 3.387 0 0 1 1.912-.59c.064 0 .128.002.191.006l2.861-4.142V8.91a4.528 4.528 0 0 1 4.524-4.524 4.528 4.528 0 0 1 4.524 4.524 4.528 4.528 0 0 1-4.524 4.524h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396a3.404 3.404 0 0 1-3.362-2.88L.309 15.062C1.747 20.15 6.419 24 11.979 24 18.627 24 24 18.627 24 11.979 24 5.373 18.627 0 11.979 0z" />
    </svg>
  )
}
