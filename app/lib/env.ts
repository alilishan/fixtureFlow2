/**
 * Server-side environment validation.
 * Import this file in any server module that needs env vars.
 * The app will crash at startup (not at runtime) if required vars are missing.
 *
 * NEVER import this file in a client component — use env.client.ts instead.
 */
import { z } from "zod"

const schema = z.object({
    // ─── Database ─────────────────────────────────────────────
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),

    // ─── NextAuth ─────────────────────────────────────────────
    AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required — run: openssl rand -base64 32"),
    AUTH_URL: z.string().url().default("http://localhost:3000"),

    // ─── Email (Resend) ───────────────────────────────────────
    // Optional until Phase 6 — empty string is allowed while not configured
    RESEND_API_KEY: z.string().default(""),
    RESEND_FROM_EMAIL: z.string().email().default("no-reply@fixtureflow.app"),

    // ─── Seed ─────────────────────────────────────────────────
    SEED_ADMIN_EMAIL: z.string().email().default("admin@fixtureflow.app"),
    SEED_ADMIN_PASSWORD: z.string().default("changeme123"),
    SEED_ADMIN_NAME: z.string().default("Admin"),

    // NODE_ENV is always present in Next.js
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
    const missing = parsed.error.issues
        .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
        .join("\n")
    throw new Error(`Missing or invalid environment variables:\n${missing}`)
}

export const env = parsed.data
