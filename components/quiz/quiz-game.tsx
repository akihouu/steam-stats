"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  generateQuizQuestions,
  type QuizQuestion,
} from "@/lib/quiz"
import type { CS2PlayerStats, SteamPlayer } from "@/lib/steam-types"
import { cn } from "@/lib/utils"
import { motion as m, AnimatePresence } from "motion/react"
import {
  Check,
  Clock,
  RotateCcw,
  Trophy,
  X,
  Zap,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

interface QuizGameProps {
  players: { profile: SteamPlayer; stats: CS2PlayerStats }[]
}

type GameState = "playing" | "answered" | "finished"

export function QuizGame({ players }: QuizGameProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    generateQuizQuestions(players)
  )
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState>("playing")
  const [timeLeft, setTimeLeft] = useState(10)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const question = questions[currentIdx]

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleAnswer = useCallback(
    (id: string) => {
      if (gameState !== "playing") return
      clearTimer()
      setSelectedId(id)
      setGameState("answered")

      const correct = id === question.correctId
      if (correct) {
        const streakBonus = streak >= 2 ? 1 : 0
        setScore((s) => s + 1 + streakBonus)
        setStreak((s) => {
          const next = s + 1
          setBestStreak((b) => Math.max(b, next))
          return next
        })
      } else {
        setStreak(0)
      }
    },
    [gameState, question, streak, clearTimer]
  )

  const handleTimeout = useCallback(() => {
    clearTimer()
    setSelectedId(null)
    setGameState("answered")
    setStreak(0)
  }, [clearTimer])

  const nextQuestion = useCallback(() => {
    if (currentIdx >= questions.length - 1) {
      setGameState("finished")
      return
    }
    setCurrentIdx((i) => i + 1)
    setSelectedId(null)
    setGameState("playing")
    setTimeLeft(10)
  }, [currentIdx, questions.length])

  const restart = useCallback(() => {
    setQuestions(generateQuizQuestions(players))
    setCurrentIdx(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setSelectedId(null)
    setGameState("playing")
    setTimeLeft(10)
  }, [players])

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return
    // Reset handled by restart/nextQuestion via state
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleTimeout()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return clearTimer
  }, [gameState, currentIdx, handleTimeout, clearTimer])

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Trophy className="text-muted-foreground size-10" />
        <p className="text-muted-foreground text-sm">
          Need at least 2 players with CS2 stats to play the quiz.
        </p>
      </div>
    )
  }

  if (gameState === "finished") {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-12"
      >
        <Trophy
          className={cn(
            "size-16",
            pct >= 80
              ? "text-amber-500"
              : pct >= 50
                ? "text-zinc-400"
                : "text-muted-foreground"
          )}
        />
        <h2 className="text-3xl font-bold">
          {score}/{questions.length}
        </h2>
        <p className="text-muted-foreground">
          {pct >= 80
            ? "You really know your friends!"
            : pct >= 50
              ? "Not bad! Try again to improve."
              : "Time to study up on your squad!"}
        </p>
        {bestStreak >= 2 && (
          <div className="flex items-center gap-1.5 text-sm text-amber-500">
            <Zap className="size-4" />
            Best streak: {bestStreak}
          </div>
        )}
        <Button onClick={restart} className="gap-2">
          <RotateCcw className="size-4" />
          Play Again
        </Button>
      </m.div>
    )
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Question {currentIdx + 1}/{questions.length}
        </span>
        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <span className="flex items-center gap-1 text-amber-500">
              <Zap className="size-3.5" />
              {streak}x
            </span>
          )}
          <span className="font-semibold">Score: {score}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
        <m.div
          className={cn(
            "h-full rounded-full",
            timeLeft <= 3 ? "bg-red-500" : "bg-primary"
          )}
          animate={{ width: `${(timeLeft / 10) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <m.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">
                  {question.question}
                </h3>
                <div
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                    timeLeft <= 3
                      ? "bg-red-500/10 text-red-500"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Clock className="size-3" />
                  {timeLeft}s
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {question.options.map((option) => {
                  const isCorrect =
                    option.steamid === question.correctId
                  const isSelected = option.steamid === selectedId
                  const showResult = gameState === "answered"

                  return (
                    <button
                      key={option.steamid}
                      onClick={() => handleAnswer(option.steamid)}
                      disabled={gameState !== "playing"}
                      className={cn(
                        "rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all",
                        !showResult &&
                          "hover:border-primary hover:bg-primary/5",
                        showResult &&
                          isCorrect &&
                          "border-emerald-500 bg-emerald-500/10 text-emerald-500",
                        showResult &&
                          isSelected &&
                          !isCorrect &&
                          "border-red-500 bg-red-500/10 text-red-500",
                        showResult &&
                          !isCorrect &&
                          !isSelected &&
                          "opacity-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.name}</span>
                        {showResult && isCorrect && (
                          <Check className="size-4" />
                        )}
                        {showResult &&
                          isSelected &&
                          !isCorrect && (
                            <X className="size-4" />
                          )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Hint after answering */}
              {gameState === "answered" && (
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <p className="text-muted-foreground text-sm">
                    {question.hint}
                  </p>
                  <Button size="sm" onClick={nextQuestion}>
                    {currentIdx >= questions.length - 1
                      ? "See Results"
                      : "Next"}
                  </Button>
                </m.div>
              )}
            </CardContent>
          </Card>
        </m.div>
      </AnimatePresence>
    </div>
  )
}
