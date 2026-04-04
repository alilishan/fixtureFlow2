import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"
import { env } from "../lib/env"

const db = new PrismaClient()

async function main() {
    const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password, SEED_ADMIN_NAME: name } = env

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
        console.log(`Admin user already exists: ${email}`)
        return
    }

    const hashedPassword = await hash(password, 12)

    await db.user.create({
        data: { name, email, hashedPassword, role: "ORGANISER" },
    })

    console.log(`✓ Admin user created: ${email}`)
    console.log(`  Password: ${password}`)
    console.log(`  Change this immediately after first login.`)
}

main()
    .catch(console.error)
    .finally(() => db.$disconnect())
