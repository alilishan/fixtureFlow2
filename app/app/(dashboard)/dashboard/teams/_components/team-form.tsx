"use client"

import { useRef, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { createTeam, updateTeam } from "@/lib/actions/teams"
import { toast } from "sonner"

type AgeGroup = { id: string; name: string }
type Coach = { id: string; name: string | null }
type Team = { id: string; name: string; ageGroupId: string; coachOfTeamId?: string | null }

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

const inputCls =
    "h-9 px-3 bg-input border border-border text-sm text-foreground outline-none focus:border-ring transition-colors"

export function CreateTeamForm({
    ageGroups,
    coaches,
    onSuccess,
}: {
    ageGroups: AgeGroup[]
    coaches: Coach[]
    onSuccess?: () => void
}) {
    const formRef = useRef<HTMLFormElement>(null)
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    function action(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await createTeam(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                formRef.current?.reset()
                toast.success("Team created")
                onSuccess?.()
            }
        })
    }

    return (
        <form ref={formRef} action={action} className="flex flex-col gap-4">
            <Field label="Team Name *">
                <input name="name" className={inputCls} placeholder="e.g. Eagles FC" />
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
            {coaches.length > 0 && (
                <Field label="Coach">
                    <select name="coachId" className={inputCls}>
                        <option value="">No coach assigned</option>
                        {coaches.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </Field>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={pending}>
                {pending ? "Creating…" : "Create"}
            </Button>
        </form>
    )
}

export function EditTeamForm({
    team,
    ageGroups,
    coaches,
    onSuccess,
}: {
    team: Team
    ageGroups: AgeGroup[]
    coaches: Coach[]
    onSuccess?: () => void
}) {
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const action = updateTeam.bind(null, team.id)

    function handleAction(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await action(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                toast.success("Team updated")
                onSuccess?.()
            }
        })
    }

    return (
        <form action={handleAction} className="flex flex-col gap-4">
            <Field label="Team Name *">
                <input name="name" defaultValue={team.name} className={inputCls} />
            </Field>
            <Field label="Age Group *">
                <select name="ageGroupId" defaultValue={team.ageGroupId} className={inputCls}>
                    {ageGroups.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                            {ag.name}
                        </option>
                    ))}
                </select>
            </Field>
            {coaches.length > 0 && (
                <Field label="Coach">
                    <select
                        name="coachId"
                        defaultValue={team.coachOfTeamId ?? ""}
                        className={inputCls}
                    >
                        <option value="">No coach assigned</option>
                        {coaches.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </Field>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save Changes"}
            </Button>
        </form>
    )
}
