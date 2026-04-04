import { db } from "@/lib/db"
import Link from "next/link"
import { BarChart2 } from "lucide-react"
import { computeStandings } from "@/lib/standings"

type Props = { searchParams: Promise<{ tournament?: string }> }

export default async function PublicStandingsPage({ searchParams }: Props) {
    const { tournament: selectedTournamentId } = await searchParams

    const tournaments = await db.tournament.findMany({
        where: { type: { in: ["LEAGUE", "LEAGUE_CUP"] } },
        orderBy: { name: "asc" },
        include: {
            ageGroup: true,
            teams: { include: { team: true } },
            matches: {
                select: {
                    homeTeamId: true,
                    awayTeamId: true,
                    homeScore: true,
                    awayScore: true,
                    status: true,
                    updatedAt: true,
                },
            },
        },
    })

    const activeTournament =
        tournaments.find((t) => t.id === selectedTournamentId) ?? tournaments[0]

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-sans font-bold text-3xl mb-1">Standings</h1>
                <p className="font-sans font-light text-muted-foreground">
                    League tables
                </p>
            </div>

            {tournaments.length === 0 ? (
                <div className="py-20 flex flex-col items-center gap-4 text-center">
                    <BarChart2 size={32} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">No standings available yet</p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        League tables will appear here once matches have been played.
                    </p>
                </div>
            ) : (
                <>
                    {/* Tournament tabs */}
                    {tournaments.length > 1 && (
                        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 w-fit mb-6 flex-wrap">
                            {tournaments.map((t) => {
                                const active = t.id === activeTournament?.id
                                return (
                                    <Link
                                        key={t.id}
                                        href={`/standings?tournament=${t.id}`}
                                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                            active
                                                ? "bg-card text-foreground font-medium shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {t.name}
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {activeTournament && (() => {
                        const teams = activeTournament.teams.map((tt) => tt.team)
                        const standings = computeStandings(teams, activeTournament.matches)

                        return (
                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-border">
                                    <p className="font-medium text-sm">{activeTournament.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {activeTournament.ageGroup.name}
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/30 text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
                                                <th className="text-left px-4 py-2.5 w-8">#</th>
                                                <th className="text-left px-4 py-2.5">Team</th>
                                                <th className="text-center px-3 py-2.5">P</th>
                                                <th className="text-center px-3 py-2.5">W</th>
                                                <th className="text-center px-3 py-2.5">D</th>
                                                <th className="text-center px-3 py-2.5">L</th>
                                                <th className="text-center px-3 py-2.5 hidden sm:table-cell">GF</th>
                                                <th className="text-center px-3 py-2.5 hidden sm:table-cell">GA</th>
                                                <th className="text-center px-3 py-2.5 hidden sm:table-cell">GD</th>
                                                <th className="text-center px-3 py-2.5 font-bold text-foreground">Pts</th>
                                                <th className="text-center px-3 py-2.5 hidden md:table-cell">Form</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {standings.map((row, i) => (
                                                <tr
                                                    key={row.teamId}
                                                    className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                                                >
                                                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                                                        {i + 1}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-sm">
                                                        {row.teamName}
                                                    </td>
                                                    <td className="px-3 py-3 text-center font-mono text-sm">
                                                        {row.played}
                                                    </td>
                                                    <td className="px-3 py-3 text-center font-mono text-sm text-[var(--win)]">
                                                        {row.won}
                                                    </td>
                                                    <td className="px-3 py-3 text-center font-mono text-sm text-muted-foreground">
                                                        {row.drawn}
                                                    </td>
                                                    <td className="px-3 py-3 text-center font-mono text-sm text-[var(--loss)]">
                                                        {row.lost}
                                                    </td>
                                                    <td className="px-3 py-3 text-center font-mono text-sm hidden sm:table-cell">
                                                        {row.goalsFor}
                                                    </td>
                                                    <td className="px-3 py-3 text-center font-mono text-sm hidden sm:table-cell">
                                                        {row.goalsAgainst}
                                                    </td>
                                                    <td className="px-3 py-3 text-center font-mono text-sm hidden sm:table-cell">
                                                        {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                                                    </td>
                                                    <td className="px-3 py-3 text-center font-mono font-bold text-sm">
                                                        {row.points}
                                                    </td>
                                                    <td className="px-3 py-3 hidden md:table-cell">
                                                        <div className="flex items-center justify-center gap-0.5">
                                                            {row.form.map((r, j) => (
                                                                <span
                                                                    key={j}
                                                                    className={`size-5 rounded-sm text-[0.5625rem] font-bold flex items-center justify-center text-white ${
                                                                        r === "W"
                                                                            ? "bg-[var(--win)]"
                                                                            : r === "D"
                                                                              ? "bg-[var(--draw)]"
                                                                              : "bg-[var(--loss)]"
                                                                    }`}
                                                                >
                                                                    {r}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    })()}
                </>
            )}
        </div>
    )
}
