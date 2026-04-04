import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, UserCog } from "lucide-react"
import { AddPlayerDialog, PlayerActions } from "./_components/player-dialogs"

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const team = await db.team.findUnique({
        where: { id },
        include: {
            ageGroup: true,
            coach: true,
            players: { orderBy: [{ squadNumber: "asc" }, { name: "asc" }] },
        },
    })

    if (!team) notFound()

    return (
        <div>
            <Link
                href="/dashboard/teams"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ChevronLeft size={14} />
                Teams
            </Link>

            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="font-sans text-base font-light text-muted-foreground">
                        {team.ageGroup.name}
                        {team.coach && <span> · Coach: {team.coach.name}</span>}
                    </p>
                </div>
                <AddPlayerDialog teamId={team.id} />
            </div>

            {/* Players */}
            <div>
                <div className="section-label mb-5">
                    <span className="font-display text-sm tracking-wider">
                        SQUAD — {team.players.length} player{team.players.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {team.players.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-center">
                        <UserCog size={32} className="text-muted-foreground" />
                        <p className="font-medium text-foreground">No players in squad yet</p>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Add players to build out the squad.
                        </p>
                    </div>
                ) : (
                    <div className="border border-border">
                        <table className="table-sport w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left w-12">#</th>
                                    <th className="text-left">Name</th>
                                    <th className="text-left">Position</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {team.players.map((player) => (
                                    <tr key={player.id}>
                                        <td className="font-score text-muted-foreground">
                                            {player.squadNumber ?? "—"}
                                        </td>
                                        <td className="font-medium">{player.name}</td>
                                        <td className="text-muted-foreground text-xs uppercase tracking-wider">
                                            {player.position ?? "—"}
                                        </td>
                                        <td className="text-right">
                                            <PlayerActions player={player} teamId={team.id} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
