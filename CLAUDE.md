# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start dev server (Turbopack)
bun run build    # Production build
bun run lint     # ESLint (core-web-vitals + typescript configs)
bun run typecheck # TypeScript type checking (tsc --noEmit)
bun run format   # Prettier formatting for .ts/.tsx files
```

## Tech Stack

- **Next.js 16** (App Router) with React 19 and TypeScript
- **Tailwind CSS v4** (configured via PostCSS, styles in `app/globals.css`)
- **shadcn/ui** (radix-nova style, taupe base color, lucide icons) — add components with `npx shadcn@latest add <component>`
- **Zustand** for client state management
- **Motion** (Framer Motion) for animations
- **next-themes** for dark/light mode (toggle with `d` key)
- **Bun** as package manager

## Code Conventions

- Path alias: `@/*` maps to project root
- No semicolons, double quotes, 2-space indent, trailing commas (es5), 80 char line width
- Use `cn()` from `@/lib/utils` for conditional class merging (clsx + tailwind-merge)
- shadcn components go in `components/ui/`, custom components in `components/`
- Hooks go in `hooks/`
- Server Components by default; only add `"use client"` when needed

## Architecture

Steam Stats is a dashboard that displays game statistics for Steam users (CS2, Dota 2, TF2). Users authenticate via Steam OpenID, then view their stats with friend comparisons.

### Auth & Sessions

- **Steam OpenID** flow: `/api/auth/steam/login` → Steam → `/api/auth/steam/callback` → JWT session cookie
- **JWT sessions** via `jose` in `lib/session.ts` (HS256, 7-day expiry, `SESSION_SECRET` env var)
- **Route group `(auth)/`** protects all authenticated pages — its layout checks `getSession()` and redirects to `/` if missing

### Data Flow

- `lib/steam.ts` — server-only Steam Web API client with `steamFetch()` helper (uses `next.revalidate` for caching)
- `lib/cs2.ts`, `lib/tf2.ts`, `lib/dota2.ts` — parse raw Steam stats into typed stat objects (`CS2PlayerStats`, `TF2PlayerStats`, `Dota2PlayerStats`)
- `lib/games.ts` — game registry (`GAME_CONFIGS`) mapping `GameId` → metadata and feature flags
- `lib/steam-types.ts` — all shared types and app ID constants (`CS2_APP_ID=730`, `DOTA2_APP_ID=570`, `TF2_APP_ID=440`)

### Key Pages

- `/` — landing page (unauthenticated)
- `/dashboard` — user overview
- `/stats?game=cs2&friends=id1,id2` — game stats with friend comparison (defaults to CS2)
- `/quiz` — game knowledge quiz
- `/api/og/[steamid]` — dynamic OG image generation

### Environment Variables

Required: `STEAM_API_KEY`, `SESSION_SECRET`, `NEXT_PUBLIC_BASE_URL` (see `lib/env.ts`)
