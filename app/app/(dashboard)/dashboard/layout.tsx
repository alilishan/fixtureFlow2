import { db } from "@/lib/db"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { getSeasonLabel } from "@/lib/season"
import { getActiveSeason } from "@/lib/get-active-season"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const currentSeason = getSeasonLabel()
    const activeSeason = await getActiveSeason()

    const rows = await db.tournament.findMany({ select: { season: true } })
    const seasons = [
        ...new Set(rows.map((r) => r.season ?? currentSeason)),
    ].sort().reverse()

    // Always include the current season even if no tournaments exist yet
    if (!seasons.includes(currentSeason)) seasons.unshift(currentSeason)

    return (
        <div className="min-h-screen bg-background lg:p-5">
            <div className="flex h-screen lg:h-[calc(100vh-2.5rem)] overflow-hidden">
                <Sidebar seasons={seasons} activeSeason={activeSeason} />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-card lg:rounded-2xl lg:border lg:border-border lg:shadow-float">
                    <Topbar />
                    <div className="flex-1 overflow-y-auto px-6 py-6 mt-14 lg:mt-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
