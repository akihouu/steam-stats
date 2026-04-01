"use client"

import { generateWrappedSlides, type WrappedSlide } from "@/lib/wrapped"
import type { CS2PlayerStats } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion as m } from "motion/react"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface WrappedOverlayProps {
  userStats: CS2PlayerStats
  friendStats: CS2PlayerStats[]
  userName: string
  onClose: () => void
}

function SlideContent({ slide }: { slide: WrappedSlide }) {
  if (slide.type === "intro") {
    return (
      <div className="flex flex-col items-center gap-6">
        <m.h1
          className="text-4xl font-bold sm:text-5xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {slide.title}
        </m.h1>
        <m.p
          className="text-lg text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {slide.subtitle}
        </m.p>
      </div>
    )
  }

  if (slide.type === "superlative") {
    return (
      <div className="flex flex-col items-center gap-4">
        <m.p
          className="text-lg text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          You are...
        </m.p>
        <m.h2
          className="text-5xl font-bold sm:text-6xl"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
        >
          {slide.title}
        </m.h2>
        <m.p
          className="text-xl text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {slide.subtitle}
        </m.p>
      </div>
    )
  }

  if (slide.type === "summary") {
    return (
      <div className="flex flex-col items-center gap-6">
        <m.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {slide.title}
        </m.h2>
        <m.p
          className="max-w-md text-center text-lg text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {slide.subtitle}
        </m.p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <m.p
        className="text-lg text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {slide.title}
      </m.p>
      <m.h2
        className="text-6xl font-bold tabular-nums sm:text-7xl"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
      >
        {slide.value}
      </m.h2>
      <m.p
        className="text-xl text-white/70"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {slide.subtitle}
      </m.p>
    </div>
  )
}

export function WrappedOverlay({
  userStats,
  friendStats,
  userName,
  onClose,
}: WrappedOverlayProps) {
  const slides = generateWrappedSlides(userStats, friendStats, userName)
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    if (current < slides.length - 1) setCurrent((c) => c + 1)
  }, [current, slides.length])

  const prev = useCallback(() => {
    if (current > 0) setCurrent((c) => c - 1)
  }, [current])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [next, prev, onClose])

  const slide = slides[current]

  return (
    <m.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-all duration-700",
          slide.color
        )}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <X className="size-5" />
      </button>

      {/* Navigation arrows */}
      {current > 0 && (
        <button
          onClick={prev}
          className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}
      {current < slides.length - 1 && (
        <button
          onClick={next}
          className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      {/* Slide content */}
      <div className="relative z-10 px-8 text-white" onClick={next}>
        <AnimatePresence mode="wait">
          <m.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <SlideContent slide={slide} />
          </m.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "size-2 rounded-full transition-all",
              i === current ? "w-6 bg-white" : "bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>

      {/* Tap hint */}
      {current === 0 && (
        <m.p
          className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 text-xs text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Tap or use arrow keys to navigate
        </m.p>
      )}
    </m.div>
  )
}
