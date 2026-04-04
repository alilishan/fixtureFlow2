# FixtureFlow v2 — Product Vision

> Deployment model: agency-deployed, club-branded instances. Not a SaaS signup flow.

---

## The Problem We're Solving

Grassroots football clubs manage fixtures with Google Sheets, WhatsApp groups, and handwritten tables on noticeboards. They have a club website but it's static — no live scores, no standings, nothing that updates automatically.

They don't need enterprise software. They need something that:
- Looks professional and works on phones
- Their club secretary can run without training
- Shows parents and fans live fixtures and results
- Can sit embedded on the club's existing website

---

## Who This Is For

**Primary user: The Club Secretary / Organiser**
- Not a developer
- Manages 4–12 teams across multiple age groups
- Runs 1–3 tournament types per season (league, cup, or both)
- Currently drowning in manual admin

**Secondary users (after deployment):**
- **Coaches** — view their team's fixtures, enter match results
- **Parents / Fans** — check upcoming matches and results on their phone
- **Club website visitors** — see live standings and fixtures embedded on the club site

---

## Business Model

- Developer (you) deploys a configured instance per club
- Each instance is a standalone Next.js app pointed at its own database
- Club pays a flat fee or retainer — all transactions happen outside the app
- You demo the product to a club using a live running instance with their branding

---

## The Demo That Closes the Deal

Walk into the club. Open their website. Show them:
1. A fixture list with live scores updating in real time — embedded on **their** site
2. A league table auto-updating after every result
3. A tournament bracket that fills itself in as rounds progress
4. A clean admin dashboard their secretary can log into and manage everything

That's the pitch. The embed widget is the hero feature.

---

## Core Principles for v2

### 1. White-label first
Every visible string — club name, colours, logo — comes from config. One codebase, infinite club identities.

### 2. Operator-deployed, not user-registered
No public sign-up. The developer (or the club's designated admin) creates accounts. The app assumes it is already configured for one club.

### 3. Public pages are the product
The public-facing experience (fixtures, standings, bracket, club home) is what the club shows off. These pages must be fast, beautiful, and embeddable.

### 4. The dashboard must pass the secretary test
If a non-technical club secretary can't figure out how to enter a result within 2 minutes of first login — the UX has failed.

### 5. Fresh build, no legacy
v2 is written from scratch. Lessons from v1 inform decisions, but no code is carried over.

---

## Feature Set for v2

### Config & White-labelling
- Club name, tagline, logo, primary brand colour — all from a config file or settings table
- Per-instance database (separate deployment per club)
- Dark/light mode support

### Public Club Home (`/`)
- Club branding hero section
- Live "happening now" match card (if a match is live)
- Upcoming fixtures preview (next 3–5 matches)
- Latest results
- Quick link to full fixtures, standings, and bracket

### Public Fixtures Page (`/fixtures`)
- All matches with filters: age group, tournament, status
- Tab filters: Upcoming / Live / Results
- Clean match cards (not just a table) — team names, score, date, venue
- Auto-refresh on live matches

### Public Standings Page (`/standings`)
- League table per tournament
- Position, P, W, D, L, GF, GA, GD, Pts
- Recent form (last 5 results as W/D/L pills)
- Highlight top positions (promotion zone) and bottom (relegation zone)

### Public Bracket Page (`/bracket`)
- Visual bracket for cup tournaments
- Auto-advances teams as results come in
- Works on mobile

### Embeddable Widgets
- `/embed/fixtures` — match list widget
- `/embed/standings` — league table widget  
- `/embed/bracket` — bracket widget
- `/embed/live` — "live now" scoreboard widget (new)
- All support `?theme=light|dark`, `?tournament=`, `?ageGroup=`
- Minimal, iframe-safe styling
- "Powered by FixtureFlow" attribution footer

### Admin Dashboard (`/dashboard`)

**Overview**
- Live matches alert (pulsing, prominent)
- Today's fixtures
- Quick stats: total teams, upcoming matches, active tournaments
- Quick actions: Add result, Create match, Manage teams

**Age Groups**
- CRUD — create/edit/delete
- Assign to teams and tournaments

**Teams**
- CRUD with coach assignment
- Age group assignment
- View team's fixture history and record

**Tournaments**
- CRUD: League, Cup, League+Cup hybrid
- Teams assignment with seeding for cup draws
- Status: Upcoming / Active / Completed

**Fixtures**
- View all matches with filters
- Create single match or bulk-generate fixtures (round-robin generator)
- Match detail: set status, enter score, edit statistics

**Match Detail**
- Status control: Scheduled → Live → Finished
- Score entry (locked until Live or Finished)
- Per-team statistics: Goals, Assists, Shots, Possession, Fouls, Yellow Cards, Red Cards
- Player goal/assist attribution (new in v2)

**Players** (new in v2)
- Player profiles per team: name, position, squad number, photo (optional)
- Appear in match stats for goal/assist attribution
- Top scorers table per tournament

**Statistics Dashboard** (new in v2)
- Top scorers across all tournaments
- Top assisters
- Disciplinary table (yellow/red cards accumulated)
- Team form table
- Head-to-head match history

**Settings** (new in v2)
- Club name, logo, tagline
- Brand colour
- Season label (e.g. "2025/26 Season")
- Contact email for the club
- Homepage feature toggles (show/hide sections)

**Users**
- Create/manage user accounts (no public sign-up)
- Assign roles: Organiser, Coach, Viewer
- Coach → team assignment

### Notifications (new in v2)
- Email reminders for upcoming matches (24h before)
- Result confirmation email to coaches after match is entered
- All via a simple email provider (Resend or Nodemailer)
- Configured via env vars, no in-app email builder needed

### Data Import (new in v2)
- CSV import for teams and players
- Allows rapid onboarding of a new club's existing data

---

## What v2 Deliberately Excludes

- Public self-registration (not needed for this model)
- Payment processing (handled outside the app)
- Multi-club multi-tenant UI (separate instances handle this)
- Native mobile app (responsive web + PWA covers 90% of the need)
- Livestreaming
- Background checks
- Apparel / merchandise store

These can all be v3 additions if the model evolves.
