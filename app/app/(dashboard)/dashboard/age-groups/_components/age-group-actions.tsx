"use client"

import { useState, useTransition } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { EditAgeGroupForm } from "./age-group-form"
import { deleteAgeGroup } from "@/lib/actions/age-groups"
import { toast } from "sonner"

type AgeGroup = { id: string; name: string; minAge: number | null; maxAge: number | null }

export function AgeGroupActions({ ageGroup }: { ageGroup: AgeGroup }) {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    function handleDelete() {
        startTransition(async () => {
            await deleteAgeGroup(ageGroup.id)
            toast.success("Age group deleted")
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

            <Dialog open={editOpen} onOpenChange={setEditOpen} title={`EDIT — ${ageGroup.name}`}>
                <EditAgeGroupForm ageGroup={ageGroup} onSuccess={() => setEditOpen(false)} />
            </Dialog>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen} title="DELETE AGE GROUP">
                <p className="text-sm text-muted-foreground mb-6">
                    Are you sure you want to delete{" "}
                    <strong className="text-foreground">{ageGroup.name}</strong>? This cannot be
                    undone.
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
