import { db } from "@/lib/db"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { MatchStatusBadge } from "@/components/dashboard/match-status-badge"
import { getActiveSeason } from "@/lib/get-active-season"

export default async function FixturesPage() {
    const activeSeason = await getActiveSeason()
    const matches = await db.match.findMany({
        where: { tournament: { season: activeSeason } },
        orderBy: { scheduledAt: "asc" },
        include: {
            homeTeam: true,
            awayTeam: true,
            tournament: true,
        },
    })

    // Group by status: live first, then upcoming, then finished
    const live = matches.filter((m) => m.status === "LIVE")
    const upcoming = matches.filter((m) => m.status === "SCHEDULED")
    const finished = matches.filter((m) => m.status === "FINISHED")

    function MatchRow({ match }: { match: (typeof matches)[0] }) {
        return (
            <Link
                href={`/dashboard/fixtures/${match.id}`}
                className="group flex items-center py-3 px-4 border-b border-border hover:bg-muted/30 transition-colors last:border-b-0"
            >
                <span className="text-xs text-muted-foreground w-24 shrink-0 font-mono">
                    {match.scheduledAt
                        ? new Date(match.scheduledAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit",
                          })
                        : "TBC"}
                </span>
                <span className="flex-1 text-sm truncate">
                    {match.homeTeam.name}
                    {match.status !== "SCHEDULED" ? (
                        <span className="font-score mx-3 text-foreground">
                            {match.homeScore ?? 0} – {match.awayScore ?? 0}
                        </span>
                    ) : (
                        <span className="text-muted-foreground mx-3">vs</span>
                    )}
                    {match.awayTeam.name}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block mr-4">
                    {match.tournament.name}
                </span>
                <MatchStatusBadge status={match.status} />
            </Link>
        )
    }

    function Section({ title, items }: { title: string; items: typeof matches }) {
        if (items.length === 0) return null
        return (
            <div className="mb-8">
                <div className="section-label mb-4">
                    <span className="font-sans font-semibold text-sm tracking-wider">
                        {title} — {items.length}
                    </span>
                </div>
                <div className="border border-border">
                    {items.map((m) => (
                        <MatchRow key={m.id} match={m} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <p className="font-sans text-base font-light text-muted-foreground">
                    Schedule and results
                </p>
            </div>

            {matches.length === 0 ? (
                <div className="py-20 flex flex-col items-center gap-4 text-center">
                    <Calendar size={32} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">No fixtures yet</p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Schedule matches from a tournament page.
                    </p>
                </div>
            ) : (
                <>
                    <Section title="LIVE" items={live} />
                    <Section title="UPCOMING" items={upcoming} />
                    <Section title="RESULTS" items={finished} />
                </>
            )}
        </div>
    )
}
