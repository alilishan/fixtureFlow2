import { db } from "@/lib/db"
import { getSeasonLabel } from "@/lib/season"
import { getActiveSeason } from "@/lib/get-active-season"
import { SeasonsManager } from "@/components/dashboard/seasons-manager"

export default async function SettingsPage() {
    const currentSeason = getSeasonLabel()
    const activeSeason = await getActiveSeason()

    const rows = await db.tournament.findMany({ select: { season: true } })
    const seasons = [
        ...new Set(rows.map((r) => r.season ?? currentSeason)),
    ].sort().reverse()

    if (!seasons.includes(currentSeason)) seasons.unshift(currentSeason)

    return (
        <div className="max-w-xl">
            <p className="font-sans text-base font-light text-muted-foreground mb-8">
                Club configuration
            </p>

            {/* Seasons */}
            <section>
                <h2 className="font-display text-lg mb-1">Seasons</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Seasons group your tournaments. The active season filters the dashboard.
                </p>
                <SeasonsManager seasons={seasons} activeSeason={activeSeason} currentSeason={currentSeason} />
            </section>
        </div>
    )
}
