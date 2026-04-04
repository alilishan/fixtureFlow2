import { db } from "@/lib/db"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { MatchStatusBadge } from "@/components/dashboard/match-status-badge"

type Props = { searchParams: Promise<{ status?: string; tournament?: string; ageGroup?: string }> }

export default async function PublicFixturesPage({ searchParams }: Props) {
    const { status, tournament, ageGroup } = await searchParams

    const [matches, tournaments, ageGroups] = await Promise.all([
        db.match.findMany({
            where: {
                ...(tournament ? { tournamentId: tournament } : {}),
                ...(ageGroup ? { tournament: { ageGroupId: ageGroup } } : {}),
            },
            orderBy: { scheduledAt: "asc" },
            include: { homeTeam: true, awayTeam: true, tournament: { include: { ageGroup: true } } },
        }),
        db.tournament.findMany({ orderBy: { name: "asc" }, include: { ageGroup: true } }),
        db.ageGroup.findMany({ orderBy: { name: "asc" } }),
    ])

    const tabs = [
        { label: "All", value: undefined },
        { label: "Live", value: "live" },
        { label: "Upcoming", value: "upcoming" },
        { label: "Results", value: "results" },
    ]

    const filtered = matches.filter((m) => {
        if (!status || status === "all") return true
        if (status === "live") return m.status === "LIVE"
        if (status === "upcoming") return m.status === "SCHEDULED"
        if (status === "results") return m.status === "FINISHED"
        return true
    })

    const live = matches.filter((m) => m.status === "LIVE")

    function buildHref(params: Record<string, string | undefined>) {
        const q = new URLSearchParams()
        const merged = { status, tournament, ageGroup, ...params }
        for (const [k, v] of Object.entries(merged)) {
            if (v) q.set(k, v)
        }
        const str = q.toString()
        return `/fixtures${str ? `?${str}` : ""}`
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-sans font-bold text-3xl mb-1">Fixtures</h1>
                <p className="font-sans font-light text-muted-foreground">
                    Schedule and results
                </p>
            </div>

            {/* Live alert */}
            {live.length > 0 && (
                <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/30 rounded-xl">
                    <span className="size-2 rounded-full bg-primary animate-[blink_1.2s_ease-in-out_infinite] shrink-0" />
                    <p className="text-sm font-medium text-primary">
                        {live.length} match{live.length !== 1 ? "es" : ""} live now
                    </p>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {/* Status tabs */}
                <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                    {tabs.map((tab) => {
                        const active = (status ?? "all") === (tab.value ?? "all")
                        return (
                            <Link
                                key={tab.label}
                                href={buildHref({ status: tab.value })}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    active
                                        ? "bg-card text-foreground font-medium shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {tab.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Tournament filter */}
                {tournaments.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                        {tournaments.map((t) => (
                            <Link
                                key={t.id}
                                href={buildHref({ tournament: tournament === t.id ? undefined : t.id })}
                                className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                                    tournament === t.id
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "border-border text-muted-foreground hover:text-foreground hover:border-ring"
                                }`}
                            >
                                {t.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Match list */}
            {filtered.length === 0 ? (
                <div className="py-20 flex flex-col items-center gap-4 text-center">
                    <Calendar size={32} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">No fixtures found</p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Check back soon — fixtures will appear here once scheduled.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map((match) => {
                        const d = match.scheduledAt
                            ? new Date(match.scheduledAt).toLocaleDateString("en-GB", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                              })
                            : "TBC"
                        const t = match.scheduledAt
                            ? new Date(match.scheduledAt).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                              })
                            : ""

                        return (
                            <div
                                key={match.id}
                                className="bg-card border border-border rounded-xl px-4 py-4 flex items-center gap-4"
                            >
                                {/* Date */}
                                <div className="w-16 text-center shrink-0">
                                    <p className="text-[0.75rem] text-muted-foreground">{d}</p>
                                    {t && (
                                        <p className="font-mono text-xs text-muted-foreground">{t}</p>
                                    )}
                                </div>

                                {/* Teams & score */}
                                <div className="flex-1 flex items-center gap-3 min-w-0">
                                    <span className="font-medium text-sm text-right flex-1 truncate">
                                        {match.homeTeam.name}
                                    </span>

                                    {match.status !== "SCHEDULED" ? (
                                        <span className="font-mono font-bold text-lg shrink-0 tabular-nums">
                                            {match.homeScore} – {match.awayScore}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground text-sm shrink-0">
                                            vs
                                        </span>
                                    )}

                                    <span className="font-medium text-sm flex-1 truncate">
                                        {match.awayTeam.name}
                                    </span>
                                </div>

                                {/* Meta */}
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <MatchStatusBadge status={match.status} />
                                    {match.status === "SCHEDULED" && (
                                        <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-0.5">
                                            Scheduled
                                        </span>
                                    )}
                                    <span className="text-[0.6875rem] text-muted-foreground">
                                        {match.tournament.name}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
