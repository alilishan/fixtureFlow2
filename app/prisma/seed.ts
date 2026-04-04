import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"
import { env } from "../lib/env"

const db = new PrismaClient()

// ─── helpers ────────────────────────────────────────────────────────────────

function rnd(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function dateAt(daysFromNow: number, hour = 15): Date {
    const d = new Date()
    d.setDate(d.getDate() + daysFromNow)
    d.setHours(hour, 0, 0, 0)
    return d
}

// ─── data ───────────────────────────────────────────────────────────────────

const SEASON = "2025/26"

const AGE_GROUPS = [
    { name: "U9", minAge: 7, maxAge: 9 },
    { name: "U11", minAge: 9, maxAge: 11 },
    { name: "U13", minAge: 11, maxAge: 13 },
    { name: "U15", minAge: 13, maxAge: 15 },
]

// U11 teams — for the league
const U11_TEAMS = [
    {
        name: "City Lions",
        players: ["Ethan Clarke", "Noah Harris", "Liam Bennett", "Oliver James", "Harry Wilson", "Jack Thompson", "George Evans", "Freddie Moore", "Alfie Taylor", "Charlie Martin"],
    },
    {
        name: "River FC",
        players: ["Mason Roberts", "Logan Walker", "Lucas White", "Elijah Hall", "Aiden Lewis", "Sebastian Young", "Henry Allen", "Daniel King", "Matthew Wright", "Joseph Scott"],
    },
    {
        name: "North United",
        players: ["Isaac Green", "Owen Baker", "Ryan Adams", "Leo Nelson", "Theo Carter", "Finley Mitchell", "Archie Perez", "Reuben Roberts", "Elliot Turner", "Dylan Phillips"],
    },
    {
        name: "South Rangers",
        players: ["Caleb Campbell", "Jayden Parker", "Aaron Evans", "Toby Collins", "Dominic Edwards", "Felix Morgan", "Max Bell", "Zac Murphy", "Blake Bailey", "Cole Rivera"],
    },
    {
        name: "East Athletic",
        players: ["Kai Cooper", "Jude Richardson", "Rhys Cox", "Barnaby Ward", "Jasper Diaz", "Rupert Foster", "Cecil Brooks", "Albie Sanders", "Rafferty Price", "Seb Wood"],
    },
    {
        name: "West City",
        players: ["Hugo Ross", "Monty Hughes", "Bertie Gray", "Arlo Watson", "Casper Brooks", "Teddy Kelly", "Rocco Torres", "Ezra Simmons", "Jago Peterson", "Rory Wood"],
    },
]

// U13 teams — for the cup
const U13_TEAMS = [
    {
        name: "Tigers FC",
        players: ["Connor Shaw", "Ewan Murray", "Fraser Mackenzie", "Hamish Campbell", "Iain Ferguson", "Jamie Robertson", "Kieran Stewart", "Lachlan Reid", "Magnus Grant", "Neil Douglas"],
    },
    {
        name: "Panthers United",
        players: ["Oisin Flynn", "Patrick Byrne", "Quinn Murphy", "Ronan O'Brien", "Sean Kelly", "Tadhg Walsh", "Ultan Ryan", "Victor Doyle", "William Brennan", "Xavier Lynch"],
    },
    {
        name: "Eagles SC",
        players: ["Aarav Patel", "Arjun Sharma", "Dev Mehta", "Ishan Gupta", "Kabir Singh", "Nikhil Kapoor", "Preet Rao", "Rahul Joshi", "Sai Nair", "Vikram Reddy"],
    },
    {
        name: "Wolves FC",
        players: ["Aleksei Volkov", "Dmitri Petrov", "Fyodor Sokolov", "Ivan Morozov", "Kirill Novak", "Maxim Kozlov", "Nikita Lebedev", "Pavel Orlov", "Roman Popov", "Sergei Ivanov"],
    },
]

// U15 team — no tournament this season, just exists
const U15_TEAMS = [
    {
        name: "Senior Rovers",
        players: ["Adam Fletcher", "Ben Harrison", "Chris Lawson", "Dan Morrison", "Eddie Norton", "Frank Owen", "Greg Powell", "Harry Quinn", "Ian Russell", "Jack Spencer"],
    },
]

// ─── league schedule (round-robin, 6 teams, 15 matches) ─────────────────────
// pairs: indices into U11_TEAMS
const LEAGUE_FIXTURES: {
    home: number; away: number; daysFromNow: number; venue: string; round: string;
    result?: [number, number]; // [homeScore, awayScore] — undefined = SCHEDULED
    liveIndex?: number;        // set to match index if this one is LIVE
}[] = [
    // Round 1
    { home: 0, away: 1, daysFromNow: -35, venue: "Pitch A", round: "Round 1", result: [3, 1] },
    { home: 2, away: 3, daysFromNow: -35, venue: "Pitch B", round: "Round 1", result: [2, 2] },
    { home: 4, away: 5, daysFromNow: -35, venue: "Pitch C", round: "Round 1", result: [1, 0] },
    // Round 2
    { home: 1, away: 2, daysFromNow: -28, venue: "Pitch A", round: "Round 2", result: [0, 2] },
    { home: 3, away: 4, daysFromNow: -28, venue: "Pitch B", round: "Round 2", result: [1, 3] },
    { home: 5, away: 0, daysFromNow: -28, venue: "Pitch C", round: "Round 2", result: [0, 1] },
    // Round 3
    { home: 0, away: 2, daysFromNow: -21, venue: "Pitch A", round: "Round 3", result: [4, 0] },
    { home: 1, away: 3, daysFromNow: -21, venue: "Pitch B", round: "Round 3", result: [2, 1] },
    { home: 4, away: 0, daysFromNow: -21, venue: "Pitch C", round: "Round 3", result: [1, 2] },
    // Round 4
    { home: 2, away: 5, daysFromNow: -14, venue: "Pitch A", round: "Round 4", result: [3, 0] },
    { home: 3, away: 1, daysFromNow: -14, venue: "Pitch B", round: "Round 4", result: [0, 1] },
    // Round 5 — live + upcoming
    { home: 0, away: 3, daysFromNow: 0, venue: "Pitch A", round: "Round 5" },  // LIVE
    { home: 1, away: 4, daysFromNow: 7, venue: "Pitch B", round: "Round 5" },
    { home: 5, away: 2, daysFromNow: 7, venue: "Pitch C", round: "Round 5" },
    { home: 1, away: 5, daysFromNow: 14, venue: "Pitch A", round: "Round 6" },
]

// Cup fixtures — 4 teams, 2 semi-finals + final
const CUP_FIXTURES: typeof LEAGUE_FIXTURES = [
    { home: 0, away: 1, daysFromNow: -21, venue: "Main Pitch", round: "Semi-Final", result: [2, 0] },
    { home: 2, away: 3, daysFromNow: -21, venue: "Pitch B",    round: "Semi-Final", result: [1, 3] },
    { home: 0, away: 3, daysFromNow: 14,  venue: "Main Pitch", round: "Final" },
]

// positions pool
const POSITIONS = ["GK", "CB", "CB", "LB", "RB", "CM", "CM", "CAM", "LW", "RW", "ST"]

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
    // Admin user
    const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password, SEED_ADMIN_NAME: name } = env
    const existing = await db.user.findUnique({ where: { email } })
    if (!existing) {
        const hashedPassword = await hash(password, 12)
        await db.user.create({ data: { name, email, hashedPassword, role: "ORGANISER" } })
        console.log(`✓ Admin user: ${email}`)
    } else {
        console.log(`· Admin user already exists`)
    }

    // Age groups
    const ageGroupMap: Record<string, string> = {}
    for (const ag of AGE_GROUPS) {
        const record = await db.ageGroup.upsert({
            where: { name: ag.name },
            update: {},
            create: ag,
        })
        ageGroupMap[ag.name] = record.id
        console.log(`✓ Age group: ${ag.name}`)
    }

    // ── U11 Teams + Players ──────────────────────────────────────────────────
    const u11TeamIds: string[] = []
    const u11PlayerIdsByTeam: string[][] = []

    for (const teamData of U11_TEAMS) {
        const existing = await db.team.findFirst({ where: { name: teamData.name, season: SEASON } })
        let teamId: string

        if (existing) {
            teamId = existing.id
            console.log(`· Team exists: ${teamData.name}`)
        } else {
            const team = await db.team.create({
                data: { name: teamData.name, season: SEASON, ageGroupId: ageGroupMap["U11"] },
            })
            teamId = team.id
            console.log(`✓ Team: ${teamData.name}`)
        }

        u11TeamIds.push(teamId)

        // Players
        const existingPlayers = await db.player.findMany({ where: { teamId } })
        let playerIds: string[]

        if (existingPlayers.length > 0) {
            playerIds = existingPlayers.map((p) => p.id)
        } else {
            playerIds = []
            for (let i = 0; i < teamData.players.length; i++) {
                const player = await db.player.create({
                    data: {
                        name: teamData.players[i],
                        teamId,
                        squadNumber: i + 1,
                        position: POSITIONS[i] ?? "SUB",
                    },
                })
                playerIds.push(player.id)
            }
            console.log(`  ✓ ${playerIds.length} players`)
        }

        u11PlayerIdsByTeam.push(playerIds)
    }

    // ── U13 Teams + Players ──────────────────────────────────────────────────
    const u13TeamIds: string[] = []
    const u13PlayerIdsByTeam: string[][] = []

    for (const teamData of U13_TEAMS) {
        const existing = await db.team.findFirst({ where: { name: teamData.name, season: SEASON } })
        let teamId: string

        if (existing) {
            teamId = existing.id
            console.log(`· Team exists: ${teamData.name}`)
        } else {
            const team = await db.team.create({
                data: { name: teamData.name, season: SEASON, ageGroupId: ageGroupMap["U13"] },
            })
            teamId = team.id
            console.log(`✓ Team: ${teamData.name}`)
        }

        u13TeamIds.push(teamId)

        const existingPlayers = await db.player.findMany({ where: { teamId } })
        let playerIds: string[]

        if (existingPlayers.length > 0) {
            playerIds = existingPlayers.map((p) => p.id)
        } else {
            playerIds = []
            for (let i = 0; i < teamData.players.length; i++) {
                const player = await db.player.create({
                    data: {
                        name: teamData.players[i],
                        teamId,
                        squadNumber: i + 1,
                        position: POSITIONS[i] ?? "SUB",
                    },
                })
                playerIds.push(player.id)
            }
            console.log(`  ✓ ${playerIds.length} players`)
        }

        u13PlayerIdsByTeam.push(playerIds)
    }

    // ── U15 Teams ────────────────────────────────────────────────────────────
    for (const teamData of U15_TEAMS) {
        const existing = await db.team.findFirst({ where: { name: teamData.name, season: SEASON } })
        if (!existing) {
            const team = await db.team.create({
                data: { name: teamData.name, season: SEASON, ageGroupId: ageGroupMap["U15"] },
            })
            for (let i = 0; i < teamData.players.length; i++) {
                await db.player.create({
                    data: {
                        name: teamData.players[i],
                        teamId: team.id,
                        squadNumber: i + 1,
                        position: POSITIONS[i] ?? "SUB",
                    },
                })
            }
            console.log(`✓ Team: ${teamData.name} (U15, no tournament)`)
        } else {
            console.log(`· Team exists: ${teamData.name}`)
        }
    }

    // ── U11 League ───────────────────────────────────────────────────────────
    let leagueTournament = await db.tournament.findFirst({
        where: { name: "U11 Spring League", season: SEASON },
    })

    if (!leagueTournament) {
        leagueTournament = await db.tournament.create({
            data: {
                name: "U11 Spring League",
                type: "LEAGUE",
                season: SEASON,
                ageGroupId: ageGroupMap["U11"],
                teams: {
                    create: u11TeamIds.map((teamId, seed) => ({ teamId, seed: seed + 1 })),
                },
            },
        })
        console.log(`✓ Tournament: U11 Spring League`)

        // Create matches
        let liveSet = false
        for (const fixture of LEAGUE_FIXTURES) {
            const isLive = !fixture.result && !liveSet
            if (isLive) liveSet = true

            const status = fixture.result ? "FINISHED" : isLive ? "LIVE" : "SCHEDULED"
            const homeScore = fixture.result?.[0] ?? null
            const awayScore = fixture.result?.[1] ?? null
            const homeTeamId = u11TeamIds[fixture.home]
            const awayTeamId = u11TeamIds[fixture.away]

            const match = await db.match.create({
                data: {
                    tournamentId: leagueTournament.id,
                    homeTeamId,
                    awayTeamId,
                    scheduledAt: dateAt(fixture.daysFromNow),
                    venue: fixture.venue,
                    round: fixture.round,
                    status,
                    homeScore,
                    awayScore,
                },
            })

            if (status === "FINISHED" && homeScore !== null && awayScore !== null) {
                await seedMatchEvents(
                    match.id,
                    homeTeamId, u11PlayerIdsByTeam[fixture.home],
                    awayTeamId, u11PlayerIdsByTeam[fixture.away],
                    homeScore, awayScore,
                )
            }
        }
        console.log(`  ✓ ${LEAGUE_FIXTURES.length} fixtures created`)
    } else {
        console.log(`· League tournament already exists`)
    }

    // ── U13 Cup ──────────────────────────────────────────────────────────────
    let cupTournament = await db.tournament.findFirst({
        where: { name: "U13 Challenge Cup", season: SEASON },
    })

    if (!cupTournament) {
        cupTournament = await db.tournament.create({
            data: {
                name: "U13 Challenge Cup",
                type: "CUP",
                season: SEASON,
                ageGroupId: ageGroupMap["U13"],
                teams: {
                    create: u13TeamIds.map((teamId, seed) => ({ teamId, seed: seed + 1 })),
                },
            },
        })
        console.log(`✓ Tournament: U13 Challenge Cup`)

        for (const fixture of CUP_FIXTURES) {
            const status = fixture.result ? "FINISHED" : "SCHEDULED"
            const homeScore = fixture.result?.[0] ?? null
            const awayScore = fixture.result?.[1] ?? null
            const homeTeamId = u13TeamIds[fixture.home]
            const awayTeamId = u13TeamIds[fixture.away]

            const match = await db.match.create({
                data: {
                    tournamentId: cupTournament.id,
                    homeTeamId,
                    awayTeamId,
                    scheduledAt: dateAt(fixture.daysFromNow),
                    venue: fixture.venue,
                    round: fixture.round,
                    status,
                    homeScore,
                    awayScore,
                },
            })

            if (status === "FINISHED" && homeScore !== null && awayScore !== null) {
                await seedMatchEvents(
                    match.id,
                    homeTeamId, u13PlayerIdsByTeam[fixture.home],
                    awayTeamId, u13PlayerIdsByTeam[fixture.away],
                    homeScore, awayScore,
                )
            }
        }
        console.log(`  ✓ ${CUP_FIXTURES.length} cup fixtures created`)
    } else {
        console.log(`· Cup tournament already exists`)
    }

    console.log("\n✅ Seed complete")
}

