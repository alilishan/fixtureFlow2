"use client"

import { useTransition, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addTeamToTournament, removeTeamFromTournament } from "@/lib/actions/tournaments"
import { toast } from "sonner"

type TournamentTeam = { teamId: string; team: { id: string; name: string } }
type AvailableTeam = { id: string; name: string }

const inputCls =
    "h-9 px-3 bg-input border border-border text-sm text-foreground outline-none focus:border-ring transition-colors flex-1"

export function TournamentTeamPanel({
    tournamentId,
    enrolledTeams,
    availableTeams,
}: {
    tournamentId: string
    enrolledTeams: TournamentTeam[]
    availableTeams: AvailableTeam[]
}) {
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const addAction = addTeamToTournament.bind(null, tournamentId)

    function handleAdd(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await addAction(formData)
            if (result?.error) setError(result.error)
            else toast.success("Team added")
        })
    }

    function handleRemove(teamId: string, teamName: string) {
        startTransition(async () => {
            await removeTeamFromTournament(tournamentId, teamId)
            toast.success(`${teamName} removed`)
        })
    }

    return (
        <div>
            {/* Add team form */}
            {availableTeams.length > 0 && (
                <form action={handleAdd} className="flex gap-2 mb-4">
                    <select name="teamId" className={inputCls}>
                        <option value="">Add a team…</option>
                        {availableTeams.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                    <Button type="submit" disabled={pending}>
                        Add
                    </Button>
                </form>
            )}
            {error && <p className="text-xs text-destructive mb-3">{error}</p>}

            {/* Enrolled teams */}
            {enrolledTeams.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center border border-border">
                    No teams enrolled yet.
                </p>
            ) : (
                <div className="border border-border">
                    {enrolledTeams.map((tt, i) => (
                        <div
                            key={tt.teamId}
                            className={`flex items-center justify-between px-4 py-2.5 ${i < enrolledTeams.length - 1 ? "border-b border-border" : ""}`}
                        >
                            <span className="text-sm font-medium">{tt.team.name}</span>
                            <button
                                onClick={() => handleRemove(tt.teamId, tt.team.name)}
                                disabled={pending}
                                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
