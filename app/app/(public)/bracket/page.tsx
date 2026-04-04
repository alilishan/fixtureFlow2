import { db } from "@/lib/db"
import Link from "next/link"
import { Construction } from "lucide-react"

export default async function PublicBracketPage() {
    const cups = await db.tournament.findMany({
        where: { type: { in: ["CUP", "LEAGUE_CUP"] } },
        orderBy: { name: "asc" },
    })

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-display text-3xl mb-1">Bracket</h1>
                <p className="font-sans font-light text-muted-foreground">
                    Cup knockout rounds
                </p>
            </div>

            <div className="py-20 flex flex-col items-center gap-4 text-center">
                <Construction size={32} className="text-muted-foreground" />
                <p className="font-medium text-foreground">Bracket view coming soon</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Visual knockout brackets are in development.
                    {cups.length > 0 && " In the meantime, fixtures are available on the fixtures page."}
                </p>
                {cups.length > 0 && (
                    <Link
                        href="/fixtures"
                        className="text-sm text-primary hover:underline mt-2"
                    >
                        View all fixtures →
                    </Link>
                )}
            </div>
        </div>
    )
}
