# FixtureFlow v1 — Feature Inventory

> Reference document for building v2. Captures everything present in the original codebase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| UI | shadcn/ui (Radix UI + Tailwind CSS v4) |
| Auth | Clerk (user management + roles) |
| Database | MySQL + Prisma ORM |
| Data Fetching | SWR (client-side caching + revalidation) |
| Validation | Zod |
| Notifications | Sonner (toast) |
| Icons | Lucide React, React Icons |

---

## Data Models

### User
- Clerk-managed identity (email + Clerk ID)
- Roles: `ORGANIZER`, `COACH`, `PLAYER`, `VIEWER`
- Coach-to-team assignment

### AgeGroup
- Name (e.g. U12, U14, U18, Open)
- Min/max age range
- Relations: Teams, Tournaments

### Team
- Name, coach assignment, age group
- Tournament participation tracking
- Home & away match history

### Tournament
- Name, type (`LEAGUE`, `CUP`, `LEAGUE_CUP`)
- Age group assignment
- Teams via `TournamentTeam` junction (with optional seed value)

### Match
- Tournament, home team, away team
- Scheduled date & time
- Status: `SCHEDULED`, `LIVE`, `FINISHED`
- Nullable scores (set when played)
- Per-team statistics

### MatchStatistic (per team per match)
- Goals, Assists, Yellow Cards, Red Cards
- Fouls, Shots, Possession %

---

## Pages & Screens

### Public (no auth)

| Route | Feature |
|---|---|
| `/` | Marketing landing page — hero, feature cards, benefits, CTAs |
| `/fixtures` | Match listing with tournament + age group filters, tab filters (All / Live / Upcoming / Results), sidebar with live matches + stats counts |
| `/tournaments` | Tournament browser — league table view, cup bracket view, LEAGUE_CUP tabbed hybrid |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |
| `/embed/fixtures` | Embeddable widget (iframe-ready, theme + filter URL params, "Powered by FixtureFlow" footer) |

### Protected Dashboard (`/dashboard/*`)

| Route | Feature |
|---|---|
| `/dashboard` | Overview — stats cards (teams, tournaments, matches, completed), live matches alert, recent activity feed, quick-start checklist |
| `/dashboard/age-groups` | CRUD — create/edit/delete age groups with modal dialogs |
| `/dashboard/teams` | CRUD — create/edit/delete teams; assign coach + age group |
| `/dashboard/tournaments` | CRUD — create/edit/delete tournaments; type + age group selector |
| `/dashboard/fixtures` | Match management — stats cards, tournament/age group filters, tab filters, match table with view action |
| `/dashboard/matches/[id]` | Match detail — status control (Scheduled/Live/Finished), score editor, tabbed statistics editor (Overview / Attacking / Defensive) |
| `/dashboard/statistics` | Statistics dashboard (in progress in v1) |
| `/dashboard/users` | User list + role assignment |

---

## Key Features

### Tournament Types
- **LEAGUE** — round-robin standings with points, wins, draws, losses, GD, recent form badges
- **CUP** — single-elimination bracket grouped by round (R16, QF, SF, Final)
- **LEAGUE_CUP** — hybrid with tabbed league phase + knockout phase

### Match Management
- Status machine: SCHEDULED → LIVE → FINISHED
- Score editing locked to LIVE or FINISHED status
- Live pulsing animation on active matches

### Match Statistics
- Editable live during LIVE status
- Tabbed: Overview (Goals, Assists, Possession) / Attacking (Shots, Goals, Assists) / Defensive (Fouls, Yellow Cards, Red Cards)
- Per-team per-match granularity

### Real-Time Data
- SWR-based auto-revalidation across all data hooks
- Custom hooks: `useMatches`, `useTournaments`, `useTeams`, `useAgeGroups`, `useMatch`, `useMatchStatistics`, `useLeagueTable`, `useTournamentBracket`

### Auth & Roles
- Clerk middleware protects all `/dashboard/*` routes
- Four roles: ORGANIZER (full access), COACH, PLAYER, VIEWER
- Public routes fully accessible without auth

### Filtering
- Tournament + age group filters on both public fixtures and dashboard fixtures
- Tab-based status filters (All / Scheduled / Live / Finished)
- Collapsible sidebars on public pages

### Embeddable Widget
- `/embed/fixtures` — drop-in iframe widget
- URL params: `?theme=light|dark`, `?tournament={id}`, `?ageGroup={name}`
- System theme detection fallback
- Minimal, self-contained styling

---

## API Routes

```
GET  /api/matches
POST /api/matches
GET  /api/matches/[id]
PUT  /api/matches/[id]
DEL  /api/matches/[id]
GET  /api/matches/[id]/statistics
PUT  /api/matches/[id]/statistics
PUT  /api/matches/[id]/statistics/[teamId]

GET  /api/teams
POST /api/teams
GET  /api/teams/[id]
PUT  /api/teams/[id]
DEL  /api/teams/[id]

GET  /api/tournaments
POST /api/tournaments
GET  /api/tournaments/[id]
PUT  /api/tournaments/[id]
DEL  /api/tournaments/[id]

GET  /api/tournament-bracket/[tournamentId]
GET  /api/league-table/[tournamentId]

GET  /api/age-groups
POST /api/age-groups
GET  /api/age-groups/[id]
PUT  /api/age-groups/[id]
DEL  /api/age-groups/[id]

GET  /api/users
POST /api/users
GET  /api/users/[id]
PUT  /api/users/[id]
DEL  /api/users/[id]
```

---

## Planned / Not Yet Built (from v1 README)

These were called out as future work — strong candidates for v2:

- Real-time live match updates via WebSockets
- Advanced statistics & analytics dashboard
- Player registration + individual profiles
- Mobile app
- Public API for third-party integrations
- Export / reporting (PDF, CSV)
- Multi-tenant support (multiple organisations)
- Payment integration (tournament fees)
- Notification system (email, SMS, push)
