# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start Next.js dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, Next.js core-web-vitals + typescript)

# Battle server (separate process, runs on port 3001)
cd server && npm start
```

There are no tests configured in this project.

## Architecture

This is a Korean-language quiz app ("상식왕 퀴즈") built with **Next.js 16** (App Router) + a separate **Socket.IO battle server**.

### Two-process system
- **Next.js frontend** (`src/`): Quiz UI, results, Google AdSense integration
- **Socket.IO server** (`server/index.js`): Express + Socket.IO for real-time multiplayer quiz battles. Standalone Node.js process with its own `package.json`. Connect URL is configured via `NEXT_PUBLIC_SOCKET_URL` env var (defaults to `http://localhost:3001`).

### Route structure (`src/app/`)
| Route | Rendering | Purpose |
|-------|-----------|---------|
| `/` (page.tsx) | Server component | Home: category grid, daily quiz link, battle link, SEO content |
| `/quiz` | Client (`"use client"`) | Solo quiz player. Query params: `mode=daily\|category`, `category=<id>` |
| `/result` | Client | Score display, wrong-answer review, share. Reads answers from `sessionStorage` |
| `/battle` | Client | Full multiplayer flow: lobby, room creation/joining, gameplay, rankings |

### Data layer (`src/data/`)
- `quizData.ts`: Central registry — exports `categories` array and `quizzes` record (category ID -> Quiz[])
- `categories/*.ts`: Each file exports 100 Quiz objects for one category (10 categories, ~1000 total questions)
- `quotes.ts`: 365 daily quotes indexed by month/day
- Quiz shape: `{ question, options: string[], answer: number, hint, explanation? }`

### Client utilities (`src/utils/`)
- `socket.ts`: Singleton Socket.IO client (lazy-init, manual connect/disconnect)
- `storage.ts`: localStorage wrapper for per-category high scores and daily quiz completion status

### Components (`src/components/`)
- `AdBanner.tsx`: Google AdSense ad unit wrapper (client component)
- `HomeClient.tsx`: Displays play stats from localStorage (client component)
- `DailyQuote.tsx`: Shows today's quote by date index (client component)

### Styling
- Tailwind CSS v4 with `@theme inline` block in `globals.css`
- Dark theme with CSS custom properties (`--bg-primary: #1a1a2e`, `--accent: #ffd700`, etc.)
- Mobile-first, max-width `max-w-lg` layout throughout
- Path alias: `@/*` maps to `./src/*`

### Battle server protocol (Socket.IO events)
- Client -> Server: `join-lobby`, `leave-lobby`, `create-room`, `join-room`, `start-game`, `submit-answer`
- Server -> Client: `room-list`, `room-update`, `game-start`, `next-question`, `score-update`, `question-result`, `game-end`
- Scoring: 10 points correct, 5 points if hint was used, 0 for wrong. 15-second timer per question.
