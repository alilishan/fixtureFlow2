"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const schema = z.object({
    name: z.string().min(1, "Name is required").max(80),
    squadNumber: z.coerce.number().int().min(1).max(99).optional().nullable(),
    position: z.string().max(30).optional().nullable(),
})

async function requireOrganiser() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ORGANISER") {
        throw new Error("Unauthorised")
    }
}

export async function createPlayer(teamId: string, formData: FormData) {
    await requireOrganiser()

    const parsed = schema.safeParse({
        name: formData.get("name"),
        squadNumber: formData.get("squadNumber") || null,
        position: formData.get("position") || null,
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    await db.player.create({ data: { ...parsed.data, teamId } })
    revalidatePath(`/dashboard/teams/${teamId}`)
    return { success: true }
}

export async function updatePlayer(id: string, teamId: string, formData: FormData) {
    await requireOrganiser()

    const parsed = schema.safeParse({
        name: formData.get("name"),
        squadNumber: formData.get("squadNumber") || null,
        position: formData.get("position") || null,
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    await db.player.update({ where: { id }, data: parsed.data })
    revalidatePath(`/dashboard/teams/${teamId}`)
    return { success: true }
}

export async function deletePlayer(id: string, teamId: string) {
    await requireOrganiser()
    await db.player.delete({ where: { id } })
    revalidatePath(`/dashboard/teams/${teamId}`)
    return { success: true }
}
