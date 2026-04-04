"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

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
