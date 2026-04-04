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
