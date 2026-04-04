import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"
// Validates AUTH_SECRET and other server vars at startup
import "@/lib/env"

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: "jwt" },
    pages: {
        signIn: "/sign-in",
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials)
                if (!parsed.success) return null

                const user = await db.user.findUnique({
                    where: { email: parsed.data.email },
                })
                if (!user) return null

                const passwordMatch = await compare(parsed.data.password, user.hashedPassword)
                if (!passwordMatch) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
            }
            return token
        },
        session({ session, token }) {
            session.user.id = token.id as string
            session.user.role = token.role as string
            return session
        },
    },
})
