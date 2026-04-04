# FixtureFlow

A white-label football club management platform. Manage age groups, teams, players, tournaments, and fixtures — all from a clean admin dashboard.

## What's inside

```
fixtureFlow2/
├── app/          # Next.js application
└── brand/        # Brand assets and design previews
```

## Tech stack

- **Framework** — Next.js 16 (App Router)
- **Auth** — NextAuth v5
- **Database** — PostgreSQL via Prisma
- **UI** — Tailwind CSS v4, Base UI, shadcn (base-nova)
- **Email** — Resend

## Features

- Age group & team management
- Player squad tracking
- Tournament creation (League, Cup, League Cup)
- Fixture scheduling & score entry
- Live match status
- Role-based access (Organiser, Coach, Viewer)
- White-label club branding via environment variables
- Light / dark mode

## Getting started

```bash
cd app
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Set up the database:

```bash
npm run db:push
npm run db:seed   # optional seed data
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth |
| `NEXTAUTH_URL` | Base URL of the app |
| `NEXT_PUBLIC_CLUB_NAME` | Club display name |
| `NEXT_PUBLIC_CLUB_TAGLINE` | Short club tagline |
| `NEXT_PUBLIC_CLUB_PRIMARY_COLOR` | Primary brand colour (hex) |
| `NEXT_PUBLIC_CLUB_LOGO_URL` | URL to club badge/logo |
| `RESEND_API_KEY` | Resend API key for emails |

## Tournament & fixture workflow

This section walks through the end-to-end flow for setting up a competition and scheduling matches.

### Prerequisites

Before creating a tournament you need:

1. **Age groups** — universal categories (e.g. U9, U11, U13). Create them under **Dashboard → Age Groups**.
2. **Teams** — each team belongs to an age group and is tagged with a season (e.g. `2025/26`). Create them under **Dashboard → Teams**.
3. **Active season** — the season selector in the sidebar controls which data every page shows. Make sure the correct season is selected before you start.

---

### Step 1 — Create a tournament

Navigate to **Dashboard → Tournaments → New Tournament** (`/dashboard/tournaments/new`).

| Field | Required | Notes |
|---|---|---|
| Season | No | Pre-filled with the current academic year (e.g. `2025/26`). Edit to override. |
| Name | Yes | Free text, e.g. *Spring League 2025* |
| Type | Yes | `League`, `Cup`, or `League Cup` |
| Age Group | Yes | Determines which teams can be enrolled |

Click **Create Tournament**. You are redirected to the tournament detail page.

---

### Step 2 — Enroll teams

On the tournament detail page (`/dashboard/tournaments/[id]`), the **Teams** panel on the right lists all teams in the same age group that are not yet enrolled.

1. Pick a team from the **Add a team…** dropdown.
2. Click **Add**. The team appears in the enrolled list immediately.
3. Repeat until all participating teams are added.
4. To remove a team, click the **×** next to its name.

> The **Schedule Match** button is disabled until at least 2 teams are enrolled.

---

### Step 3 — Schedule fixtures

Click **Schedule Match** (top-right of the tournament detail page).

| Field | Required | Notes |
|---|---|---|
| Home Team | Yes | Select from enrolled teams |
| Away Team | Yes | Must be different from home team |
| Date & Time | No | Leave blank to show as *TBC* in the fixture list |
| Venue | No | e.g. *Main pitch* |
| Round | No | e.g. *Week 1*, *Quarter-final* |

Click **Schedule**. The fixture appears in the **Fixtures** list on the left, sorted by date. Repeat for every match in the competition.

Fixtures also appear on **Dashboard → Fixtures** (`/dashboard/fixtures`), grouped by status: Live → Upcoming → Results.

---

### Step 4 — Update scores & match status

Click any fixture row (from the tournament page or from the Fixtures list) to open the match detail page (`/dashboard/fixtures/[id]`).

The **Update Score** panel lets you:

- Enter the **Home score** and **Away score** (numeric inputs).
- Set the **Status**:
  - `Scheduled` — upcoming, no score shown publicly yet.
  - `Live` — match is in progress; score is shown in real time.
  - `Finished` — result is final; feeds into standings, statistics, and team form.

Click **Save Score**. The change is reflected immediately across the dashboard, public pages, and embed widgets.

---

### How it all connects

```
Season (cookie)
  └── Tournament (season + ageGroup)
        ├── TournamentTeam  ←── Team (season + ageGroup)
        └── Match
              ├── GoalEvent  ←── Player stat (goals / assists)
              ├── MatchStatistic  ←── Team stat (cards, possession…)
              └── Status (SCHEDULED → LIVE → FINISHED)
                    └── feeds Standings, Statistics, Team Form
```

- **Standings** are computed from all `FINISHED` matches in a tournament.
- **Statistics page** (top scorers, assists, disciplinary, team form) aggregates across all tournaments in the active season.
- **Public pages** (`/fixtures`, `/standings`, `/bracket`) and **embed widgets** (`/embed/*`) read the same data, filtered by season.

---

## Deploying to Vercel

1. Import the repo in Vercel
2. Set **Root Directory** to `app`
3. Add all environment variables
4. Deploy

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Open Prisma Studio
npm run format       # Format with Prettier
```
