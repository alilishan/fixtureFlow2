import { db } from "@/lib/db"
import Link from "next/link"
import { ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const typeLabel: Record<string, string> = {
    LEAGUE: "League",
    CUP: "Cup",
    LEAGUE_CUP: "League Cup",
}

export default async function TournamentsPage() {
    const tournaments = await db.tournament.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            ageGroup: true,
            _count: { select: { teams: true, matches: true } },
        },
    })

    return (
        <div>
            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="font-sans text-base font-light text-muted-foreground">
                        All competitions
                    </p>
                </div>
                <Button render={<Link href="/dashboard/tournaments/new" />}>
                    <Plus size={14} />
                    New Tournament
                </Button>
            </div>

            {tournaments.length === 0 ? (
                <div className="border border-border py-16 text-center">
                    <p className="text-muted-foreground text-sm">No tournaments yet.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {tournaments.map((t) => (
                        <Link
                            key={t.id}
                            href={`/dashboard/tournaments/${t.id}`}
                            className="group flex items-center justify-between bg-card border border-border px-5 py-4 hover:border-ring transition-colors"
                        >
                            <div>
                                <p className="font-medium group-hover:text-primary transition-colors">
                                    {t.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {t.ageGroup.name} · {typeLabel[t.type]}
                                </p>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-center hidden sm:block">
                                    <p className="font-score text-lg">{t._count.teams}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        Teams
                                    </p>
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p className="font-score text-lg">{t._count.matches}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        Matches
                                    </p>
                                </div>
                                <ChevronRight
                                    size={16}
                                    className="text-muted-foreground group-hover:text-primary transition-colors"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
