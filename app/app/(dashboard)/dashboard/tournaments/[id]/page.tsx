import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Calendar } from "lucide-react"
import { TournamentTeamPanel } from "@/components/dashboard/tournament-team-panel"
import { ScheduleMatchDialog } from "@/components/dashboard/schedule-match-dialog"
import { MatchStatusBadge } from "@/components/dashboard/match-status-badge"

const typeLabel: Record<string, string> = {
    LEAGUE: "League",
    CUP: "Cup",
    LEAGUE_CUP: "League Cup",
}

export default async function TournamentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const tournament = await db.tournament.findUnique({
        where: { id },
        include: {
            ageGroup: true,
            teams: { include: { team: true }, orderBy: { team: { name: "asc" } } },
            matches: {
                orderBy: { scheduledAt: "asc" },
                include: { homeTeam: true, awayTeam: true },
            },
        },
    })

    if (!tournament) notFound()

    const enrolledTeamIds = new Set(tournament.teams.map((t) => t.teamId))
    const availableTeams = await db.team.findMany({
        where: { ageGroupId: tournament.ageGroupId, id: { notIn: [...enrolledTeamIds] } },
        orderBy: { name: "asc" },
    })

    const enrolledTeamsForMatch = tournament.teams.map((tt) => tt.team)

    return (
        <div>
            <Link
                href="/dashboard/tournaments"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ChevronLeft size={14} />
                Tournaments
            </Link>

            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="font-sans text-base font-light text-muted-foreground">
                        {tournament.ageGroup.name} · {typeLabel[tournament.type]}
                    </p>
                </div>
                <ScheduleMatchDialog tournamentId={tournament.id} teams={enrolledTeamsForMatch} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Fixtures — 2/3 width */}
                <div className="lg:col-span-2">
                    <div className="section-label mb-5">
                        <span className="font-sans font-semibold text-sm tracking-wider">
                            FIXTURES — {tournament.matches.length}
                        </span>
                    </div>

                    {tournament.matches.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-4 text-center">
                            <Calendar size={32} className="text-muted-foreground" />
                            <p className="font-medium text-foreground">No fixtures yet</p>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Schedule matches using the button above.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {tournament.matches.map((match) => (
                                <Link
                                    key={match.id}
                                    href={`/dashboard/fixtures/${match.id}`}
                                    className="group flex items-center justify-between py-3 px-4 border-b border-border hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="text-xs text-muted-foreground w-20 shrink-0 font-mono">
                                            {match.scheduledAt
                                                ? new Date(match.scheduledAt).toLocaleDateString(
                                                      "en-GB",
                                                      { day: "numeric", month: "short" },
                                                  )
                                                : "TBC"}
                                        </span>
                                        <span className="text-sm truncate">
                                            {match.homeTeam.name}
                                            {match.status !== "SCHEDULED" && (
                                                <span className="font-score mx-2">
                                                    {match.homeScore ?? 0} – {match.awayScore ?? 0}
                                                </span>
                                            )}
                                            {match.status === "SCHEDULED" && (
                                                <span className="text-muted-foreground mx-2">
                                                    vs
                                                </span>
                                            )}
                                            {match.awayTeam.name}
                                        </span>
                                    </div>
                                    <MatchStatusBadge status={match.status} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Teams — 1/3 width */}
                <div>
                    <div className="section-label mb-5">
                        <span className="font-sans font-semibold text-sm tracking-wider">
                            TEAMS — {tournament.teams.length}
                        </span>
                    </div>
                    <TournamentTeamPanel
                        tournamentId={tournament.id}
                        enrolledTeams={tournament.teams}
                        availableTeams={availableTeams}
                    />
                </div>
            </div>
        </div>
    )
}
