import { db } from "@/lib/db"
import { Shield, Users, Trophy, ChevronRight } from "lucide-react"
import Link from "next/link"
import { MatchStatusBadge } from "@/components/dashboard/match-status-badge"

// ── Data fetching ────────────────────────────────────────────────

async function getStats() {
    const now = new Date()
    const [teams, players, upcoming, tournaments, live] = await Promise.all([
        db.team.count(),
        db.player.count(),
        db.match.count({ where: { status: "SCHEDULED", scheduledAt: { gte: now } } }),
        db.tournament.count(),
        db.match.count({ where: { status: "LIVE" } }),
    ])
    return { teams, players, upcoming, tournaments, live }
}

async function getUpcomingMatches() {
    return db.match.findMany({
        where: { status: "SCHEDULED", scheduledAt: { not: null } },
        orderBy: { scheduledAt: "asc" },
        take: 6,
        include: { homeTeam: true, awayTeam: true, tournament: true },
    })
}

async function getSeasonRecord() {
    const finished = await db.match.findMany({
        where: { status: "FINISHED", homeScore: { not: null }, awayScore: { not: null } },
        select: { homeScore: true, awayScore: true },
    })
    const wins = finished.filter((m) => m.homeScore! > m.awayScore!).length
    const draws = finished.filter((m) => m.homeScore! === m.awayScore!).length
    const losses = finished.filter((m) => m.homeScore! < m.awayScore!).length
    return { wins, draws, losses, total: finished.length }
}

async function getRecentResults() {
    return db.match.findMany({
        where: { status: "FINISHED", homeScore: { not: null }, awayScore: { not: null } },
        orderBy: { updatedAt: "desc" },
        take: 4,
        include: { homeTeam: true, awayTeam: true },
    })
}

// ── Helpers ──────────────────────────────────────────────────────

function formatDate(date: Date) {
    return {
        day: date.getDate(),
        month: date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
        time: date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    }
}

function formatMatchId(id: string) {
    return `#${id.slice(0, 5).toUpperCase()}`
}

// ── Page ─────────────────────────────────────────────────────────

