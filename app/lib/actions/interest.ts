"use server"

import { Resend } from "resend"
import { z } from "zod"
import { env } from "@/lib/env"
import { db } from "@/lib/db"

const schema = z.object({
    name:     z.string().min(1, "Please enter your name"),
    email:    z.string().email("Please enter a valid email address"),
    clubName: z.string().optional(),
    message:  z.string().optional(),
})

export async function submitInterestAction(
    _prevState: { error?: string; success?: boolean } | null,
    formData: FormData
) {
    const parsed = schema.safeParse({
        name:     formData.get("name"),
        email:    formData.get("email"),
        clubName: formData.get("clubName") || undefined,
        message:  formData.get("message") || undefined,
    })
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" }

    const { name, email, clubName, message } = parsed.data

    // Always log to DB
    await db.interestSubmission.create({
        data: { name, email, clubName, message },
    })

    if (!env.RESEND_API_KEY) {
        console.log(`[interest] ${name} <${email}>${clubName ? ` — ${clubName}` : ""}`)
        return { success: true }
    }

    try {
        const resend = new Resend(env.RESEND_API_KEY)

        // Notify you
        await resend.emails.send({
            from: env.RESEND_FROM_EMAIL,
            to: env.NOTIFY_EMAIL,
            subject: `New FixtureFlow interest: ${name} (${email})`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${clubName ? `<p><strong>Club:</strong> ${clubName}</p>` : ""}
                ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
            `,
        })

        // Confirm to the person
        await resend.emails.send({
            from: env.RESEND_FROM_EMAIL,
            to: email,
            subject: "You're on the FixtureFlow early access list",
            html: `
                <p>Hi ${name},</p>
                <p>Thanks for your interest in FixtureFlow — we'll be in touch when we're ready to onboard you.</p>
                <p>— The FixtureFlow team</p>
            `,
        })
    } catch (err) {
        console.error("[interest] Resend error:", err)
        // DB already saved — don't fail the user over email
    }

    return { success: true }
}
