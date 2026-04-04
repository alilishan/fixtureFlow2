"use client"

import { useRef, useState, useTransition } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { createMatch } from "@/lib/actions/matches"
import { toast } from "sonner"

type Team = { id: string; name: string }

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

export function ScheduleMatchDialog({
    tournamentId,
    teams,
}: {
    tournamentId: string
    teams: Team[]
}) {
    const [open, setOpen] = useState(false)
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    function action(formData: FormData) {
        formData.set("tournamentId", tournamentId)
        setError(null)
        startTransition(async () => {
            const result = await createMatch(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                formRef.current?.reset()
                toast.success("Match scheduled")
                setOpen(false)
            }
        })
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} disabled={teams.length < 2}>
                <Plus size={14} />
                Schedule Match
            </Button>
            <Dialog open={open} onOpenChange={setOpen} title="SCHEDULE MATCH">
                <form ref={formRef} action={action} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Home Team *">
                            <select name="homeTeamId" className={inputCls}>
                                <option value="">Select…</option>
                                {teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Away Team *">
                            <select name="awayTeamId" className={inputCls}>
                                <option value="">Select…</option>
                                {teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>
                    <Field label="Date & Time">
                        <input name="scheduledAt" type="datetime-local" className={inputCls} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Venue">
                            <input
                                name="venue"
                                className={inputCls}
                                placeholder="e.g. Main pitch"
                            />
                        </Field>
                        <Field label="Round">
                            <input name="round" className={inputCls} placeholder="e.g. Week 1" />
                        </Field>
                    </div>
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <Button type="submit" disabled={pending}>
                        {pending ? "Scheduling…" : "Schedule"}
                    </Button>
                </form>
            </Dialog>
        </>
    )
}
