type MatchForStandings = {
    homeTeamId: string
    awayTeamId: string
    homeScore: number | null
    awayScore: number | null
    status: string
    updatedAt: Date
}

type TeamForStandings = {
    id: string
    name: string
}

export type Standing = {
    teamId: string
    teamName: string
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    goalDiff: number
    points: number
    form: ("W" | "D" | "L")[]
}

export function computeStandings(
    teams: TeamForStandings[],
    matches: MatchForStandings[],
): Standing[] {
    const finished = matches.filter(
        (m) => m.status === "FINISHED" && m.homeScore !== null && m.awayScore !== null,
    )

    const standings = teams.map((team) => {
        const teamMatches = finished.filter(
            (m) => m.homeTeamId === team.id || m.awayTeamId === team.id,
        )

        const sorted = [...teamMatches].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )

        let won = 0,
            drawn = 0,
            lost = 0,
            gf = 0,
            ga = 0
        const formItems: ("W" | "D" | "L")[] = []

        for (const m of sorted) {
            const isHome = m.homeTeamId === team.id
            const myScore = isHome ? m.homeScore! : m.awayScore!
            const theirScore = isHome ? m.awayScore! : m.homeScore!

            gf += myScore
            ga += theirScore

            if (myScore > theirScore) won++
            else if (myScore === theirScore) drawn++
            else lost++

            if (formItems.length < 5) {
                formItems.push(myScore > theirScore ? "W" : myScore === theirScore ? "D" : "L")
            }
        }

        return {
            teamId: team.id,
            teamName: team.name,
            played: won + drawn + lost,
            won,
            drawn,
            lost,
            goalsFor: gf,
            goalsAgainst: ga,
            goalDiff: gf - ga,
            points: won * 3 + drawn,
            form: formItems.reverse(),
        }
    })

    return standings.sort(
        (a, b) =>
            b.points - a.points ||
            b.goalDiff - a.goalDiff ||
            b.goalsFor - a.goalsFor ||
            a.teamName.localeCompare(b.teamName),
    )
}
