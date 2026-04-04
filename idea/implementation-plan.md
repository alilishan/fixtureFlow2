# FixtureFlow v2 — Implementation Plan

> Fresh build. Zero code copied from v1. Informed by v1 lessons.

---

## Tech Stack Decisions

| Layer | Choice | Reason vs v1 |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Same — proven, stick with it |
| Language | **TypeScript** | Same |
| Styling | **Tailwind CSS v4** | Same |
| UI Components | **shadcn/ui** | Same — but build a proper design system from day 1 |
| Auth | **NextAuth v5** (Auth.js) | Replaces Clerk — open source, no vendor lock-in, credentials + OAuth, roles stored in DB |
| Database | **Supabase** (PostgreSQL) + **Prisma ORM** | Supabase over bare Neon/Railway — free-tier Postgres + built-in DB browser, storage for logo uploads, no extra services needed |
| Data Fetching | **TanStack Query (React Query)** | Replace SWR — better DevEx, more control, optimistic updates |
| Real-time | **Server-Sent Events (SSE)** | Lightweight push for live score updates, no WebSocket overhead |
| Email | **Resend** | Simple, developer-friendly, works with Next.js server actions |
| Validation | **Zod** | Same |
| Forms | **React Hook Form + Zod** | Replaces ad-hoc form state in v1 |
| Notifications | **Sonner** | Same |
| Icons | **Lucide React** | Same |
| Deployment | **Vercel** (one project per club) | Fast, per-instance env vars handle white-labelling |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/               # Public-facing routes (no auth)
│   │   ├── page.tsx            # Club home
│   │   ├── fixtures/
│   │   ├── standings/
│   │   └── bracket/
│   ├── (embed)/                # Embeddable widgets
│   │   └── embed/
│   │       ├── fixtures/
│   │       ├── standings/
│   │       ├── bracket/
│   │       └── live/
│   ├── (auth)/                 # Sign in only (no sign up)
│   │   └── sign-in/
│   ├── dashboard/              # Protected admin area
│   │   ├── page.tsx
│   │   ├── age-groups/
│   │   ├── teams/
│   │   ├── players/            # New in v2
│   │   ├── tournaments/
│   │   ├── fixtures/
│   │   ├── matches/[id]/
│   │   ├── statistics/
│   │   └── settings/           # New in v2
│   └── api/
│       ├── matches/
│       ├── teams/
│       ├── tournaments/
│       ├── players/
│       ├── age-groups/
│       ├── league-table/
│       ├── bracket/
│       ├── statistics/
│       └── live/               # SSE endpoint for live updates
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── public/                 # Public page components
│   │   ├── MatchCard/
│   │   ├── LeagueTable/
│   │   ├── Bracket/
│   │   └── LiveScoreboard/
│   ├── dashboard/              # Dashboard components
│   │   ├── PageHeader/
│   │   ├── StatsCard/
│   │   └── ...
│   ├── embed/                  # Widget-specific components
│   └── forms/                  # Shared form components
├── hooks/                      # TanStack Query hooks
├── actions/                    # Server actions
├── lib/
│   ├── db.ts                   # Prisma client
│   ├── club-config.ts          # White-label config reader
│   ├── email.ts                # Resend email helpers
│   └── utils.ts
├── types/                      # Shared TypeScript types
└── prisma/
    └── schema.prisma
