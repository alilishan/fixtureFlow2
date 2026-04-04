import { db } from "@/lib/db"
import Link from "next/link"
import { ChevronRight, Shield } from "lucide-react"
import { CreateTeamDialog, TeamActions } from "@/components/dashboard/team-dialogs"
import { getActiveSeason } from "@/lib/get-active-season"

export default async function TeamsPage() {
    const activeSeason = await getActiveSeason()

    const [teams, ageGroups, coaches] = await Promise.all([
        db.team.findMany({
            where: { OR: [{ season: activeSeason }, { season: null }] },
            orderBy: [{ ageGroup: { name: "asc" } }, { name: "asc" }],
            include: {
                ageGroup: true,
                coach: true,
                _count: { select: { players: true } },
            },
        }),
        db.ageGroup.findMany({ orderBy: { name: "asc" } }),
        db.user.findMany({
            where: { role: "COACH" },
            orderBy: { name: "asc" },
        }),
    ])

    return (
        <div>
            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="font-sans text-base font-light text-muted-foreground">
                        All registered teams
                    </p>
                </div>
                <CreateTeamDialog ageGroups={ageGroups} coaches={coaches} season={activeSeason} />
            </div>

            {teams.length === 0 ? (
                <div className="py-20 flex flex-col items-center gap-4 text-center">
                    <Shield size={32} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">No teams yet</p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Create an age group first, then add teams.
                    </p>
                </div>
            ) : (
                <div className="border border-border">
                    <table className="table-sport w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left">Team</th>
                                <th className="text-left">Age Group</th>
                                <th className="text-left">Coach</th>
                                <th className="text-left">Players</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team) => (
                                <tr key={team.id}>
                                    <td>
                                        <Link
                                            href={`/dashboard/teams/${team.id}`}
                                            className="font-medium hover:text-primary transition-colors flex items-center gap-1"
                                        >
                                            {team.name}
                                            <ChevronRight
                                                size={12}
                                                className="text-muted-foreground"
                                            />
                                        </Link>
                                    </td>
                                    <td className="text-muted-foreground">{team.ageGroup.name}</td>
                                    <td className="text-muted-foreground">
                                        {team.coach?.name ?? "—"}
                                    </td>
                                    <td className="font-score">{team._count.players}</td>
                                    <td className="text-right">
                                        <TeamActions
                                            team={team}
                                            ageGroups={ageGroups}
                                            coaches={coaches}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
