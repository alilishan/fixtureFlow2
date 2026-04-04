"use client"

import { useRef, useState, useTransition } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { createUser, deleteUser } from "@/lib/actions/users"
import { toast } from "sonner"

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

export function CreateUserDialog() {
    const [open, setOpen] = useState(false)
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    function action(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await createUser(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                formRef.current?.reset()
                toast.success("User created")
                setOpen(false)
            }
        })
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus size={14} />
                New User
            </Button>
            <Dialog open={open} onOpenChange={setOpen} title="NEW USER">
                <form ref={formRef} action={action} className="flex flex-col gap-4">
                    <Field label="Name *">
                        <input name="name" className={inputCls} />
                    </Field>
                    <Field label="Email *">
                        <input name="email" type="email" className={inputCls} />
                    </Field>
                    <Field label="Password *">
                        <input
                            name="password"
                            type="password"
                            className={inputCls}
                            placeholder="Min. 8 characters"
                        />
                    </Field>
                    <Field label="Role *">
                        <select name="role" className={inputCls}>
                            <option value="ORGANISER">Organiser</option>
                            <option value="COACH">Coach</option>
                            <option value="VIEWER">Viewer</option>
                        </select>
                    </Field>
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <Button type="submit" disabled={pending}>
                        {pending ? "Creating…" : "Create User"}
                    </Button>
                </form>
            </Dialog>
        </>
    )
}

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
    const [open, setOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteUser(userId)
            if (result?.error) toast.error(result.error)
            else toast.success("User deleted")
            setOpen(false)
        })
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
            >
                <Trash2 size={14} />
            </button>
            <Dialog open={open} onOpenChange={setOpen} title="DELETE USER">
                <p className="text-sm text-muted-foreground mb-6">
                    Delete <strong className="text-foreground">{userName}</strong>? They will lose
                    access immediately.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={pending}>
                        {pending ? "Deleting…" : "Delete"}
                    </Button>
                </div>
            </Dialog>
        </>
    )
}
