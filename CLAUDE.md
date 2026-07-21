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
- **Next.js frontend** (`src/`): Quiz UI, results, Google AdSense integration. Deployed on Vercel.
- **Socket.IO server** (`server/index.js`): Express + Socket.IO for real-time multiplayer quiz battles. Standalone Node.js process with its own `package.json`, port via `PORT` env var (default 3001). Client connect URL comes from `NEXT_PUBLIC_SOCKET_URL` (defaults to `http://localhost:3001`).

### Route structure (`src/app/`)
| Route | Rendering | Purpose |
|-------|-----------|---------|
| `/` (page.tsx) | Server component | Home: category grid, daily quiz link, battle link, SEO content |
| `/quiz` | Client (`"use client"`) | Solo quiz player. Query params: `mode=daily\|category`, `category=<id>` |
| `/result` | Client | Score display, wrong-answer review, share |
| `/battle` | Client | Full multiplayer flow in one file: lobby, room creation/joining, gameplay, rankings |
| `/calculators` | Server | Hub for 11 life calculators (salary, severance, electricity, exchange, BMI, ...) |
| `/calculators/<id>` | Server layout + client page | Each calculator: `layout.tsx` renders metadata + `CalcShell` (server-rendered SEO text + ads) around a `"use client"` calculator page |
| `/privacy`, `/terms` | Server | Static policy pages (AdSense requirement), plus `sitemap.ts` |

### Data layer (`src/data/`)
- `quizData.ts`: Central registry — exports `categories` array and `quizzes` record (category ID -> Quiz[]). To add a category: create `categories/<id>.ts`, then register in both exports here.
- `categories/*.ts`: Each file exports 100 Quiz objects for one category (10 categories, ~1000 total questions)
- `quotes.ts`: 365 daily quotes indexed by month/day
- Quiz shape: `{ question, options: string[], answer: number, hint, explanation? }` — `answer` is an index into `options`
- `calculators.ts`: Registry for `/calculators` — card info, per-page metadata, and SEO text all come from here; `sitemap.ts` also iterates it. To add a calculator: add an entry here, create `app/calculators/<id>/layout.tsx` (metadata + `CalcShell`) and `page.tsx` (client UI using `components/calculators/ui.tsx` primitives). Korean tax/utility rates are constants at the top of each calculator page (or `utils/electricity.ts`, shared by electricity + aircon) — update there when official rates change.

### Solo quiz flow
- Client picks 10 random questions (shuffle + `slice(0, 10)`). `mode=daily` pools ALL categories; `mode=category` uses one category. 15-second timer per question.
- Results are handed to `/result` via query params (score/correct/total) plus the full answer list in `sessionStorage` key `quiz_answers`.
- `src/utils/storage.ts` persists per-category high scores (`quiz_king_scores`) and daily completion (`quiz_king_daily`) in localStorage.

### Battle system
**The server holds no quiz data.** The host client selects 10 random questions from `src/data` and sends them in the `start-game` payload; the server just relays questions, validates answers against `quiz.answer`, and keeps score. Changing quiz content never requires touching the server.

- Client -> Server events: `join-lobby`, `leave-lobby`, `create-room`, `join-room`, `start-game`, `submit-answer`
- Server -> Client events: `room-list`, `room-update`, `game-start`, `next-question`, `score-update`, `question-result`, `game-end`
- Scoring: 10 points correct, 5 points if hint was used, 0 for wrong. Client shows a 15s timer; the server force-advances at 16s (1s grace), then shows results for 2.5s before the next question.
- Rooms live in an in-memory `Map` (lost on restart): 6-char codes (no 0/O/1/I), max 10 players, nicknames must be unique across ALL rooms. Host disconnect promotes the next player; empty rooms are deleted. After `game-end` the room returns to `waiting` so the same group can rematch.
- `src/utils/socket.ts` is a lazy-init singleton with `autoConnect: false` — callers must `connect()`/`disconnectSocket()` manually.
- Server health endpoints: `GET /` (status + room count), `GET /rooms` (waiting-room list).

### Styling
- Tailwind CSS v4 with `@theme inline` block in `globals.css`
- Dark theme with CSS custom properties (`--bg-primary: #1a1a2e`, `--accent: #ffd700`, etc.)
- Mobile-first, max-width `max-w-lg` layout throughout
- Path alias: `@/*` maps to `./src/*`

### AdSense
The AdSense script loads globally in `src/app/layout.tsx` (client ID hardcoded there); `src/components/AdBanner.tsx` renders individual ad units. Policy pages and server-rendered SEO content on `/` exist to satisfy AdSense review — keep meaningful server-rendered text on public pages.
