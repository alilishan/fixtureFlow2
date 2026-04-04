"use client"

import { useRef, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { createAgeGroup, updateAgeGroup } from "@/lib/actions/age-groups"
import { toast } from "sonner"

type AgeGroup = { id: string; name: string; minAge: number | null; maxAge: number | null }

function FieldRow({
    label,
    name,
    type = "text",
    defaultValue,
    placeholder,
}: {
    label: string
    name: string
    type?: string
    defaultValue?: string | number | null
    placeholder?: string
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
                {label}
            </label>
            <input
                name={name}
                type={type}
                defaultValue={defaultValue ?? ""}
                placeholder={placeholder}
                className="h-9 px-3 bg-input border border-border rounded-lg text-sm text-foreground outline-none focus:border-ring transition-colors"
            />
        </div>
    )
}

export function CreateAgeGroupForm({ onSuccess }: { onSuccess?: () => void }) {
    const formRef = useRef<HTMLFormElement>(null)
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    function action(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await createAgeGroup(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                formRef.current?.reset()
                toast.success("Age group created")
                onSuccess?.()
            }
        })
    }

    return (
        <form ref={formRef} action={action} className="flex flex-col gap-4">
            <FieldRow label="Name *" name="name" placeholder="e.g. Under 12" />
            <div className="grid grid-cols-2 gap-3">
                <FieldRow label="Min Age" name="minAge" type="number" placeholder="8" />
                <FieldRow label="Max Age" name="maxAge" type="number" placeholder="12" />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={pending}>
                {pending ? "Creating…" : "Create"}
            </Button>
        </form>
    )
}

export function EditAgeGroupForm({
    ageGroup,
    onSuccess,
}: {
    ageGroup: AgeGroup
    onSuccess?: () => void
}) {
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const action = updateAgeGroup.bind(null, ageGroup.id)

    function handleAction(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await action(formData)
            if (result?.error) {
                setError(result.error)
            } else {
                toast.success("Age group updated")
                onSuccess?.()
            }
        })
    }

    return (
        <form action={handleAction} className="flex flex-col gap-4">
            <FieldRow label="Name *" name="name" defaultValue={ageGroup.name} />
            <div className="grid grid-cols-2 gap-3">
                <FieldRow
                    label="Min Age"
                    name="minAge"
                    type="number"
                    defaultValue={ageGroup.minAge}
                />
                <FieldRow
                    label="Max Age"
                    name="maxAge"
                    type="number"
                    defaultValue={ageGroup.maxAge}
                />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save Changes"}
            </Button>
        </form>
    )
}
