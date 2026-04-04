"use server"

import { Resend } from "resend"
import { z } from "zod"
import { env } from "@/lib/env"

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

export async function submitInterestAction(
    _prevState: { error?: string; success?: boolean } | null,
    formData: FormData
) {
    const parsed = schema.safeParse({ email: formData.get("email") })
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid email" }

    const { email } = parsed.data

    if (!env.RESEND_API_KEY) {
        // No API key configured yet — log and return success so UX isn't broken in dev
        console.log(`[interest] New interest from: ${email}`)
        return { success: true }
    }

    try {
        const resend = new Resend(env.RESEND_API_KEY)

        // Notify you of the new interest
        await resend.emails.send({
            from: env.RESEND_FROM_EMAIL,
            // ⬇ Update this to your personal email to receive interest notifications
            to: env.RESEND_FROM_EMAIL,
            subject: `New FixtureFlow interest: ${email}`,
            html: `
                <p>Someone just expressed interest in FixtureFlow.</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><em>Submitted via the landing page.</em></p>
            `,
        })

        // Send a confirmation to the interested person
        await resend.emails.send({
            from: env.RESEND_FROM_EMAIL,
            to: email,
            subject: "You're on the FixtureFlow early access list",
            html: `
                <p>Hi,</p>
                <p>Thanks for your interest in FixtureFlow — we'll be in touch as we open up access.</p>
                <p>— The FixtureFlow team</p>
            `,
        })
    } catch (err) {
        console.error("[interest] Resend error:", err)
        return { error: "Something went wrong. Please try again." }
    }

    return { success: true }
}
