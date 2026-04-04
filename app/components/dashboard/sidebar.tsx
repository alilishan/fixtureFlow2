"use client"

import Link from "next/link"
import Image from "next/image"
import { Logo } from "@/components/ui/logo"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
    LayoutDashboard,
    Users,
    Shield,
    Trophy,
    Calendar,
    UserCog,
    LogOut,
    Menu,
    X,
    Bell,
    BarChart2,
    Settings,
    ChevronDown,
    Check,
} from "lucide-react"
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { clientEnv } from "@/lib/env.client"
import { getSeasonLabel } from "@/lib/season"
import { setActiveSeason } from "@/lib/actions/season"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

function getInitials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
}


const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/age-groups", label: "Age Groups", icon: Users },
    { href: "/dashboard/teams", label: "Teams", icon: Shield },
    { href: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/dashboard/fixtures", label: "Fixtures", icon: Calendar },
    { href: "/dashboard/users", label: "Users", icon: UserCog },
    { href: "/dashboard/statistics", label: "Statistics", icon: BarChart2 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

function NavItem({
    href,
    label,
    icon: Icon,
    exact,
    badge,
    onClick,
}: {
    href: string
    label: string
    icon: React.ElementType
    exact?: boolean
    badge?: number
    onClick?: () => void
}) {
    const pathname = usePathname()
    const isActive = exact ? pathname === href : pathname.startsWith(href)

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                // Right-side border indicator (matches brand preview)
                // All items reserve 3px on the right for the active indicator
                "flex items-center gap-3 px-5 py-2.5 text-[0.875rem] font-medium transition-colors duration-150 border-r-[3px] rounded-l",
                isActive
                    ? "text-primary border-primary bg-primary/10"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted",
            )}
        >
            <Icon size={16} className="shrink-0" />
            {label}
            {badge ? (
                <span className="ml-auto bg-primary text-primary-foreground text-[0.625rem] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {badge}
                </span>
            ) : null}
        </Link>
    )
}

function SidebarContent({
    onNav,
    seasons,
    activeSeason,
}: {
    onNav?: () => void
    seasons: string[]
    activeSeason: string
}) {
    const logoUrl = clientEnv.NEXT_PUBLIC_CLUB_LOGO_URL
    const clubName = clientEnv.NEXT_PUBLIC_CLUB_NAME
    const tagline = clientEnv.NEXT_PUBLIC_CLUB_TAGLINE
    const initials = getInitials(clubName)
    const [, startTransition] = useTransition()

    return (
        <div className="flex flex-col h-full">
            {/* ── Whitelabel club header ─────────────────────────────
                Club badge + name shown first (no FixtureFlow branding here).
                FixtureFlow wordmark lives in the main topbar.
            ──────────────────────────────────────────────────────── */}
            <div className="px-5 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className="size-10 rounded flex items-center justify-center overflow-hidden shrink-0"
                        style={{ background: clientEnv.NEXT_PUBLIC_CLUB_PRIMARY_COLOR }}
                    >
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt={clubName}
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        ) : (
                            <span className="font-sans font-bold text-[0.75rem] text-white leading-none">
                                {initials}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[0.875rem] font-bold leading-tight truncate text-foreground">
                            {clubName}
                        </p>
                        <p className="text-[0.6875rem] text-muted-foreground mt-0.5">
                            Admin dashboard
                        </p>
                    </div>
                </div>
                <Bell
                    size={15}
                    className="text-muted-foreground shrink-0 ml-2 cursor-pointer hover:text-foreground transition-colors"
                />
            </div>

            {/* ── Season stat (click to switch) ─────────────────────── */}
            <DropdownMenu>
                <DropdownMenuTrigger nativeButton={false} render={<div className="px-5 py-5 shrink-0 cursor-pointer group select-none" />}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                                Current Season
                            </p>
                            <ChevronDown
                                size={11}
                                className="text-muted-foreground group-hover:text-foreground transition-colors"
                            />
                        </div>
                        <p className="font-mono text-[1.75rem] font-semibold text-foreground leading-none group-hover:text-primary transition-colors">
                            {activeSeason}
                        </p>
                        {tagline && (
                            <p className="text-[0.75rem] text-muted-foreground mt-1.5 leading-snug">
                                {tagline}
                            </p>
                        )}
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" sideOffset={8}>
                    {seasons.map((s) => (
                        <DropdownMenuItem
                            key={s}
                            onSelect={() =>
                                startTransition(() => setActiveSeason(s))
                            }
                        >
                            <Check
                                size={13}
                                className={s === activeSeason ? "opacity-100" : "opacity-0"}
                            />
                            {s}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* ── Nav ───────────────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto py-2">
                <div className="space-y-px">
                    {navItems.map((item) => (
                        <NavItem key={item.href} {...item} onClick={onNav} />
                    ))}
                </div>
            </nav>

            {/* ── Sign out ──────────────────────────────────────────── */}
            <div className="py-3 shrink-0">
                <div className="mx-5 mb-3 h-px bg-border" />
                <button
                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                    className="flex items-center gap-3 px-5 py-2.5 w-full text-[0.875rem] font-medium text-muted-foreground border-r-[3px] border-transparent hover:text-foreground hover:bg-muted transition-colors duration-150"
                >
                    <LogOut size={16} className="shrink-0" />
                    Sign out
                </button>
            </div>

            {/* ── FixtureFlow branding + copyright ──────────────────── */}
            <div className="px-5 pb-6 pt-2 shrink-0">
                <Logo width={100} className="mb-1.5" />
                <p className="text-[0.6875rem] text-muted-foreground mt-1.5 leading-snug">
                    © {new Date().getFullYear()} FixtureFlow.
                    <br />
                    All rights reserved.
                </p>
            </div>
        </div>
    )
}

export function Sidebar({
    seasons,
    activeSeason,
}: {
    seasons: string[]
    activeSeason: string
}) {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <>
            {/* Desktop sidebar — 260px, full height */}
            <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-background h-full overflow-hidden">
                <SidebarContent seasons={seasons} activeSeason={activeSeason} />
            </aside>

            {/* Mobile: fixed top strip */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-4 shadow-card">
                <div className="flex items-center gap-2.5">
                    <div
                        className="size-7 rounded flex items-center justify-center shrink-0"
                        style={{ background: clientEnv.NEXT_PUBLIC_CLUB_PRIMARY_COLOR }}
                    >
                        {clientEnv.NEXT_PUBLIC_CLUB_LOGO_URL ? (
                            <Image
                                src={clientEnv.NEXT_PUBLIC_CLUB_LOGO_URL}
                                alt={clientEnv.NEXT_PUBLIC_CLUB_NAME}
                                width={28}
                                height={28}
                                className="object-cover"
                            />
                        ) : (
                            <span className="font-sans font-bold text-[0.5625rem] text-white leading-none">
                                {getInitials(clientEnv.NEXT_PUBLIC_CLUB_NAME)}
                            </span>
                        )}
                    </div>
                    <Logo width={90} />
                </div>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="text-muted-foreground hover:text-foreground p-1"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[270px] bg-card border-r border-border flex flex-col shadow-overlay">
                        <div className="flex items-center justify-between px-5 h-14 border-b border-border shrink-0">
                            <Logo width={100} />
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="text-muted-foreground hover:text-foreground p-1"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <SidebarContent
                                onNav={() => setMobileOpen(false)}
                                seasons={seasons}
                                activeSeason={activeSeason}
                            />
                        </div>
                    </aside>
                </>
            )}
        </>
    )
}