export default async function DashboardPage() {
    const [stats, upcoming, record, results] = await Promise.all([
        getStats(),
        getUpcomingMatches(),
        getSeasonRecord(),
        getRecentResults(),
    ])

    // Donut percentages — show empty ring if no data
    const total = record.wins + record.draws + record.losses
    const winPct = total > 0 ? (record.wins / total) * 100 : 0
    const drawPct = total > 0 ? (record.draws / total) * 100 : 0
    const donutBg =
        total > 0
            ? `conic-gradient(var(--win) 0% ${winPct}%, var(--draw) ${winPct}% ${winPct + drawPct}%, var(--loss) ${winPct + drawPct}% 100%)`
            : `conic-gradient(var(--border) 0% 100%)`

    return (
        /**
         * 3-column grid layout matching brand/preview.html:
         *
         *  | Schedule (2fr)  | Record (1.25fr)  |  Right col (212px) ↕ |
         *  | Fixtures table (col 1+2)            |  Right col continues  |
         *
         * On mobile (<lg): single-column stack in reading order.
         */
        <div
            className="grid grid-cols-1 gap-[18px]
                       lg:grid-cols-[2fr_1.25fr_212px]"
        >
            {/* ── COL 1 · ROW 1: Upcoming Schedule ─────────────────── */}
            <div className="lg:col-start-1 lg:row-start-1 bg-card border border-border rounded-xl overflow-hidden shadow-card">
                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                    <h3 className="text-[0.9375rem] font-semibold">Upcoming Schedule</h3>
                    <Link
                        href="/dashboard/fixtures"
                        className="text-[0.8125rem] text-primary hover:underline font-medium"
                    >
                        View all →
                    </Link>
                </div>

                {upcoming.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground px-4">
                        No upcoming fixtures.{" "}
                        <Link href="/dashboard/tournaments" className="text-primary hover:underline">
                            Schedule from a tournament →
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {upcoming.slice(0, 6).map((match) => {
                            const d = match.scheduledAt ? formatDate(new Date(match.scheduledAt)) : null
                            return (
                                <Link
                                    key={match.id}
                                    href={`/dashboard/fixtures/${match.id}`}
                                    className="flex items-center gap-3.5 px-4 py-3 hover:bg-muted/40 transition-colors"
                                >
                                    {/* Date badge */}
                                    <div className="text-center w-9 shrink-0">
                                        <div className="font-mono font-semibold text-[1.0625rem] leading-none text-foreground">
                                            {d?.day ?? "—"}
                                        </div>
                                        <div className="text-[0.5625rem] uppercase tracking-wider text-muted-foreground mt-1">
                                            {d?.month ?? "TBC"}
                                        </div>
                                    </div>
                                    {/* Vertical separator */}
                                    <div className="w-px h-7 bg-border shrink-0" />
                                    {/* Match info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[0.8125rem] font-semibold text-foreground truncate">
                                            {match.homeTeam.name}{" "}
                                            <span className="text-muted-foreground font-normal">vs</span>{" "}
                                            {match.awayTeam.name}
                                        </div>
                                        <div className="text-[0.6875rem] text-muted-foreground mt-0.5">
                                            {d?.time ?? "TBC"}
                                            {match.tournament && ` · ${match.tournament.name}`}
                                        </div>
                                    </div>
                                    {/* Tournament tag */}
                                    <span className="text-[0.6875rem] font-semibold px-2 py-1 bg-secondary rounded text-muted-foreground shrink-0 hidden sm:block">
                                        {match.tournament.name}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── COL 2 · ROW 1: Season Record (donut) ─────────────── */}
            <div className="lg:col-start-2 lg:row-start-1 bg-card border border-border rounded-xl overflow-hidden shadow-card">
                <div className="px-4 py-3.5 border-b border-border">
                    <h3 className="text-[0.9375rem] font-semibold">Season Record</h3>
                </div>

                <div className="flex flex-col items-center px-4 py-5">
                    {/* CSS conic-gradient donut — CSS vars resolve to light/dark mode colours */}
                    <div className="relative w-32 h-32 mb-5">
                        <div
                            className="w-32 h-32 rounded-full"
                            style={{ background: donutBg }}
                        />
                        {/* White centre hole */}
                        <div className="absolute inset-[18px] rounded-full bg-card flex flex-col items-center justify-center">
                            <span className="font-mono text-[1.5rem] font-semibold text-foreground leading-none">
                                {record.total}
                            </span>
                            <span className="text-[0.5625rem] uppercase tracking-wider text-muted-foreground mt-1">
                                Matches
                            </span>
                        </div>
                    </div>

                    {/* W / D / L legend */}
                    <div className="w-full space-y-2">
                        <div className="flex items-center justify-between text-[0.8125rem]">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="size-2 rounded-full bg-[var(--win)] shrink-0" />
                                Wins
                            </div>
                            <span className="font-mono font-semibold text-foreground">{record.wins}</span>
                        </div>
                        <div className="flex items-center justify-between text-[0.8125rem]">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="size-2 rounded-full bg-[var(--draw)] shrink-0" />
                                Draws
                            </div>
                            <span className="font-mono font-semibold text-foreground">{record.draws}</span>
                        </div>
                        <div className="flex items-center justify-between text-[0.8125rem]">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="size-2 rounded-full bg-[var(--loss)] shrink-0" />
                                Losses
                            </div>
                            <span className="font-mono font-semibold text-foreground">{record.losses}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── COL 3 · ROWS 1+2: Statics + Recent Results ───────── */}
            <div className="lg:col-start-3 lg:row-start-1 lg:row-end-3 flex flex-col gap-5">

                {/* Statics — no outer card border, just colored mini-cards */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[0.9375rem] font-semibold">Statics</h3>
                        <span className="text-[0.75rem] text-muted-foreground">This season</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {/* Teams — blue tint */}
                        <Link
                            href="/dashboard/teams"
                            className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/[0.08] hover:opacity-90 transition-opacity"
                        >
                            <div className="size-10 rounded flex items-center justify-center shrink-0 bg-blue-100 dark:bg-blue-500/20">
                                <Shield size={18} className="text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[0.6875rem] text-muted-foreground font-medium">Teams</div>
                                <div className="font-mono text-[1.25rem] font-semibold text-foreground leading-tight">
                                    {stats.teams}
                                </div>
                            </div>
                            <span className="text-[0.6875rem] font-semibold text-[var(--win)] shrink-0">
                                Registered
                            </span>
                        </Link>

                        {/* Players — amber tint */}
                        <Link
                            href="/dashboard/teams"
                            className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/[0.08] hover:opacity-90 transition-opacity"
                        >
                            <div className="size-10 rounded flex items-center justify-center shrink-0 bg-amber-100 dark:bg-amber-500/20">
                                <Users size={18} className="text-amber-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[0.6875rem] text-muted-foreground font-medium">Players</div>
                                <div className="font-mono text-[1.25rem] font-semibold text-foreground leading-tight">
                                    {stats.players}
                                </div>
                            </div>
                            <span className="text-[0.6875rem] font-semibold text-[var(--win)] shrink-0">
                                In squads
                            </span>
                        </Link>

                        {/* Tournaments — green tint */}
                        <Link
                            href="/dashboard/tournaments"
                            className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.08] hover:opacity-90 transition-opacity"
                        >
                            <div className="size-10 rounded flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-500/20">
                                <Trophy size={18} className="text-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[0.6875rem] text-muted-foreground font-medium">Tournaments</div>
                                <div className="font-mono text-[1.25rem] font-semibold text-foreground leading-tight">
                                    {stats.tournaments}
                                </div>
                            </div>
                            <span className="text-[0.6875rem] font-semibold text-muted-foreground shrink-0">
                                Active
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Recent Results — plain section, no card border (matches "Top Countries" in reference) */}
                <div>
                    <h3 className="text-[0.9375rem] font-semibold mb-3">Recent Results</h3>

                    {results.length === 0 ? (
                        <p className="text-[0.8125rem] text-muted-foreground">No results yet.</p>
                    ) : (
                        <div className="divide-y divide-border">
                            {results.map((match) => {
                                const homeWon = match.homeScore! > match.awayScore!
                                const isDraw = match.homeScore! === match.awayScore!
                                const resultVar = homeWon
                                    ? "var(--win)"
                                    : isDraw
                                      ? "var(--draw)"
                                      : "var(--loss)"

                                return (
                                    <Link
                                        key={match.id}
                                        href={`/dashboard/fixtures/${match.id}`}
                                        className="flex items-center justify-between py-2.5 text-[0.8125rem] hover:opacity-80 transition-opacity"
                                    >
                                        <div className="flex items-center gap-2 font-medium text-foreground min-w-0">
                                            <span
                                                className="size-[7px] rounded-full shrink-0"
                                                style={{ background: resultVar }}
                                            />
                                            <span className="truncate">
                                                {match.homeTeam.name}{" "}
                                                <span className="text-muted-foreground font-normal text-[0.75rem]">
                                                    vs
                                                </span>{" "}
                                                {match.awayTeam.name}
                                            </span>
                                        </div>
                                        <span
                                            className="font-mono font-bold text-[0.875rem] shrink-0 ml-3"
                                            style={{ color: resultVar }}
                                        >
                                            {match.homeScore} – {match.awayScore}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── COLS 1+2 · ROW 2: Upcoming Fixtures Table ─────────── */}
            <div className="lg:col-start-1 lg:col-end-3 lg:row-start-2 bg-card border border-border rounded-xl overflow-hidden shadow-card">
                {/* Table header */}
                <div className="px-4 py-3.5 border-b border-border">
                    <h3 className="text-[0.9375rem] font-semibold">Upcoming Fixtures</h3>
                </div>

                {upcoming.length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                        No upcoming fixtures scheduled.
                    </div>
                ) : (
                    <>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground px-4 py-2.5">
                                        ID
                                    </th>
                                    <th className="text-left text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground px-4 py-2.5">
                                        Date
                                    </th>
                                    <th className="text-left text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground px-4 py-2.5">
                                        Match
                                    </th>
                                    <th className="text-left text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground px-4 py-2.5 hidden sm:table-cell">
                                        Tournament
                                    </th>
                                    <th className="text-left text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground px-4 py-2.5">
                                        Status
                                    </th>
                                    <th className="px-4 py-2.5 w-8" />
                                </tr>
                            </thead>
                            <tbody>
                                {upcoming.map((match) => {
                                    const d = match.scheduledAt
                                        ? new Date(match.scheduledAt).toLocaleDateString("en-GB", {
                                              day: "numeric",
                                              month: "short",
                                              year: "2-digit",
                                          })
                                        : "TBC"

                                    return (
                                        <tr
                                            key={match.id}
                                            className="group border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-mono text-[0.75rem] text-muted-foreground">
                                                {formatMatchId(match.id)}
                                            </td>
                                            <td className="px-4 py-3 text-[0.75rem] text-muted-foreground whitespace-nowrap">
                                                {d}
                                            </td>
                                            <td className="px-4 py-3 text-[0.875rem] font-semibold">
                                                <Link
                                                    href={`/dashboard/fixtures/${match.id}`}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {match.homeTeam.name}
                                                    <span className="text-muted-foreground font-normal mx-1.5 text-[0.8125rem]">
                                                        vs
                                                    </span>
                                                    {match.awayTeam.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-[0.75rem] text-muted-foreground hidden sm:table-cell">
                                                {match.tournament.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <MatchStatusBadge status={match.status} />
                                                {match.status === "SCHEDULED" && (
                                                    <span className="inline-flex items-center text-[0.625rem] font-semibold uppercase tracking-[0.18em] px-2 py-0.5 bg-secondary text-muted-foreground">
                                                        Scheduled
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground text-[1rem] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                ···
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        {/* "View Full Fixtures" link at BOTTOM — matches reference position */}
                        <div className="px-4 py-3 border-t border-border">
                            <Link
                                href="/dashboard/fixtures"
                                className="inline-flex items-center gap-1 text-[0.8125rem] text-primary font-medium hover:underline"
                            >
                                View Full Fixtures
                                <ChevronRight size={14} />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
