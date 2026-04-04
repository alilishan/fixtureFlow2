import { db } from "@/lib/db"
import { getActiveSeason } from "@/lib/get-active-season"
import { Trophy, Target, AlertTriangle, TrendingUp } from "lucide-react"

// ── Data fetching ────────────────────────────────────────────────

async function getTopScorers(season: string) {
    const events = await db.goalEvent.findMany({
        where: { type: "GOAL", match: { tournament: { season } } },
        include: { player: { include: { team: true } } },
    })
    const counts: Record<string, { player: typeof events[0]["player"]; goals: number }> = {}
    for (const e of events) {
        if (!counts[e.playerId]) counts[e.playerId] = { player: e.player, goals: 0 }
        counts[e.playerId].goals++
    }
    return Object.values(counts).sort((a, b) => b.goals - a.goals).slice(0, 10)
}

async function getTopAssists(season: string) {
    const events = await db.goalEvent.findMany({
        where: { type: "ASSIST", match: { tournament: { season } } },
        include: { player: { include: { team: true } } },
    })
    const counts: Record<string, { player: typeof events[0]["player"]; assists: number }> = {}
    for (const e of events) {
        if (!counts[e.playerId]) counts[e.playerId] = { player: e.player, assists: 0 }
        counts[e.playerId].assists++
    }
    return Object.values(counts).sort((a, b) => b.assists - a.assists).slice(0, 10)
}

async function getDisciplinary(season: string) {
    const stats = await db.matchStatistic.findMany({
        where: { match: { tournament: { season } } },
        include: { team: true },
    })
    const counts: Record<string, { team: typeof stats[0]["team"]; yellow: number; red: number }> = {}
    for (const s of stats) {
        if (!counts[s.teamId]) counts[s.teamId] = { team: s.team, yellow: 0, red: 0 }
        counts[s.teamId].yellow += s.yellowCards
        counts[s.teamId].red += s.redCards
    }
    return Object.values(counts)
        .filter((t) => t.yellow > 0 || t.red > 0)
        .sort((a, b) => b.red * 3 + b.yellow - (a.red * 3 + a.yellow))
}

async function getTeamForm(season: string) {
    const matches = await db.match.findMany({
        where: { status: "FINISHED", homeScore: { not: null }, awayScore: { not: null }, tournament: { season } },
        orderBy: { updatedAt: "desc" },
        include: { homeTeam: true, awayTeam: true },
    })

    const form: Record<string, { name: string; results: ("W" | "D" | "L")[]; played: number; won: number }> = {}

    for (const m of matches) {
        const homeWon = m.homeScore! > m.awayScore!
        const draw = m.homeScore! === m.awayScore!

        for (const [teamId, isHome] of [[m.homeTeamId, true], [m.awayTeamId, false]] as [string, boolean][]) {
            const name = isHome ? m.homeTeam.name : m.awayTeam.name
            if (!form[teamId]) form[teamId] = { name, results: [], played: 0, won: 0 }
            form[teamId].played++
            const result = draw ? "D" : (isHome ? homeWon : !homeWon) ? "W" : "L"
            if (result === "W") form[teamId].won++
            if (form[teamId].results.length < 5) form[teamId].results.push(result)
        }
    }

    return Object.values(form)
        .filter((t) => t.played > 0)
        .sort((a, b) => b.won / b.played - a.won / a.played)
}

// ── Section wrapper ───────────────────────────────────────────────

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-border">
                <Icon size={15} className="text-muted-foreground" />
                <h2 className="text-[0.9375rem] font-semibold">{title}</h2>
            </div>
            {children}
        </div>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">{message}</p>
    )
}

// ── Page ─────────────────────────────────────────────────────────

export default async function StatisticsPage() {
    const activeSeason = await getActiveSeason()

    const [scorers, assists, disciplinary, teamForm] = await Promise.all([
        getTopScorers(activeSeason),
        getTopAssists(activeSeason),
        getDisciplinary(activeSeason),
        getTeamForm(activeSeason),
    ])

    return (
        <div>
            <p className="font-sans text-base font-light text-muted-foreground mb-8">
                {activeSeason} season statistics
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Top Scorers */}
                <Section title="Top Scorers" icon={Target}>
                    {scorers.length === 0 ? (
                        <EmptyState message="No goals recorded yet." />
                    ) : (
                        <div className="divide-y divide-border">
                            {scorers.map((row, i) => (
                                <div key={row.player.id} className="flex items-center gap-3 px-4 py-2.5">
                                    <span className="font-mono text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{row.player.name}</p>
                                        <p className="text-xs text-muted-foreground">{row.player.team.name}</p>
                                    </div>
                                    <span className="font-mono font-bold text-lg text-foreground">{row.goals}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                {/* Top Assists */}
                <Section title="Top Assists" icon={TrendingUp}>
                    {assists.length === 0 ? (
                        <EmptyState message="No assists recorded yet." />
                    ) : (
                        <div className="divide-y divide-border">
                            {assists.map((row, i) => (
                                <div key={row.player.id} className="flex items-center gap-3 px-4 py-2.5">
                                    <span className="font-mono text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{row.player.name}</p>
                                        <p className="text-xs text-muted-foreground">{row.player.team.name}</p>
                                    </div>
                                    <span className="font-mono font-bold text-lg text-foreground">{row.assists}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                {/* Team Form */}
                <Section title="Team Form" icon={Trophy}>
                    {teamForm.length === 0 ? (
                        <EmptyState message="No results yet." />
                    ) : (
                        <div className="divide-y divide-border">
                            {teamForm.map((row) => (
                                <div key={row.name} className="flex items-center gap-3 px-4 py-2.5">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{row.name}</p>
                                        <p className="text-xs text-muted-foreground">{row.played} played · {row.won} won</p>
                                    </div>
                                    <div className="flex items-center gap-0.5 shrink-0">
                                        {row.results.map((r, i) => (
                                            <span
                                                key={i}
                                                className={`size-5 rounded-sm text-[0.5625rem] font-bold flex items-center justify-center text-white ${
                                                    r === "W" ? "bg-[var(--win)]" : r === "D" ? "bg-[var(--draw)]" : "bg-[var(--loss)]"
                                                }`}
                                            >
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                {/* Disciplinary */}
                <Section title="Disciplinary" icon={AlertTriangle}>
                    {disciplinary.length === 0 ? (
                        <EmptyState message="No cards recorded yet." />
                    ) : (
                        <div className="divide-y divide-border">
                            {disciplinary.map((row) => (
                                <div key={row.team.id} className="flex items-center gap-3 px-4 py-2.5">
                                    <p className="text-sm font-medium flex-1 truncate">{row.team.name}</p>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-3.5 rounded-sm bg-[var(--draw)]" />
                                            <span className="font-mono text-sm font-semibold">{row.yellow}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-3.5 rounded-sm bg-[var(--loss)]" />
                                            <span className="font-mono text-sm font-semibold">{row.red}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

            </div>
        </div>
    )
}
