"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { CreateAgeGroupForm } from "./age-group-form"

export function CreateAgeGroupDialog() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus size={14} />
                New Age Group
            </Button>
            <Dialog open={open} onOpenChange={setOpen} title="NEW AGE GROUP">
                <CreateAgeGroupForm onSuccess={() => setOpen(false)} />
            </Dialog>
        </>
    )
}
