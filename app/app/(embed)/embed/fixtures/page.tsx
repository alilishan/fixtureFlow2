import { db } from "@/lib/db"
import { MatchStatusBadge } from "@/components/dashboard/match-status-badge"

type Props = {
    searchParams: Promise<{ tournament?: string; ageGroup?: string; limit?: string }>
}

export default async function EmbedFixturesPage({ searchParams }: Props) {
    const { tournament, ageGroup, limit } = await searchParams
    const take = Math.min(parseInt(limit ?? "10", 10) || 10, 50)

    const matches = await db.match.findMany({
        where: {
            ...(tournament ? { tournamentId: tournament } : {}),
            ...(ageGroup ? { tournament: { ageGroupId: ageGroup } } : {}),
        },
        orderBy: { scheduledAt: "asc" },
        take,
        include: { homeTeam: true, awayTeam: true, tournament: true },
    })

    return (
        <div className="min-h-0">
            {matches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-xs">
                    No fixtures scheduled.
                </p>
            ) : (
                <div className="divide-y divide-border">
                    {matches.map((match) => {
                        const d = match.scheduledAt
                            ? new Date(match.scheduledAt).toLocaleDateString("en-GB", {
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
                            <div key={match.id} className="flex items-center gap-3 py-2.5 px-3">
                                <div className="w-12 shrink-0 text-center">
                                    <p className="text-[0.6875rem] text-muted-foreground leading-tight">{d}</p>
                                    {t && <p className="font-mono text-[0.625rem] text-muted-foreground">{t}</p>}
                                </div>
                                <div className="flex-1 flex items-center gap-2 min-w-0">
                                    <span className="font-medium text-xs text-right flex-1 truncate">
                                        {match.homeTeam.name}
                                    </span>
                                    {match.status !== "SCHEDULED" ? (
                                        <span className="font-mono font-bold text-sm shrink-0 tabular-nums">
                                            {match.homeScore} – {match.awayScore}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground text-xs shrink-0">vs</span>
                                    )}
                                    <span className="font-medium text-xs flex-1 truncate">
                                        {match.awayTeam.name}
                                    </span>
                                </div>
                                <div className="shrink-0">
                                    <MatchStatusBadge status={match.status} />
                                    {match.status === "SCHEDULED" && (
                                        <span className="text-[0.5625rem] font-semibold uppercase tracking-widest text-muted-foreground bg-secondary px-1.5 py-0.5">
                                            Soon
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Attribution */}
            <div className="border-t border-border px-3 py-2 flex justify-end">
                <span className="font-display text-[0.5625rem] tracking-[0.06em] text-muted-foreground select-none">
                    <span>Fixture</span>
                    <span className="text-primary">Flow</span>
                </span>
            </div>
        </div>
    )
}
