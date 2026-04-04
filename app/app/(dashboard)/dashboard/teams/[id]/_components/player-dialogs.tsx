"use client"

import { useRef, useState, useTransition } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { createPlayer, updatePlayer, deletePlayer } from "@/lib/actions/players"
import { toast } from "sonner"

type Player = { id: string; name: string; squadNumber: number | null; position: string | null }

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

function PlayerForm({
    teamId,
    player,
    onSuccess,
}: {
    teamId: string
    player?: Player
    onSuccess?: () => void
}) {
    const formRef = useRef<HTMLFormElement>(null)
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    function action(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = player
                ? await updatePlayer(player.id, teamId, formData)
                : await createPlayer(teamId, formData)
            if (result?.error) {
                setError(result.error)
            } else {
                formRef.current?.reset()
                toast.success(player ? "Player updated" : "Player added")
                onSuccess?.()
            }
        })
    }

    return (
        <form ref={formRef} action={action} className="flex flex-col gap-4">
            <Field label="Name *">
                <input name="name" defaultValue={player?.name} className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Squad #">
                    <input
                        name="squadNumber"
                        type="number"
                        defaultValue={player?.squadNumber ?? ""}
                        className={inputCls}
                        min={1}
                        max={99}
                    />
                </Field>
                <Field label="Position">
                    <input
                        name="position"
                        defaultValue={player?.position ?? ""}
                        className={inputCls}
                        placeholder="e.g. GK, MF"
                    />
                </Field>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : player ? "Save Changes" : "Add Player"}
            </Button>
        </form>
    )
}

export function AddPlayerDialog({ teamId }: { teamId: string }) {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus size={14} />
                Add Player
            </Button>
            <Dialog open={open} onOpenChange={setOpen} title="ADD PLAYER">
                <PlayerForm teamId={teamId} onSuccess={() => setOpen(false)} />
            </Dialog>
        </>
    )
}

export function PlayerActions({ player, teamId }: { player: Player; teamId: string }) {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    function handleDelete() {
        startTransition(async () => {
            await deletePlayer(player.id, teamId)
            toast.success("Player removed")
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

            <Dialog open={editOpen} onOpenChange={setEditOpen} title={`EDIT — ${player.name}`}>
                <PlayerForm teamId={teamId} player={player} onSuccess={() => setEditOpen(false)} />
            </Dialog>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen} title="REMOVE PLAYER">
                <p className="text-sm text-muted-foreground mb-6">
                    Remove <strong className="text-foreground">{player.name}</strong> from the
                    squad?
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={pending}>
                        {pending ? "Removing…" : "Remove"}
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}
