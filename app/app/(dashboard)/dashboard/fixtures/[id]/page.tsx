import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, MapPin, Calendar } from "lucide-react"
import { ScoreForm } from "@/components/dashboard/score-form"
import { MatchStatusBadge } from "@/components/dashboard/match-status-badge"

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const match = await db.match.findUnique({
        where: { id },
        include: {
            homeTeam: true,
            awayTeam: true,
            tournament: { include: { ageGroup: true } },
        },
    })

    if (!match) notFound()

    return (
        <div>
            <Link
                href="/dashboard/fixtures"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ChevronLeft size={14} />
                Fixtures
            </Link>

            {/* Match hero */}
            <div className="bg-card border border-border p-6 mb-6">
                <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {match.tournament.name}
                    </span>
                    {match.round && (
                        <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{match.round}</span>
                        </>
                    )}
                    <MatchStatusBadge status={match.status} />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <p className="font-display text-xl flex-1">{match.homeTeam.name}</p>

                    {match.status !== "SCHEDULED" ? (
                        <div className="font-score text-4xl px-4">
                            {match.homeScore ?? 0} – {match.awayScore ?? 0}
                        </div>
                    ) : (
                        <div className="text-muted-foreground text-sm px-4">vs</div>
                    )}

                    <p className="font-display text-xl flex-1 text-right">{match.awayTeam.name}</p>
                </div>

                <div className="flex items-center gap-4 mt-5 text-xs text-muted-foreground">
                    {match.scheduledAt && (
                        <span className="flex items-center gap-1.5">
                            <Calendar size={12} />
                            {new Date(match.scheduledAt).toLocaleDateString("en-GB", {
                                weekday: "short",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    )}
                    {match.venue && (
                        <span className="flex items-center gap-1.5">
                            <MapPin size={12} />
                            {match.venue}
                        </span>
                    )}
                </div>
            </div>

            {/* Score update form */}
            <div className="max-w-sm">
                <ScoreForm match={match} />
            </div>
        </div>
    )
}
