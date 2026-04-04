"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { CreateTeamForm, EditTeamForm } from "./team-form"
import { deleteTeam } from "@/lib/actions/teams"
import { toast } from "sonner"

type AgeGroup = { id: string; name: string }
type Coach = { id: string; name: string | null }
type Team = { id: string; name: string; ageGroupId: string; coachOfTeamId?: string | null }

export function CreateTeamDialog({
    ageGroups,
    coaches,
}: {
    ageGroups: AgeGroup[]
    coaches: Coach[]
}) {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus size={14} />
                New Team
            </Button>
            <Dialog open={open} onOpenChange={setOpen} title="NEW TEAM">
                <CreateTeamForm
                    ageGroups={ageGroups}
                    coaches={coaches}
                    onSuccess={() => setOpen(false)}
                />
            </Dialog>
        </>
    )
}

export function TeamActions({
    team,
    ageGroups,
    coaches,
}: {
    team: Team
    ageGroups: AgeGroup[]
    coaches: Coach[]
}) {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    function handleDelete() {
        startTransition(async () => {
            await deleteTeam(team.id)
            toast.success("Team deleted")
            setDeleteOpen(false)
        })
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setEditOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
                <Pencil size={14} />
            </button>
            <button
                onClick={() => setDeleteOpen(true)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
            >
                <Trash2 size={14} />
            </button>

            <Dialog open={editOpen} onOpenChange={setEditOpen} title={`EDIT — ${team.name}`}>
                <EditTeamForm
                    team={team}
                    ageGroups={ageGroups}
                    coaches={coaches}
                    onSuccess={() => setEditOpen(false)}
                />
            </Dialog>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen} title="DELETE TEAM">
                <p className="text-sm text-muted-foreground mb-6">
                    Delete <strong className="text-foreground">{team.name}</strong>? All players and
                    match records for this team will also be removed.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={pending}>
                        {pending ? "Deleting…" : "Delete"}
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}
