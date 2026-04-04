import { db } from "@/lib/db"
import { CreateAgeGroupDialog } from "./_components/create-age-group-dialog"
import { AgeGroupActions } from "./_components/age-group-actions"

export default async function AgeGroupsPage() {
    const ageGroups = await db.ageGroup.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { teams: true } } },
    })

    return (
        <div>
            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="font-sans text-base font-light text-muted-foreground">
                        Manage age group categories
                    </p>
                </div>
                <CreateAgeGroupDialog />
            </div>

            {ageGroups.length === 0 ? (
                <div className="border border-border py-16 text-center">
                    <p className="text-muted-foreground text-sm">No age groups yet.</p>
                    <p className="text-muted-foreground text-xs mt-1">
                        Create one to start adding teams.
                    </p>
                </div>
            ) : (
                <div className="border border-border">
                    <table className="table-sport w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left">Name</th>
                                <th className="text-left">Age Range</th>
                                <th className="text-left">Teams</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ageGroups.map((ag) => (
                                <tr key={ag.id}>
                                    <td className="font-medium">{ag.name}</td>
                                    <td className="text-muted-foreground">
                                        {ag.minAge && ag.maxAge
                                            ? `${ag.minAge}–${ag.maxAge}`
                                            : ag.minAge
                                              ? `${ag.minAge}+`
                                              : ag.maxAge
                                                ? `U${ag.maxAge}`
                                                : "—"}
                                    </td>
                                    <td className="font-score">{ag._count.teams}</td>
                                    <td className="text-right">
                                        <AgeGroupActions ageGroup={ag} />
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
