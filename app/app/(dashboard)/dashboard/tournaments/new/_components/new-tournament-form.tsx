"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createTournament } from "@/lib/actions/tournaments"

const inputCls =
    "h-9 px-3 bg-input border border-border text-sm text-foreground outline-none focus:border-ring transition-colors"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
                {label}
            </label>
            {children}
        </div>
    )
}

export function NewTournamentForm({
    ageGroups,
    currentSeason,
}: {
    ageGroups: { id: string; name: string }[]
    currentSeason: string
}) {
    const [error, setError] = useState<string | null>(null)
    const [pending, startTransition] = useTransition()

    function action(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await createTournament(formData)
            if (result?.error) setError(result.error)
            // Success: createTournament redirects server-side
        })
    }

    return (
        <form action={action} className="flex flex-col gap-5">
            <Field label="Season">
                <input
                    name="season"
                    className={inputCls}
                    defaultValue={currentSeason}
                    placeholder="e.g. 2025/26"
                />
            </Field>

            <Field label="Name *">
                <input name="name" className={inputCls} placeholder="e.g. Spring League 2025" />
            </Field>

            <Field label="Type *">
                <select name="type" className={inputCls}>
                    <option value="LEAGUE">League</option>
                    <option value="CUP">Cup</option>
                    <option value="LEAGUE_CUP">League Cup</option>
                </select>
            </Field>

            <Field label="Age Group *">
                <select name="ageGroupId" className={inputCls}>
                    <option value="">Select age group…</option>
                    {ageGroups.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                            {ag.name}
                        </option>
                    ))}
                </select>
            </Field>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={pending}>
                    {pending ? "Creating…" : "Create Tournament"}
                </Button>
                <Button variant="outline" render={<Link href="/dashboard/tournaments" />}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
