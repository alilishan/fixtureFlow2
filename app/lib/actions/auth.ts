"use server"

import { signIn, auth } from "@/lib/auth"
import { AuthError } from "next-auth"
import { compare, hash } from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"

export async function signInAction(_prevState: string | null, formData: FormData) {
    try {
        // signIn from @/lib/auth is the server-side NextAuth function.
        // On success it throws a NEXT_REDIRECT (handled by Next.js, not us).
        // On auth failure it throws AuthError.
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/dashboard",
        })
        return null
    } catch (error) {
        if (error instanceof AuthError) {
            return "Invalid email or password"
        }
        // Re-throw anything else — including NEXT_REDIRECT (the success case)
        throw error
    }
}

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1),
})

export async function changePasswordAction(
    _prevState: { error?: string; success?: string } | null,
    formData: FormData
) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not authenticated" }

    const parsed = changePasswordSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    })
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

    const { currentPassword, newPassword, confirmPassword } = parsed.data

    if (newPassword !== confirmPassword) return { error: "New passwords do not match" }

    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user) return { error: "User not found" }

    const valid = await compare(currentPassword, user.hashedPassword)
    if (!valid) return { error: "Current password is incorrect" }

    const hashedPassword = await hash(newPassword, 12)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword } })

    return { success: "Password changed successfully" }
}