```

---

## Database Schema (v2)

### New additions vs v1
- `User` model — owned by us now (NextAuth, not Clerk), includes role + hashed password
- `Player` model (new)
- `GoalEvent` model — tracks who scored/assisted per match (new)
- `ClubSettings` model — white-label config stored in DB (new)
- `Notification` model — tracks scheduled email sends (new)
- PostgreSQL via Supabase instead of MySQL

### Core Models

```prisma
model User {
  id             String   @id @default(cuid())
  name           String?
  email          String   @unique
  hashedPassword String
  role           Role     @default(VIEWER)
  coachOfTeam    Team?    @relation("CoachTeam")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

enum Role {
  ORGANISER
  COACH
  VIEWER
}

model ClubSettings {
  id          String  @id @default(cuid())
  name        String
  tagline     String?
  logoUrl     String?
  primaryColor String  @default("#000000")
  season      String?  // e.g. "2025/26"
  contactEmail String?
}

model AgeGroup {
  id      String  @id @default(cuid())
  name    String  @unique
  minAge  Int?
  maxAge  Int?
  teams       Team[]
  tournaments Tournament[]
}

model Team {
  id          String  @id @default(cuid())
  name        String
  ageGroupId  String
  ageGroup    AgeGroup @relation(fields: [ageGroupId], references: [id])
  coachId     String?
  players     Player[]
  homeMatches Match[] @relation("HomeTeam")
  awayMatches Match[] @relation("AwayTeam")
  tournaments TournamentTeam[]
  statistics  MatchStatistic[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Player {
  id           String  @id @default(cuid())
  name         String
  squadNumber  Int?
  position     String?
  photoUrl     String?
  teamId       String
  team         Team    @relation(fields: [teamId], references: [id])
  goalEvents   GoalEvent[]
  createdAt    DateTime @default(now())
}

model Tournament {
  id         String          @id @default(cuid())
  name       String
  type       TournamentType
  ageGroupId String
  ageGroup   AgeGroup        @relation(fields: [ageGroupId], references: [id])
  teams      TournamentTeam[]
  matches    Match[]
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt
}

model TournamentTeam {
  tournamentId String
  teamId       String
  seed         Int?
  tournament   Tournament @relation(fields: [tournamentId], references: [id])
  team         Team       @relation(fields: [teamId], references: [id])
  @@unique([tournamentId, teamId])
}

model Match {
  id           String        @id @default(cuid())
  tournamentId String
  tournament   Tournament    @relation(fields: [tournamentId], references: [id])
  homeTeamId   String
  awayTeamId   String
  homeTeam     Team          @relation("HomeTeam", fields: [homeTeamId], references: [id])
  awayTeam     Team          @relation("AwayTeam", fields: [awayTeamId], references: [id])
  scheduledAt  DateTime?
  venue        String?       // New in v2
  round        String?       // e.g. "Quarterfinal", "MD3"
  status       MatchStatus   @default(SCHEDULED)
  homeScore    Int?
  awayScore    Int?
  statistics   MatchStatistic[]
  goalEvents   GoalEvent[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model MatchStatistic {
  id          String  @id @default(cuid())
  matchId     String
  teamId      String
  match       Match   @relation(fields: [matchId], references: [id])
  team        Team    @relation(fields: [teamId], references: [id])
  goals       Int     @default(0)
  assists     Int     @default(0)
  shots       Int     @default(0)
  possession  Int     @default(0)
  fouls       Int     @default(0)
  yellowCards Int     @default(0)
  redCards    Int     @default(0)
  @@unique([matchId, teamId])
}

model GoalEvent {
  id        String   @id @default(cuid())
  matchId   String
  playerId  String
  type      GoalType // GOAL, ASSIST, OWN_GOAL
  minute    Int?
  match     Match    @relation(fields: [matchId], references: [id])
  player    Player   @relation(fields: [playerId], references: [id])
}

enum TournamentType {
  LEAGUE
  CUP
  LEAGUE_CUP
}

enum MatchStatus {
  SCHEDULED
  LIVE
  FINISHED
}

enum GoalType {
  GOAL
  ASSIST
  OWN_GOAL
}
```

---

## Implementation Phases

---

### Phase 0 — Project Setup
**Goal:** Working skeleton, deployable, nothing broken.

- [ ] `npx create-next-app@latest` with TypeScript + Tailwind + App Router
- [ ] Install and configure: shadcn/ui, Prisma, NextAuth v5, TanStack Query, Zod, React Hook Form, Sonner, Lucide, Resend
- [ ] Create Supabase project, grab connection string (Transaction pooler URL for Prisma)
- [ ] Write initial Prisma schema (all models including `User` with role field)
- [ ] Run first migration against Supabase
- [ ] Configure NextAuth v5 — credentials provider (email + password), JWT sessions, role stored in token
- [ ] Set up middleware for dashboard route protection using NextAuth session
- [ ] Seed first admin user via script
- [ ] Create `lib/club-config.ts` — reads club name, logo, colour from env vars
- [ ] Set up root layout with SessionProvider, TanStack Query provider, Sonner
- [ ] Deploy skeleton to Vercel, confirm it runs

**Deliverable:** Empty app, auth working, DB connected, deployed.

---

### Phase 1 — Admin Foundation (CRUD Core)
**Goal:** An organiser can set up a club's data from scratch.

- [ ] Dashboard layout (sidebar nav, header, mobile-responsive)
- [ ] Dashboard home (placeholder stats, quick actions)
- [ ] Age Groups — full CRUD (table, create/edit/delete modals)
- [ ] Teams — full CRUD (table, assign age group, assign coach)
- [ ] Players — full CRUD per team (list, add/edit/delete player, squad number, position)
- [ ] Tournaments — full CRUD (name, type selector, age group, teams assignment with seeding)
- [ ] Fixtures — create single match (home team, away team, date, venue, tournament, round)
- [ ] Match detail page — status control + score entry
- [ ] Users — list users, assign roles, assign coach to team

**Deliverable:** A complete club setup is possible end-to-end.

---

### Phase 2 — Public Pages
**Goal:** Beautiful, fast public-facing pages the club can share.

- [ ] Club config context (name, logo, colour available site-wide)
- [ ] Public club home page — hero, live match card, upcoming fixtures, latest results
- [ ] Public fixtures page — filters (tournament, age group, status tabs), match cards
- [ ] Public standings page — league table with form pills, GD, positions with icons
- [ ] Public bracket page — cup bracket, auto-advance on results, mobile-friendly
- [ ] Loading states (skeleton screens)
- [ ] Empty states
- [ ] SEO metadata (title, description per page using club config)
- [ ] Dark/light mode

**Deliverable:** The public site is ready to demo to a club.

---

### Phase 3 — Embed Widgets
**Goal:** Anything the public pages do, clubs can embed on their own website.

- [ ] Embed layout (no nav, no header, iframe-safe, minimal styles)
- [ ] `/embed/fixtures` — match list, theme + filter URL params
- [ ] `/embed/standings` — league table widget
- [ ] `/embed/bracket` — bracket widget
- [ ] `/embed/live` — "live now" scoreboard (shows active matches, score, status)
- [ ] Theme support (`?theme=light|dark`)
- [ ] Filter params (`?tournament=`, `?ageGroup=`)
- [ ] "Powered by FixtureFlow" footer on each widget
- [ ] Embed code generator in dashboard settings (copy-paste iframe snippet)

**Deliverable:** Widgets ready to drop onto a club's WordPress/Squarespace site.

---

### Phase 4 — Statistics & Player Features
**Goal:** The stats depth that makes clubs brag about FixtureFlow.

- [ ] Match stats editor — goals, assists, shots, possession, fouls, yellow/red cards
- [ ] Goal events entry — attribute goals and assists to specific players with optional minute
- [ ] Top scorers table per tournament
- [ ] Top assisters table per tournament
- [ ] Disciplinary table (accumulated yellow/red cards per player)
- [ ] Team form table (recent 5-match form per team in standings)
- [ ] Player profile page (public) — stats summary, goal/assist history
- [ ] Statistics dashboard in admin — cross-tournament overview

**Deliverable:** Statistics are a genuine selling point over a spreadsheet.

---

### Phase 5 — Live Updates
**Goal:** Scores update in real time during a match without page refresh.

- [ ] SSE endpoint `GET /api/live` — streams match status + score changes
- [ ] Client hook `useLiveMatches()` — connects to SSE, updates UI reactively
- [ ] Live match card on public home updates automatically
- [ ] `/embed/live` widget updates automatically
- [ ] Public fixtures page updates live match rows without full refresh
- [ ] Admin match detail page updates for other open sessions (e.g. two admins open)
- [ ] Graceful degradation (falls back to polling if SSE not supported)

**Deliverable:** Real-time live scores — the most impressive demo moment.

---

### Phase 6 — Notifications
**Goal:** Coaches and club members get timely, automatic emails.

- [ ] Configure Resend (API key via env var)
- [ ] Email template: upcoming match reminder (24h before kickoff)
- [ ] Email template: match result notification (sent when status → FINISHED)
- [ ] Cron job / scheduled action to send 24h reminders (Vercel Cron or trigger on deploy)
- [ ] Notification log in admin — see what was sent and when
- [ ] Per-user opt-out toggle in user settings

**Deliverable:** Coaches stop missing match times. Club admins stop sending WhatsApp reminders.

---

### Phase 7 — Settings & White-label Polish
**Goal:** Each deployment is fully branded to the club.

- [ ] Settings page in dashboard — club name, tagline, logo upload, brand colour, season label, contact email
- [ ] Logo upload to Vercel Blob or Cloudinary
- [ ] Brand colour applied as CSS custom property across all pages
- [ ] Season label shown in public page headers (e.g. "2025/26 Season")
- [ ] Embed code generator — shows ready-to-copy iframe snippets per widget type
- [ ] Favicon set from club logo
- [ ] OG image generation (dynamic, shows club name + FixtureFlow branding)

**Deliverable:** Hand the dashboard login to a club and it looks like their product.

---

### Phase 8 — Data Import & Onboarding
**Goal:** New club deployments can be set up in under an hour.

- [ ] CSV import for teams (columns: name, age group, coach email)
- [ ] CSV import for players (columns: name, team, squad number, position)
- [ ] Import preview — show what will be created before confirming
- [ ] Import error handling — highlight rows that fail validation
- [ ] Onboarding checklist on dashboard home (first-time setup guide)
  1. Configure club settings
  2. Create age groups
  3. Add teams (or import CSV)
  4. Add players (or import CSV)
  5. Create tournament(s)
  6. Generate fixtures

**Deliverable:** Onboarding a new club takes 1 hour, not a day.

---

### Phase 9 — QA, Polish & Deployment Docs
**Goal:** Production-ready. Deployable by you in under 30 minutes per club.

- [ ] Responsive QA across mobile, tablet, desktop
- [ ] Performance audit (Lighthouse scores for public pages)
- [ ] Error boundaries on all pages
- [ ] 404 and error pages with club branding
- [ ] Write `DEPLOY.md` — step-by-step guide:
  - Fork/clone repo
  - Create Supabase project, copy connection string
  - Set env vars (DB URL, NextAuth secret, club config, Resend key)
  - Run migrations + seed first admin user
  - Deploy to Vercel
  - Log in as admin and configure club settings
- [ ] Document all env vars

**Deliverable:** You can deploy a new club instance in 30 minutes.

---

## Development Order Summary

```
Phase 0 → Setup           (foundation, 1–2 days)
Phase 1 → Admin CRUD      (core data, 1 week)
Phase 2 → Public Pages    (demo-ready, 1 week)
Phase 3 → Embed Widgets   (sales tool, 3–4 days)
Phase 4 → Statistics      (differentiator, 1 week)
Phase 5 → Live Updates    (wow factor, 3–4 days)
Phase 6 → Notifications   (polish, 2–3 days)
Phase 7 → White-label     (club handover, 2–3 days)
Phase 8 → Import tools    (onboarding, 2–3 days)
Phase 9 → QA & Docs       (production, 2–3 days)
```

**Estimated total: 6–8 weeks** working at a steady pace.

---

## Environment Variables

```env
# Supabase / Database
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-side only (logo uploads, admin ops)

# NextAuth v5
AUTH_SECRET=                      # openssl rand -base64 32
AUTH_URL=https://yourclub.fixtureflow.app

# Club White-label (per instance)
NEXT_PUBLIC_CLUB_NAME="FC Example"
NEXT_PUBLIC_CLUB_TAGLINE="Est. 1987"
NEXT_PUBLIC_CLUB_PRIMARY_COLOR="#e84422"
NEXT_PUBLIC_CLUB_LOGO_URL=

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL="no-reply@fixtureflow.app"

# App
NEXT_PUBLIC_APP_URL=https://yourclub.fixtureflow.app
```

> **Note on Supabase + Prisma:** Use `DATABASE_URL` with `?pgbouncer=true` for Prisma queries (connection pooling), and `DIRECT_URL` without pooling for migrations (`prisma migrate`). Both are needed in `schema.prisma`.

---

## Key Decisions & Rationale

| Decision | Why |
|---|---|
| NextAuth v5 over Clerk | No vendor lock-in, no per-MAU pricing, roles live in our own DB, full control over session shape |
| Supabase over bare Neon/Railway | Free-tier Postgres + built-in DB table browser + Storage for logo uploads — one less service to manage |
| Prisma dual URLs (pooled + direct) | Supabase requires pgbouncer pooling for runtime queries but direct connection for migrations |
| TanStack Query over SWR | More control over cache invalidation, better optimistic update patterns, better DevEx |
| SSE over WebSockets | WebSockets need persistent server; SSE works fine on Vercel serverless, simpler to implement |
| Resend over Nodemailer | Zero config, works out of the box on serverless, generous free tier |
| React Hook Form over ad-hoc state | v1 had scattered form state in components — centralise it properly from day 1 |
| Separate Vercel project per club | Cleanest isolation, independent env vars, independent deployments, no multi-tenancy complexity |
| No public sign-up | Keeps the product focused, removes spam/abuse surface, matches the deployment model |
