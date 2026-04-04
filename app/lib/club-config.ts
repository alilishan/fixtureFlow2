import { clientEnv } from "@/lib/env.client"

export const clubConfig = {
    name: clientEnv.NEXT_PUBLIC_CLUB_NAME,
    tagline: clientEnv.NEXT_PUBLIC_CLUB_TAGLINE,
    primaryColor: clientEnv.NEXT_PUBLIC_CLUB_PRIMARY_COLOR,
    logoUrl: clientEnv.NEXT_PUBLIC_CLUB_LOGO_URL,
    appUrl: clientEnv.NEXT_PUBLIC_APP_URL,
} as const

export type ClubConfig = typeof clubConfig
