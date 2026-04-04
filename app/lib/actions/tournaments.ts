"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const schema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    type: z.enum(["LEAGUE", "CUP", "LEAGUE_CUP"]),
    ageGroupId: z.string().min(1, "Age group is required"),
})

async function requireOrganiser() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ORGANISER") {
        throw new Error("Unauthorised")
    }
}

export async function createTournament(formData: FormData) {
    await requireOrganiser()

    const parsed = schema.safeParse({
        name: formData.get("name"),
        type: formData.get("type"),
        ageGroupId: formData.get("ageGroupId"),
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const tournament = await db.tournament.create({ data: parsed.data })
    revalidatePath("/dashboard/tournaments")
    redirect(`/dashboard/tournaments/${tournament.id}`)
}

export async function updateTournament(id: string, formData: FormData) {
    await requireOrganiser()

    const parsed = schema.safeParse({
        name: formData.get("name"),
        type: formData.get("type"),
        ageGroupId: formData.get("ageGroupId"),
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    await db.tournament.update({ where: { id }, data: parsed.data })
    revalidatePath("/dashboard/tournaments")
    revalidatePath(`/dashboard/tournaments/${id}`)
    return { success: true }
}

export async function deleteTournament(id: string) {
    await requireOrganiser()
    await db.tournament.delete({ where: { id } })
    revalidatePath("/dashboard/tournaments")
    redirect("/dashboard/tournaments")
}

export async function addTeamToTournament(tournamentId: string, formData: FormData) {
    await requireOrganiser()

    const teamId = formData.get("teamId") as string
    if (!teamId) return { error: "Select a team" }

    const existing = await db.tournamentTeam.findUnique({
        where: { tournamentId_teamId: { tournamentId, teamId } },
    })
    if (existing) return { error: "Team already in tournament" }

    await db.tournamentTeam.create({ data: { tournamentId, teamId } })
    revalidatePath(`/dashboard/tournaments/${tournamentId}`)
    return { success: true }
}

export async function removeTeamFromTournament(tournamentId: string, teamId: string) {
    await requireOrganiser()
    await db.tournamentTeam.delete({
        where: { tournamentId_teamId: { tournamentId, teamId } },
    })
    revalidatePath(`/dashboard/tournaments/${tournamentId}`)
    return { success: true }
}
