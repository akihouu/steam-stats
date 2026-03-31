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

This is an early-stage Next.js app scaffolded from the shadcn/ui template. The app uses the App Router with a single root layout that sets up fonts (Manrope sans + Geist Mono) and wraps everything in a ThemeProvider for dark/light mode support.
