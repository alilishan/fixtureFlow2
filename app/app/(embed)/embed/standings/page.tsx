import { db } from "@/lib/db"
import { computeStandings } from "@/lib/standings"

type Props = { searchParams: Promise<{ tournament?: string }> }

export default async function EmbedStandingsPage({ searchParams }: Props) {
    const { tournament: tournamentId } = await searchParams

    const tournament = tournamentId
        ? await db.tournament.findUnique({
              where: { id: tournamentId },
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
        : await db.tournament.findFirst({
              where: { type: { in: ["LEAGUE", "LEAGUE_CUP"] } },
              orderBy: { createdAt: "desc" },
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

    if (!tournament) {
        return (
            <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                No standings available.
            </div>
        )
    }

    const teams = tournament.teams.map((tt) => tt.team)
    const standings = computeStandings(teams, tournament.matches)

    return (
        <div className="min-h-0">
            <div className="px-3 py-2 border-b border-border">
                <p className="font-medium text-xs">{tournament.name}</p>
                <p className="text-[0.625rem] text-muted-foreground">{tournament.ageGroup.name}</p>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="border-b border-border bg-muted/30 text-[0.5625rem] uppercase tracking-widest text-muted-foreground">
                        <th className="text-left px-3 py-2 w-6">#</th>
                        <th className="text-left px-3 py-2">Team</th>
                        <th className="text-center px-2 py-2">P</th>
                        <th className="text-center px-2 py-2">W</th>
                        <th className="text-center px-2 py-2">D</th>
                        <th className="text-center px-2 py-2">L</th>
                        <th className="text-center px-2 py-2">GD</th>
                        <th className="text-center px-2 py-2 font-bold text-foreground">Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((row, i) => (
                        <tr
                            key={row.teamId}
                            className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                        >
                            <td className="px-3 py-2 text-[0.6875rem] text-muted-foreground font-mono">{i + 1}</td>
                            <td className="px-3 py-2 font-medium text-xs truncate max-w-[100px]">{row.teamName}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs">{row.played}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-[var(--win)]">{row.won}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-muted-foreground">{row.drawn}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs text-[var(--loss)]">{row.lost}</td>
                            <td className="px-2 py-2 text-center font-mono text-xs">
                                {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                            </td>
                            <td className="px-2 py-2 text-center font-mono font-bold text-xs">{row.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="border-t border-border px-3 py-2 flex justify-end">
                <span className="font-display text-[0.5625rem] tracking-[0.06em] text-muted-foreground select-none">
                    <span>Fixture</span>
                    <span className="text-primary">Flow</span>
                </span>
            </div>
        </div>
    )
}
