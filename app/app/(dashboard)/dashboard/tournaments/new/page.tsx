import { db } from "@/lib/db"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { NewTournamentForm } from "./_components/new-tournament-form"

export default async function NewTournamentPage() {
    const ageGroups = await db.ageGroup.findMany({ orderBy: { name: "asc" } })

    return (
        <div className="max-w-lg">
            <Link
                href="/dashboard/tournaments"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ChevronLeft size={14} />
                Tournaments
            </Link>

            <p className="font-sans text-base font-light text-muted-foreground mb-8">Set up a new competition</p>
            <NewTournamentForm ageGroups={ageGroups} />
        </div>
    )
}
