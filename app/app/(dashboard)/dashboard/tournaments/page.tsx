import { db } from "@/lib/db"
import Link from "next/link"
import { ChevronRight, Plus, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getActiveSeason } from "@/lib/get-active-season"

const typeLabel: Record<string, string> = {
    LEAGUE: "League",
    CUP: "Cup",
    LEAGUE_CUP: "League Cup",
}

export default async function TournamentsPage() {
    const activeSeason = await getActiveSeason()

    const filtered = await db.tournament.findMany({
        where: { OR: [{ season: activeSeason }, { season: null }] },
        orderBy: { createdAt: "desc" },
        include: {
            ageGroup: true,
            _count: { select: { teams: true, matches: true } },
        },
    })

    return (
        <div>
            <div className="flex items-start justify-between mb-6">
                <p className="font-sans text-base font-light text-muted-foreground">
                    All competitions
                </p>
                <Button nativeButton={false} render={<Link href="/dashboard/tournaments/new" />}>
                    <Plus size={14} />
                    New Tournament
                </Button>
            </div>

            {filtered.length === 0 ? (
                <div className="py-20 flex flex-col items-center gap-4 text-center">
                    <Trophy size={32} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">No tournaments yet</p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Create a tournament to start scheduling fixtures.
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {filtered.map((t) => (
                        <Link
                            key={t.id}
                            href={`/dashboard/tournaments/${t.id}`}
                            className="group flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 hover:border-ring transition-colors"
                        >
                            <div>
                                <p className="font-medium group-hover:text-primary transition-colors">
                                    {t.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {t.ageGroup.name} · {typeLabel[t.type]}
                                    {t.season && ` · ${t.season}`}
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