// ─── seed goals, assists, and cards for a finished match ─────────────────────

async function seedMatchEvents(
    matchId: string,
    homeTeamId: string, homePlayers: string[],
    awayTeamId: string, awayPlayers: string[],
    homeScore: number, awayScore: number,
) {
    // Goals & assists — home
    for (let i = 0; i < homeScore; i++) {
        const scorerId = pick(homePlayers)
        await db.goalEvent.create({
            data: { matchId, playerId: scorerId, type: "GOAL", minute: rnd(1, 80) },
        })
        // ~70% chance of an assist
        if (Math.random() < 0.7) {
            const assisterId = pick(homePlayers.filter((p) => p !== scorerId))
            await db.goalEvent.create({
                data: { matchId, playerId: assisterId, type: "ASSIST", minute: rnd(1, 80) },
            })
        }
    }

    // Goals & assists — away
    for (let i = 0; i < awayScore; i++) {
        const scorerId = pick(awayPlayers)
        await db.goalEvent.create({
            data: { matchId, playerId: scorerId, type: "GOAL", minute: rnd(1, 80) },
        })
        if (Math.random() < 0.7) {
            const assisterId = pick(awayPlayers.filter((p) => p !== scorerId))
            await db.goalEvent.create({
                data: { matchId, playerId: assisterId, type: "ASSIST", minute: rnd(1, 80) },
            })
        }
    }

    // Match statistics (cards, possession, shots, fouls)
    const homePossession = rnd(40, 65)
    await db.matchStatistic.upsert({
        where: { matchId_teamId: { matchId, teamId: homeTeamId } },
        update: {},
        create: {
            matchId,
            teamId: homeTeamId,
            goals: homeScore,
            shots: homeScore + rnd(2, 8),
            possession: homePossession,
            fouls: rnd(2, 10),
            yellowCards: rnd(0, 3),
            redCards: Math.random() < 0.08 ? 1 : 0,
        },
    })

    await db.matchStatistic.upsert({
        where: { matchId_teamId: { matchId, teamId: awayTeamId } },
        update: {},
        create: {
            matchId,
            teamId: awayTeamId,
            goals: awayScore,
            shots: awayScore + rnd(2, 8),
            possession: 100 - homePossession,
            fouls: rnd(2, 10),
            yellowCards: rnd(0, 3),
            redCards: Math.random() < 0.08 ? 1 : 0,
        },
    })
}

main()
    .catch(console.error)
    .finally(() => db.$disconnect())
