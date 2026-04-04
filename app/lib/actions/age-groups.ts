"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const schema = z.object({
    name: z.string().min(1, "Name is required").max(50),
    minAge: z.coerce.number().int().min(1).max(99).optional().nullable(),
    maxAge: z.coerce.number().int().min(1).max(99).optional().nullable(),
})

async function requireOrganiser() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ORGANISER") {
        throw new Error("Unauthorised")
    }
}

export async function createAgeGroup(formData: FormData) {
    await requireOrganiser()

    const parsed = schema.safeParse({
        name: formData.get("name"),
        minAge: formData.get("minAge") || null,
        maxAge: formData.get("maxAge") || null,
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    await db.ageGroup.create({ data: parsed.data })
    revalidatePath("/dashboard/age-groups")
    return { success: true }
}

export async function updateAgeGroup(id: string, formData: FormData) {
    await requireOrganiser()

    const parsed = schema.safeParse({
        name: formData.get("name"),
        minAge: formData.get("minAge") || null,
        maxAge: formData.get("maxAge") || null,
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    await db.ageGroup.update({ where: { id }, data: parsed.data })
    revalidatePath("/dashboard/age-groups")
    return { success: true }
}

export async function deleteAgeGroup(id: string) {
    await requireOrganiser()
    await db.ageGroup.delete({ where: { id } })
    revalidatePath("/dashboard/age-groups")
    return { success: true }
}
