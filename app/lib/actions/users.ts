"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"
import { z } from "zod"

const createSchema = z.object({
    name: z.string().min(1, "Name is required").max(80),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["ORGANISER", "COACH", "VIEWER"]),
})

async function requireOrganiser() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ORGANISER") {
        throw new Error("Unauthorised")
    }
}

export async function createUser(formData: FormData) {
    await requireOrganiser()

    const parsed = createSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const existing = await db.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) return { error: "Email already in use" }

    const hashedPassword = await hash(parsed.data.password, 12)
    await db.user.create({
        data: { ...parsed.data, hashedPassword },
    })

    revalidatePath("/dashboard/users")
    return { success: true }
}

export async function deleteUser(id: string) {
    await requireOrganiser()

    const session = await auth()
    if (session?.user?.id === id) return { error: "Cannot delete your own account" }

    await db.user.delete({ where: { id } })
    revalidatePath("/dashboard/users")
    return { success: true }
}
