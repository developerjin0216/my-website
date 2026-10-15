# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Next.js dev server (localhost:3000)
npm run build    # Production build — also runs the escape-story validator (see below)
npm run lint     # ESLint flat config (next/core-web-vitals + typescript); server/** is excluded
npx tsc --noEmit # Type check

# Realtime server — separate Node process, port 3001 (PORT env)
cd server && npm start

# Integration tests (the only tests in the repo) — start the server first
node server/test/omok.test.js            # 17 assertions: rooms, turns, win, resign, rematch, leave
node server/test/omok-directions.test.js # vertical / both diagonals

# Data generators — never hand-edit their output files
node scripts/gen-prompts.mjs <workflow-output.json>       # → src/data/prompts.ts
node scripts/gen-viral-prompts.mjs <workflow-output.json> # → src/data/promptsViral.ts

# Push 사이트맵 URLs to IndexNow (Bing·Naver·Yandex; Google does NOT participate)
node scripts/indexnow.mjs --dry   # inspect targets
node scripts/indexnow.mjs         # submit — only after content actually changed

# Indexability audit — fetches every sitemap URL, reports blockers + body-text length
node scripts/seo-audit.mjs                        # production
node scripts/seo-audit.mjs http://localhost:3131  # a local `next start`

# CCTV tool end-to-end check against production (key in bundle → ITS → m3u8)
node scripts/cctv-check.mjs
```

Verifying host-dependent behaviour locally (sitemap, robots, legacy redirects):

```bash
npm run build && npx next start -p 3000
curl -H "Host: quiz.8282114.xyz" localhost:3000/mbti   # expect 308 → 8282114.xyz/mbti
```

## Architecture

Korean-language personal site on **Next.js 16** (App Router) + a standalone **Socket.IO** server.
**72 URLs are indexed; ~170 more stay live but noindexed** (see *Index scope* below).
Deployed on Vercel; realtime server on Render.

### Single domain — do not re-split

`8282114.xyz` serves everything. Subdomains were tried in 2026-07 (`quiz.` / `calc.` / `tools.`)
and **reverted in 2026-09**: search engines treat subdomains as separate sites, so a new domain
split four ways had each part starting trust from zero (index count stayed at 0 for five weeks).

- `src/lib/site.ts` hard-codes `QUIZ_URL = CALC_URL = TOOLS_URL = ROOT_URL`. It deliberately does
  **not** read `NEXT_PUBLIC_*_URL` env vars, so stale Vercel values cannot resurrect the split.
  The `*_SPLIT` / `SPLIT_ACTIVE` constants derive from host comparison and are therefore all false.
- `src/proxy.ts` (Next 16 renamed middleware → proxy) now only 308s legacy hosts
  (`quiz.` / `calc.` / `tools.` / `www.`) to the root, mapping each subdomain root to its section
  home (`quiz.→/quiz-home`, `calc.→/calculators`, `tools.→/tools`).
- **Keep the subdomains attached to the Vercel project** — detaching them kills the redirects.
- Re-splitting means restoring the env reads in `site.ts`; canonical/OG/sitemap/RSS/proxy all key
  off those constants and follow automatically. The `SPLIT_ACTIVE` branches left in
  `sitemap.xml/route.ts`, `robots.txt/route.ts`, and `proxy.ts` exist for exactly that.

### Index scope — one topic, set in `src/lib/indexPolicy.ts`

In 2026-10, nine weeks after the domain was registered, Search Console showed **1 of 243**
sitemap URLs indexed and 2 impressions in 28 days. No manual action; the rest were *crawled — not
indexed*, i.e. Google read them and declined. Technical checks were clean (Googlebot gets 200,
robots allows all, Wayback shows no prior owner of the domain). The site *called* itself
"급할 때 생활 긴급 안내" while three quarters of its URLs were quiz banks, MBTI, memes, AI prompts
and English slang. Google weighs quality site-wide, so the off-topic bulk dragged the rest.

The fix was to narrow, not to start over on a new domain (that resets trust to zero, which is
exactly what the subdomain split proved, and costs money). Only what the domain name promises —
8282 빨리빨리 + 114 안내 — stays indexed: `/help`, `/guides`, `/calculators` (minus BMI/칼로리),
`/en` emergency guides, `/tools/cctv`, and the about/legal pages.

- `indexPolicy.ts` is the **single source**: sitemap and RSS filter through `isIndexableUrl`;
  section layouts and the calc/tool metadata builders set `robots: robotsFor(path)`. Reverting a
  section means deleting one line there — sitemap, feed and meta all follow.
- Noindexed pages still render, still self-canonicalize, and use `follow`. They are not deleted
  and the home footer still links to them, so existing users can reach them.
- Do **not** `Disallow` them in robots.txt — Google would then never see the noindex.
- **A new page must fit the topic, or go into `NOINDEX_SECTIONS`.** Adding unrelated sections to
  the index is how the site got here.
- The verification used: fetch every URL from the *old* sitemap on a local `next start` and
  compare its `<meta name="robots">` with `isIndexable()` (Node 22 can import the `.ts` with
  `--experimental-strip-types`). `seo-audit.mjs` covers the other direction — it audits the
  sitemap, so a kept page that accidentally goes noindex shows up as a blocker.

### Content sections

Indexed sections first; the rest are live but noindexed.

| Path | Indexed | Data source | Notes |
|---|---|---|---|
| `/help`, `/help/<id>` | yes | `data/help.ts` | 긴급 대처 가이드, the core of the site. Richest E-E-A-T template. The hub groups topics by situation and **throws at build** if a topic is unassigned, duplicated, or unknown |
| `/guides/<id>` | yes | `data/guides.ts` | Long-form; must stay in sync with calculator rates |
| `/calculators/<id>` | yes, except `bmi`·`calorie` | `data/calculators.ts` | Server layout + client page |
| `/en`, `/en/<id>` | yes | `data/guidesEn.ts` | English emergency guides for foreigners in Korea |
| `/tools/cctv` | yes | `data/cctvRegions.ts` | **The only feature with an external dependency.** Browser calls ITS directly — see below |
| `/en/slang/<id>` | no | `slangEn.ts` | 53 per-item pages — the pattern that already failed for memes |
| `/quiz-bank/<cat>/<page>` | no | `lib/quizBank.ts` over `data/categories/` | Paginated Q&A archive |
| `/quiz`, `/quiz/<cat>`, `/quiz-home` | no | `data/quizData.ts` | 11 categories, 1,168 questions (맞춤법 has 168, the rest 100) |
| `/mbti/<type>`, `/mbti/test` | no | `data/mbti.ts` | |
| `/tools/<id>` | no | `data/tools.ts` | Browser-only utilities (no upload) |
| `/prompts/<cat>`, `/prompts/viral/<cat>` | no | `data/prompts.ts`, `promptsViral.ts` | 37 original + 41 sourced |
| `/meme/<category>` | no | `data/memes.ts`, `memeUsage.ts` | |
| `/escape`, `/omok`, `/battle` | no | `data/escape.ts` / — | Games; omok and battle need the Socket.IO server |

### Body-text length is the live indexing constraint

A 2026-10 sweep of all 236 live URLs found **zero** technical blockers (all 200, self-canonical,
no noindex, no stray `X-Robots-Tag`) and 55 pages under 1,800 chars of *visible* text. The five
thinnest were hubs, which starves everything beneath them. Measure with `scripts/seo-audit.mjs`,
never by eye: `/quiz` shipped 22 KB of HTML that reduced to **464 characters** a human can read —
the rest was Tailwind class strings and the RSC payload.

Rough bands from this site: `<1000` won't be indexed, `1000–1799` is at risk, `≥3000` is safe.
Client-only routes (`/quiz`, `/omok`, `/battle`, `/mbti/test`) render nothing for crawlers, so
their `layout.tsx` must carry the server-rendered prose — that is the whole reason those layouts
exist. Every page needs an `<h1>`; `/quiz` had none because its body is a client component.

`/tools/*` (except CCTV) is noindexed now, so padding it is moot — they compete with
single-purpose domains (ilovepdf, TinyPNG) anyway. Don't delete them; they still serve users.

Shared layout prose is duplicated across every child route. `app/quiz/layout.tsx` wraps `/quiz`
**and** all 11 `/quiz/<cat>` pages, so a long block there ships 12 identical copies and gives each
category page a poor unique-content ratio. Put page-specific prose in the page (make it a server
component wrapping a `"use client"` child, as `/quiz` does with `QuizClient.tsx`) and keep only
genuinely shared navigation in the layout. Same reason the layout must not carry an `<h1>` when
children have their own.

### Never pad a page with unverified claims

Adding length to calculator/guide pages means writing about Korean tax, labour and welfare law.
Two 2026-10 content passes were adversarially verified before being applied, and the verifier
rejected **51 of 196** calculator items and **14 of 16** guide sections. Among the rejects: telling
readers to *exclude* 식대·상여 from 최저임금 (backwards since 2024), a 다자녀 자동차세 감면 that
doesn't exist (it's 취득세), 근저당 설정비 billed to the borrower (banks have paid it since 2011),
and the 환율 100× error stated in the wrong direction.

Rules that follow from this:
- A number may only be written if it already exists in the repo. Cite the file and constant.
- Do **not** apply a reviewer's suggested fix for an out-of-repo legal claim — it is no better
  grounded than the text it replaces. Drop the item instead.
- Prefer angles that need no numbers: what the calculator excludes, which input people mis-enter,
  where the result legitimately differs from a payslip, who decides the real determination.
- Leaving a page thin is better than publishing a wrong rate. `/guides/pension-reform` and
  `/guides/minimum-wage-2027` were deliberately left short for this reason.

### The CCTV tool must call ITS from the browser, not the server

`/tools/cctv` is the one feature that depends on an outside API. It was built
server-side first (route handler holding the key) and **that does not work on Vercel**:

| where | result |
|---|---|
| `iad1` Washington, Node runtime | 8s timeout |
| `sin1` Singapore, Edge runtime | 8s timeout |
| a Korean machine | 2s, fine |

Singapore→Korea is ~70ms, so this is not latency. ITS appears to block datacenter IPs,
or the non-standard port (9443 — there is no standard-port endpoint) is the problem.
`preferredRegion` is ignored for Node functions (`x-vercel-id` read `icn1::iad1` — the
first segment is the CDN POP, the second is the actual function region); switching to Edge
moved it to `sin1`, not `icn1`. **Upgrading to Pro would not reliably fix this** — if the
cause is IP blocking, a Seoul datacenter IP is blocked too.

So the browser calls ITS directly. ITS echoes our origin in `Access-Control-Allow-Origin`
and allows the `GET` preflight. The key therefore ships in the public bundle as
`NEXT_PUBLIC_ITS_API_KEY` — **this is not a new leak**: decoding the `wmsAuthSign` token on
every stream URL reveals `id=<the key>`, and that URL has to reach the browser for playback.

Consequences to keep in mind:
- Changing the key requires a **redeploy**; `NEXT_PUBLIC_*` is baked at build time.
- Keep regions small. One combined 충청 region returned 3,700 cameras as 1.5 MB of XML —
  straight onto a phone. Eight regions keep each fetch manageable.
- Fetch 고속 and 국도 separately and render as each lands; waiting for both leaves large
  regions blank for seconds.
- Stream tokens last 120 minutes, so a page left open needs a refresh.

### Counts come from the data, never a typed number

`CALC_COUNT` (`data/calculators.ts`) and `helpTopics.length` exist because "계산기 19종" was
hardcoded in 10 places across 6 files while the real count was 20, and `/about` advertised 18 help
articles when there were 27. Any "N종 / N편" string must interpolate.

### Category documents, not per-item pages

Meme terms (95) once had one page each at ~540 chars; **none were indexed**. They were consolidated
into 7 category documents (3,000–6,500 chars each), with old term URLs 308ing to
`/meme/<category>#<term>`. `/prompts` follows the same shape from the start.

**Do not add a page per small item.** Group them into a category document and use anchors.
`meme/[id]/page.tsx` throws at module load if a term id ever collides with a category id.

### Build-time content validators

`src/lib/escapeValidate.ts` runs at module load of `/escape/page.tsx`, so a violation **fails
`npm run build`**. It enforces story structure that reviewers kept missing by eye:

- Clue planted before payoff; `Clue.payoffIn` ↔ `Scene.resolves` must agree both ways
- ≥4 clues resolved in the final scene; every clue planted by a `SceneObject`, not narration
- A puzzle's `needs` must already be available at that point in the story
- ≤40% standalone puzzles; the last three scenes must all require earlier rooms
- Prose floors: ≥3 objects/scene, ≥700 chars/scene, ≥60 chars per puzzle lead, ≥8,000 total

Changing escape content means re-running the build; the error message names every violation.

### Trust signals (`src/lib/trust.ts`)

Shared `Organization`/`WebSite` JSON-LD is injected in the root layout; page schemas reference it
by `@id`. `authorship(date)` supplies author/publisher/dateModified. `CALC_SOURCES` maps each
calculator to its real governing body, rendered as a "계산 근거·공식 출처" block.

**Dates are never invented** — `REVIEWED` holds the real last-changed date of each data file.
Update it whenever rates change.

### Rates and official figures

Korean rates live in shared utils so one edit updates calculator + example table + guide prose:
`utils/salary.ts` (4대보험·세율), `utils/electricity.ts` (전기요금), `utils/medianIncome.ts`
(기준 중위소득 2023–2026).

For welfare/tax numbers, **verify before publishing and record how**. `medianIncome.ts` carries its
cross-check in a comment (생계급여 32% back-calculated against a korea.kr figure). When only a
raise rate is announced but the per-household table is not, expose it as `PENDING_YEAR` and say so
on the page rather than multiplying an estimate — household sizes use different equivalence scales.

Calculators state inputs → outputs only. They must not render eligibility verdicts: real welfare
decisions use 소득인정액 (asset conversion, income deductions, 부양의무자), which this code cannot
compute, and a wrong "you don't qualify" makes people abandon valid claims.

### Realtime server (`server/`)

Own `package.json`, own deploy (Render free tier — **first connect after idle takes 20–60s**, so
clients need an explicit connecting state). Two independent games share one process with separate
room maps and event namespaces:

- Quiz battle (`index.js`): **server stores no quiz data**. The host client picks 10 questions from
  `src/data` and ships them in `start-game`; the server only relays, validates against
  `quiz.answer`, and scores (10 pts, 5 with hint). Client timer 15s, server force-advances at 16s.
- Omok (`omok.js`, `omok:` prefixed events): 15×15, free rule, win checked in four directions from
  the last stone. **The server rejects out-of-turn, occupied, and out-of-bounds moves** — never
  trust the client. Colors and first move swap each rematch to offset black's advantage.

Rooms are in-memory `Map`s (lost on restart), 6-char codes excluding `0/O/1/I`.
`src/utils/socket.ts` is a lazy singleton with `autoConnect: false`; callers connect/disconnect.

### Monetization state

- **AdSense is not approved.** Every `AdBanner` slot is the placeholder `"XXXXXXXXXX"` and the
  component returns `null`, so those slots render nothing. Only Coupang actually displays.
- Keep ad density low — one banner mid-document is the current rule on prompt pages. A
  placeholder/"준비 중" page is an explicit AdSense rejection reason (`/deals` was removed for this).
- Toss ShareLink was **rejected**: its API only offers best-selling/today-deals lists, and a
  persistent product list is exactly the commerce format they refuse. `lib/toss.ts` and
  `TossProducts` stay but render nothing without keys.
- Affiliate and prompt-copy clicks fire GA4 events via `utils/analytics.ts` and `CopyButton`
  (`affiliate_click`, `prompt_copy`, `prompt_open`). Coupang's iframe carousel cannot be tracked.

### SEO invariants

- Every indexable page needs a self-referencing canonical. The root layout sets
  `alternates: { canonical: "/" }`, so a new page that omits it silently claims the homepage URL.
  noindex pages must still self-canonicalize — pointing elsewhere can spread the noindex.
- Collapsible content must stay in the DOM (`hidden` attribute, not conditional rendering).
  `PromptCard` hides prompt bodies this way precisely because the prompt text *is* the content.
- Client-only pages (`/battle`, `/omok`) render almost nothing for crawlers; their `layout.tsx`
  carries server-rendered rules/FAQ so the route has indexable text.
- New sections must first pass *Index scope* above. Then they need: sitemap entry
  (`sitemap.xml/route.ts`), RSS item (`feed.xml/route.ts`), and
  **inbound internal links** — a page linked from one place is treated as unimportant.
- Section homes are `/quiz-home`, `/calculators`, `/tools` — **not** `QUIZ_URL`/`TOOLS_URL`, which
  both collapse to `ROOT_URL` now. Code written for the split emitted the bare host, which silently
  dropped `/tools` and `/quiz-home` from the sitemap and pointed footer links at the wrong home.
- Breadcrumb/`og:site_name`/title template for anything rooted at `/` must use `ROOT_SITE_NAME`,
  not `SITE_NAME` ("상식왕 퀴즈" is a *section* name). Until 2026-10 the root title template,
  root `og:site_name` and `CALC_SITE_NAME` all fell back to it, so calculator pages declared
  themselves part of a quiz site.
- The root layout hardcodes `<html lang="ko">` and only a root layout may render `<html>`. `/en`
  scopes its language with a `lang="en"` wrapper using `className="contents"`; reading `headers()`
  in the root layout to switch it would turn all 255 static pages dynamic.

### Styling

Tailwind v4 with `@theme inline` in `globals.css`; dark theme via CSS custom properties
(`--bg-primary: #1a1a2e`, `--accent: #ffd700`). Mobile-first, `max-w-lg` throughout.
Path alias `@/*` → `./src/*`. Calculator UI uses the primitives in
`components/calculators/ui.tsx`; section shells live in `components/<section>/*Shell.tsx`.
