"use client"

import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Search, ChevronDown, Calendar, BarChart2, Trophy } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

const routeMeta: { pattern: RegExp; title: string; subtitle: string }[] = [
    { pattern: /^\/dashboard\/age-groups/, title: "Age Groups", subtitle: "Manage age group categories" },
    { pattern: /^\/dashboard\/teams\/[^/]+/, title: "Squad", subtitle: "Players in this team" },
    { pattern: /^\/dashboard\/teams/, title: "Teams", subtitle: "All registered teams" },
    { pattern: /^\/dashboard\/tournaments\/new/, title: "New Tournament", subtitle: "Set up a new competition" },
    { pattern: /^\/dashboard\/tournaments\/[^/]+/, title: "Tournament", subtitle: "Matches and standings" },
    { pattern: /^\/dashboard\/tournaments/, title: "Tournaments", subtitle: "All competitions" },
    { pattern: /^\/dashboard\/fixtures\/[^/]+/, title: "Match Detail", subtitle: "Score and match info" },
    { pattern: /^\/dashboard\/fixtures/, title: "Fixtures", subtitle: "Schedule and results" },
    { pattern: /^\/dashboard\/users/, title: "Users", subtitle: "Admin accounts" },
    { pattern: /^\/dashboard\/settings/, title: "Settings", subtitle: "Club configuration" },
    { pattern: /^\/dashboard$/, title: "Dashboard", subtitle: "Overview of your club" },
]

function getMeta(pathname: string) {
    for (const route of routeMeta) {
        if (route.pattern.test(pathname)) return route
    }
    return { title: "Dashboard", subtitle: "" }
}

export function Topbar() {
    const pathname = usePathname()
    const { title, subtitle } = getMeta(pathname)

    return (
        <header className="hidden lg:flex h-16 items-center px-6 border-b border-border bg-card shrink-0 gap-5">
            {/* Page title — larger/bolder to match brand preview */}
            <div className="shrink-0">
                <h1 className="font-sans font-bold text-[1.5rem] leading-tight text-foreground">{title}</h1>
            </div>

            {/* Pill search bar */}
            <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-[7px] text-muted-foreground text-[0.8125rem] max-w-[340px] flex-1 border border-border">
                <Search size={13} className="shrink-0" />
                <span className="select-none">Search anything...</span>
            </div>

            {/* Right: FixtureFlow brand wordmark + view button + theme toggle */}
            <div className="ml-auto flex items-center gap-4">
                {/* Public pages dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="hidden xl:flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-foreground hover:text-primary transition-colors outline-none">
                        Public Site
                        <ChevronDown size={11} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8}>
                        <DropdownMenuItem render={<Link href="/fixtures" />}>
                            <Calendar size={14} />
                            Fixtures
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link href="/standings" />}>
                            <BarChart2 size={14} />
                            Standings
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link href="/bracket" />}>
                            <Trophy size={14} />
                            Bracket
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ThemeToggle />
            </div>
        </header>
    )
}
