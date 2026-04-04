import { cookies } from "next/headers"
import { getSeasonLabel } from "./season"

export async function getActiveSeason(): Promise<string> {
    const store = await cookies()
    return store.get("active-season")?.value ?? getSeasonLabel()
}
