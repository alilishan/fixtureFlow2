"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const schema = z.object({
    name: z.string().min(1, "Name is required").max(80),
    ageGroupId: z.string().min(1, "Age group is required"),
    coachId: z.string().optional().nullable(),
})

async function requireOrganiser() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ORGANISER") {
        throw new Error("Unauthorised")
    }
}

export async function createTeam(formData: FormData) {
    await requireOrganiser()

    const parsed = schema.safeParse({
        name: formData.get("name"),
        ageGroupId: formData.get("ageGroupId"),
        coachId: formData.get("coachId") || null,
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const { coachId, ...data } = parsed.data
    await db.team.create({
        data: {
            ...data,
            ...(coachId ? { coach: { connect: { id: coachId } } } : {}),
        },
    })
    revalidatePath("/dashboard/teams")
    return { success: true }
}

export async function updateTeam(id: string, formData: FormData) {
    await requireOrganiser()

    const parsed = schema.safeParse({
        name: formData.get("name"),
        ageGroupId: formData.get("ageGroupId"),
        coachId: formData.get("coachId") || null,
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const { coachId, ...data } = parsed.data
    await db.team.update({
        where: { id },
        data: {
            ...data,
            coach: coachId ? { connect: { id: coachId } } : { disconnect: true },
        },
    })
    revalidatePath("/dashboard/teams")
    revalidatePath(`/dashboard/teams/${id}`)
    return { success: true }
}

export async function deleteTeam(id: string) {
    await requireOrganiser()
    await db.team.delete({ where: { id } })
    revalidatePath("/dashboard/teams")
    return { success: true }
}
