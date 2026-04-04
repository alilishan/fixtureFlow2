# FixtureFlow v2 — Competitor Analysis

> Research conducted April 2026. Covers 6 direct competitors across tournament & league management.

---

## Competitors Covered

| # | Product | Focus | Scale |
|---|---|---|---|
| 1 | **SportsEngine Tourney** (fka Tourney Machine) | Tournament management | 45,000+ orgs, 1M+ games/year |
| 2 | **LeagueApps** | Youth sports leagues, clubs, camps | Mid-to-large orgs |
| 3 | **Playinga** | Tournament management | Small-to-mid orgs, free tier |
| 4 | **SportNinja** | League + tournament management | Growing, app-first |
| 5 | **Team Sideline** | League management | Single website per org |
| 6 | **Leageez** | League management | Small leagues, free mobile app |

---

## Feature-by-Feature Comparison

### 1. Scheduling & Fixtures

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Manual fixture creation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Auto scheduling engine** | ❌ | ✅ (9x faster, constraint-aware) | ✅ | ✅ | ✅ | ✅ (multi-org) | ❌ |
| Constraint rules (back-to-back, distance, court avail.) | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Drag-and-drop schedule editor | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Venue / field / court management | ❌ | ✅ | ✅ (Facilities module) | ✅ | ❌ | ❌ | ❌ |
| Schedule sharing across organisations | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Referee scheduling & assignment | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (auto + manual) |

---

### 2. Tournament Types & Brackets

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Round-robin / league | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Single-elimination bracket | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| League + Cup hybrid | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Double-elimination bracket | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Pool play + knockout | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Custom bracket builder** | ❌ | ✅ | ✅ | ✅ | ✅ (custom brackets) | ❌ | ❌ |
| Seeding management | ✅ (seed value per team) | ✅ (smart seeding) | ✅ | ✅ | ✅ | ❌ | ❌ |

---

### 3. Registration & Onboarding

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Team registration (manual by admin) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Online self-registration (teams/players)** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Customisable registration forms** | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Waiver / consent collection | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Waitlists | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Age verification / eligibility | ✅ (age groups) | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Player profiles with photos | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |

---

### 4. Payments & Finance

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Payment collection | ❌ | ✅ | ✅ | ✅ (integrated) | ✅ | ✅ | ✅ |
| Entry / registration fees | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Discounts / promo codes | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ (multi-player discount) |
| Scholarships / subsidies | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Automated payment reminders | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Refunds / transfers | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Financial reporting | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Merchandise / apparel store | ❌ | ✅ (SquadLocker integration) | ❌ | ❌ | ❌ | ❌ | ❌ |

---

### 5. Live Scoring & Results

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Score entry (admin) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Live match status (LIVE badge) | ✅ | ✅ | ✅ | ✅ | ✅ (real-time sync) | ❌ | ❌ |
| **Real-time score updates (WebSockets / live push)** | ❌ (SWR poll) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| In-app score entry by coaches | ❌ | ✅ (mobile app) | ✅ | ✅ | ✅ | ❌ | ✅ |
| Standings auto-calculation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Recent form (W/D/L streak) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

### 6. Match Statistics

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Basic stats (goals, assists) | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Advanced per-match stats (shots, fouls, possession, cards) | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ (full game reports) |
| Player-level statistics | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ (individual game stats) |
| League leaders / top scorers | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Suspension / card tracking (carries across matches)** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Statistics dashboard / analytics | ❌ (in progress) | ❌ | ✅ (reporting module) | ✅ | ✅ | ❌ | ✅ |
| Export stats (CSV / PDF) | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

### 7. Communications & Notifications

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Email notifications | ❌ | ✅ | ✅ | ✅ (email templates) | ✅ | ✅ | ✅ |
| SMS / text alerts | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Push notifications (mobile) | ❌ | ✅ (app) | ✅ (app) | ❌ | ✅ (app) | ❌ | ✅ (app) |
| In-platform messaging | ❌ | ✅ (unlimited) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Schedule change / cancellation alerts | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Broadcast to league / team / individual | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |

---

### 8. Mobile

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Mobile-responsive web | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Native iOS app** | ❌ | ✅ (4.8★) | ✅ | ❌ | ✅ | ❌ | ✅ |
| **Native Android app** | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Coach/manager app features | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Fan-facing app (scores, brackets) | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |

---

### 9. Public-Facing & Fan Features

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Public fixtures page | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Public tournament page per event | ✅ | ✅ | ✅ | ✅ (Tournament Spotlight) | ✅ | ✅ (team sites) | ✅ |
| **Embeddable iframe widget** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dedicated tournament microsite | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Custom organisation website builder | ❌ | ✅ (integrated) | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Live streaming integration** | ❌ | ✅ (SportsEngine Play) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Directions / venue maps | ❌ | ✅ (in app) | ❌ | ❌ | ❌ | ❌ | ❌ |

---

