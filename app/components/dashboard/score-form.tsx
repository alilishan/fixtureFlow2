"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { updateMatchScore } from "@/lib/actions/matches"
import { toast } from "sonner"

type Match = {
    id: string
    homeScore: number | null
    awayScore: number | null
    status: string
    homeTeam: { name: string }
    awayTeam: { name: string }
}

const inputCls =
    "h-12 w-16 px-3 bg-input border border-border text-center font-score text-xl text-foreground outline-none focus:border-ring transition-colors"

export function ScoreForm({ match }: { match: Match }) {
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const action = updateMatchScore.bind(null, match.id)

    function handleAction(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await action(formData)
            if (result?.error) setError(result.error)
            else toast.success("Score updated")
        })
    }

    return (
        <form action={handleAction} className="bg-card border border-border p-6">
            <h2 className="font-display text-sm tracking-wider mb-5 text-muted-foreground">
                UPDATE SCORE
            </h2>

            {/* Score display */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center flex-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 truncate">
                        {match.homeTeam.name}
                    </p>
                    <input
                        name="homeScore"
                        type="number"
                        min={0}
                        max={99}
                        defaultValue={match.homeScore ?? 0}
                        className={inputCls}
                    />
                </div>
                <span className="font-score text-2xl text-muted-foreground">–</span>
                <div className="text-center flex-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 truncate">
                        {match.awayTeam.name}
                    </p>
                    <input
                        name="awayScore"
                        type="number"
                        min={0}
                        max={99}
                        defaultValue={match.awayScore ?? 0}
                        className={inputCls}
                    />
                </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Status
                </label>
                <select
                    name="status"
                    defaultValue={match.status}
                    className="h-9 px-3 bg-input border border-border text-sm text-foreground outline-none focus:border-ring transition-colors"
                >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="LIVE">Live</option>
                    <option value="FINISHED">Finished</option>
                </select>
            </div>

            {error && <p className="text-xs text-destructive mb-3">{error}</p>}

            <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Saving…" : "Save Score"}
            </Button>
        </form>
    )
}
