/**
 * Client-side environment validation.
 * Safe to import in both server and client components.
 * NEXT_PUBLIC_* vars are inlined at build time by Next.js — they must be
 * referenced explicitly (not dynamically) so the bundler can substitute them.
 */
import { z } from "zod"

const schema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
    NEXT_PUBLIC_CLUB_NAME: z.string().default("FixtureFlow FC"),
    NEXT_PUBLIC_CLUB_TAGLINE: z.string().default(""),
    NEXT_PUBLIC_CLUB_PRIMARY_COLOR: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex colour")
        .default("#e84422"),
    NEXT_PUBLIC_CLUB_LOGO_URL: z.string().default(""),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
})

// Each var must be listed explicitly — Next.js replaces them statically at build time
const parsed = schema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CLUB_NAME: process.env.NEXT_PUBLIC_CLUB_NAME,
    NEXT_PUBLIC_CLUB_TAGLINE: process.env.NEXT_PUBLIC_CLUB_TAGLINE,
    NEXT_PUBLIC_CLUB_PRIMARY_COLOR: process.env.NEXT_PUBLIC_CLUB_PRIMARY_COLOR,
    NEXT_PUBLIC_CLUB_LOGO_URL: process.env.NEXT_PUBLIC_CLUB_LOGO_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
})

if (!parsed.success) {
    const missing = parsed.error.issues
        .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
        .join("\n")
    throw new Error(`Missing or invalid public environment variables:\n${missing}`)
}

export const clientEnv = parsed.data
