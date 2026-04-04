"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createSchema = z.object({
    tournamentId: z.string().min(1),
    homeTeamId: z.string().min(1, "Home team is required"),
    awayTeamId: z.string().min(1, "Away team is required"),
    scheduledAt: z.string().optional().nullable(),
    venue: z.string().max(100).optional().nullable(),
    round: z.string().max(50).optional().nullable(),
})

const scoreSchema = z.object({
    homeScore: z.coerce.number().int().min(0),
    awayScore: z.coerce.number().int().min(0),
    status: z.enum(["SCHEDULED", "LIVE", "FINISHED"]),
})

async function requireOrganiser() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ORGANISER") {
        throw new Error("Unauthorised")
    }
}

export async function createMatch(formData: FormData) {
    await requireOrganiser()

    const parsed = createSchema.safeParse({
        tournamentId: formData.get("tournamentId"),
        homeTeamId: formData.get("homeTeamId"),
        awayTeamId: formData.get("awayTeamId"),
        scheduledAt: formData.get("scheduledAt") || null,
        venue: formData.get("venue") || null,
        round: formData.get("round") || null,
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }
    if (parsed.data.homeTeamId === parsed.data.awayTeamId) {
        return { error: "Home and away team cannot be the same" }
    }

    const data = {
        ...parsed.data,
        scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
    }

    await db.match.create({ data })
    revalidatePath(`/dashboard/tournaments/${parsed.data.tournamentId}`)
    revalidatePath("/dashboard/fixtures")
    return { success: true }
}

export async function updateMatchScore(id: string, formData: FormData) {
    await requireOrganiser()

    const parsed = scoreSchema.safeParse({
        homeScore: formData.get("homeScore"),
        awayScore: formData.get("awayScore"),
        status: formData.get("status"),
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const match = await db.match.update({ where: { id }, data: parsed.data })
    revalidatePath(`/dashboard/fixtures/${id}`)
    revalidatePath(`/dashboard/tournaments/${match.tournamentId}`)
    revalidatePath("/dashboard/fixtures")
    return { success: true }
}

export async function deleteMatch(id: string, tournamentId: string) {
    await requireOrganiser()
    await db.match.delete({ where: { id } })
    revalidatePath(`/dashboard/tournaments/${tournamentId}`)
    revalidatePath("/dashboard/fixtures")
    return { success: true }
}