### 10. User Roles & Access Control

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Organiser / admin role | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Coach role | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Player role | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Viewer / parent role | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Referee / umpire role | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Background checks** | ❌ | ✅ (NCSI integration) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Multi-organisation support | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |

---

### 11. Integrations & API

| Feature | FixtureFlow v1 | SportsEngine Tourney | LeagueApps | Playinga | SportNinja | Team Sideline | Leageez |
|---|---|---|---|---|---|---|---|
| Public REST API | ❌ (internal only) | ✅ | ✅ (documented) | ❌ | ❌ | ❌ | ❌ |
| Webhooks | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Payment gateway (Stripe, etc.) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Calendar sync (iCal, Google Cal) | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Livestream platform (YouTube, etc.) | ❌ | ✅ (own platform) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Social media sharing | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fundraising / sponsorship | ❌ | ✅ (SportsEngine HQ) | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Summary: Where FixtureFlow v1 Leads, Lags, and is Unique

### FixtureFlow v1 Advantages (things competitors largely don't do as well)
| Strength | Notes |
|---|---|
| **Embeddable iframe widget** | No competitor offers this. Unique drop-in for club websites. |
| **LEAGUE_CUP hybrid tournament type** | Most competitors do league or bracket, not both in one tournament |
| **Per-match granular stats (possession, fouls, shots, cards)** | Most competitors skip this depth at the match level |
| **Recent form badges (W/D/L streak)** | Visible at a glance in the league table — none of the competitors surface this |
| **Live status machine (SCHEDULED → LIVE → FINISHED)** | Explicit 3-state match lifecycle, most competitors just have score/no score |
| Clean developer-first architecture (Next.js, Prisma, SWR) | Not a public feature, but makes v2 iteration fast |

### Critical Gaps in FixtureFlow v1 (what competitors all have that we don't)
| Gap | Priority for v2 |
|---|---|
| **Online self-registration** | 🔴 High — biggest missing piece for adoption |
| **Payment processing** | 🔴 High — expected by all org admins |
| **Email / SMS notifications** | 🔴 High — schedule changes and match reminders are essential |
| **Auto-scheduling engine** | 🟠 Medium — manual works for small orgs, needed to scale |
| **Native mobile app** | 🟠 Medium — SportsEngine Tourney's 4.8★ app is a major UX differentiator |
| **Player-level statistics & top scorer table** | 🟠 Medium — Leageez and SportNinja both do this |
| **Real-time WebSocket score updates** | 🟠 Medium — currently using SWR polling |
| **Calendar sync (iCal / Google Cal)** | 🟡 Low-medium — LeagueApps and Team Sideline offer this |
| **Public API** | 🟡 Low-medium — needed for third-party integrations |
| **Referee management** | 🟡 Low — Leageez and SportNinja both offer this |
| **Suspension / accumulated card tracking** | 🟡 Low — SportNinja is the only one doing this well |

### FixtureFlow v1 Unique Opportunities (gaps in the market no one fills well)
| Opportunity | Why it matters |
|---|---|
| **Best-in-class embeddable widget** (expand it) | No competitor has this. Could be a strong distribution channel |
| **Stats depth + player profiles combined** | Competitors either have shallow stats or player profiles, not both with match-level granularity |
| **Transparent public-first design** | Most platforms are admin-first. FixtureFlow has beautiful public pages — lean into this |
| **Developer API + embed ecosystem** | Build a plugin/embed ecosystem for club websites — zero competition here |
| **Lightweight & fast for small community clubs** | Competitors are bloated and expensive. A clean, modern, affordable alternative wins grassroots |

---

## Pricing Landscape

| Product | Model | Approx. Cost |
|---|---|---|
| SportsEngine Tourney | Per-event pricing (contact for quote) | Enterprise pricing |
| LeagueApps | Revenue share on registrations | % of fees collected |
| Playinga | **Free tier available** + paid plans | Freemium |
| SportNinja | Free for participants, paid for admins | Subscription |
| Team Sideline | Subscription per organisation | Mid-range |
| Leageez | Subscription + free mobile app | Low-mid range |
| **FixtureFlow v1** | Not monetised yet | — |

---

## Key Takeaways for v2 Planning

1. **Registration + payments is the #1 gap.** Every competitor has it. Without it, FixtureFlow stays a tool only for orgs who manage teams manually.
2. **Notifications are table stakes.** Email at minimum for schedule changes, results, and reminders.
3. **The embed widget is a genuine competitive moat.** No one else does it. Build on it aggressively — make it customisable, theme-able, and add live scores.
4. **Statistics depth is a differentiator.** Lean into it — add player-level stats and a top-scorers table rather than walking it back.
5. **Don't try to out-feature SportsEngine.** They have livestreaming, background checks, apparel stores. Win on focus, speed, and UX quality for grassroots football.
6. **A PWA or mobile-friendly coach app** (even without native) would cover 80% of what competitors' native apps do without the native app overhead.
