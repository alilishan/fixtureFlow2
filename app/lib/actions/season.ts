"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function setActiveSeason(season: string) {
    const store = await cookies()
    store.set("active-season", season, { path: "/", maxAge: 60 * 60 * 24 * 365 })
    revalidatePath("/dashboard", "layout")
}
