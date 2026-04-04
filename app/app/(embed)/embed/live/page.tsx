import { db } from "@/lib/db"

export default async function EmbedLivePage() {
    const liveMatches = await db.match.findMany({
        where: { status: "LIVE" },
        include: { homeTeam: true, awayTeam: true, tournament: true },
    })

    return (
        <div className="min-h-0">
            {liveMatches.length === 0 ? (
                <div className="px-3 py-6 text-center">
                    <p className="text-xs text-muted-foreground">No matches live right now.</p>
                </div>
            ) : (
                <div className="divide-y divide-border">
                    {liveMatches.map((match) => (
                        <div key={match.id} className="px-3 py-3">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="size-1.5 rounded-full bg-primary animate-[blink_1.2s_ease-in-out_infinite] shrink-0" />
                                <span className="text-[0.5625rem] font-semibold uppercase tracking-widest text-primary">
                                    Live
                                </span>
                                <span className="text-[0.5625rem] text-muted-foreground ml-auto">
                                    {match.tournament.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-xs flex-1 text-right truncate">
                                    {match.homeTeam.name}
                                </span>
                                <span className="font-mono font-bold text-xl tabular-nums shrink-0">
                                    {match.homeScore ?? 0} – {match.awayScore ?? 0}
                                </span>
                                <span className="font-medium text-xs flex-1 truncate">
                                    {match.awayTeam.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="border-t border-border px-3 py-2 flex justify-end">
                <span className="font-display text-[0.5625rem] tracking-[0.06em] text-muted-foreground select-none">
                    <span>Fixture</span>
                    <span className="text-primary">Flow</span>
                </span>
            </div>
        </div>
    )
}
