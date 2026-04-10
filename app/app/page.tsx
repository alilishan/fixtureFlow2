import Image from "next/image"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { InterestForm } from "@/components/marketing/interest-form"
import { Reveal } from "@/components/marketing/reveal"
import {
    Calendar, BarChart2, Trophy, Layers, Globe, Users,
    Check, X, Zap, ArrowRight, ChevronRight,
} from "lucide-react"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"

export const generateMetadata = async () => {
    return {
        title: "FixtureFlow",
        description: "FixtureFlow is the modern club management platform for football clubs who want beautiful fixtures, live results, and automatic standings — without the complexity or the cost.",
    }
}

const commitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev"

// ─── Colours forced for the dark sections ────────────────────────────────────
const DARK_BG   = "#0e0f14"
const DARK_CARD = "#16181f"
const DARK_FG   = "#e8eaf0"
const DARK_MUTED = "#8b91a7"
const DARK_BORDER = "#252836"
const RED = "#e84422"

// ─── Data ─────────────────────────────────────────────────────────────────────

const marqueeItems = [
    "Live Scores", "Season Management", "Knockout Brackets",
    "Embeddable Widgets", "Automatic Standings", "Public Club Pages",
    "Role-Based Access", "Multi-Age-Group", "No Per-Player Fees",
    "Real-Time Updates", "Tournament Brackets", "Beautiful Design",
]

const features = [
    {
        icon: Zap, span: 2,
        title: "Live Score Updates",
        description: "Enter scores from any device and watch standings recalculate instantly. No refresh, no spreadsheet, no WhatsApp.",
        detail: "Supports LIVE match status so your supporters can follow in real-time.",
    },
    {
        icon: Trophy, span: 1,
        title: "Knockout Brackets",
        description: "Run cup competitions and playoffs with automatic bracket progression. Handles byes, replays, and multi-stage tournaments.",
        detail: null,
    },
    {
        icon: Layers, span: 1,
        title: "Season Scoping",
        description: "Switch between seasons in a click. Every tournament, fixture, and standing is scoped to the active season.",
        detail: null,
    },
    {
        icon: Globe, span: 2,
        title: "Embeddable Widgets",
        description: "Already have a Wix, Squarespace, or WordPress club site? Drop your live fixtures or standings table anywhere with one line of code. No API key. No plugin.",
        detail: "Works on any website that accepts an iframe — takes 30 seconds to set up.",
    },
    {
        icon: Calendar, span: 2,
        title: "Public Club Pages",
        description: "Every club gets a ready-made public site — fixtures, results, standings, and brackets. Share a link with supporters. No account, no app, no friction.",
        detail: "Works in light and dark mode. Looks great on every device.",
    },
    {
        icon: Users, span: 1,
        title: "Multi-Age-Group",
        description: "Manage every team from U7 to adults under one roof. Coaches see only their squads. Admins see everything.",
        detail: null,
    },
]

const comparison = [
    { feature: "Live score updates",   ff: true,  pitchero: true,  fulltime: false },
    { feature: "Embeddable widgets",   ff: true,  pitchero: false, fulltime: false },
    { feature: "Tournament brackets",  ff: true,  pitchero: false, fulltime: false },
    { feature: "Season history",       ff: true,  pitchero: false, fulltime: false },
    { feature: "Public club pages",    ff: true,  pitchero: true,  fulltime: false },
    { feature: "No per-player fees",   ff: true,  pitchero: false, fulltime: true  },
    { feature: "Multi-age-group",      ff: true,  pitchero: true,  fulltime: false },
    { feature: "Role-based access",    ff: true,  pitchero: true,  fulltime: false },
]

// ─── Small helpers ─────────────────────────────────────────────────────────

function RedLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-primary mb-4">
            {children}
        </p>
    )
}

function Tick({ ok, dark }: { ok: boolean; dark?: boolean }) {
    return ok ? (
        <Check size={14} style={{ color: "#16a34a" }} className="mx-auto" />
    ) : (
        <X size={14} className={`mx-auto ${dark ? "text-white/15" : "text-muted-foreground/30"}`} />
    )
}

function ScreenshotFrame({
    lightSrc,
    darkSrc,
    alt,
    urlBar,
}: {
    lightSrc: string
    darkSrc: string
    alt: string
    urlBar: string
}) {
    return (
        <div className="rounded-xl border border-border overflow-hidden shadow-float flex flex-col">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card shrink-0">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <div className="flex-1 mx-4 h-6 bg-muted rounded-md flex items-center px-3">
                    <span className="font-mono text-[0.6rem] text-muted-foreground">
                        {urlBar}
                    </span>
                </div>
            </div>
            {/* Screenshot */}
            <Image src={lightSrc} alt={alt} width={1280} height={800} className="w-full h-auto dark:hidden" />
            <Image src={darkSrc} alt={alt} width={1280} height={800} className="w-full h-auto hidden dark:block" />
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* ── Sticky nav ──────────────────────────────────────────────── */}
            <nav
                className="sticky top-0 z-30 backdrop-blur-md border-b animate-nav-slide"
                style={{ background: "color-mix(in srgb, var(--background) 85%, transparent)", borderColor: "var(--border)" }}
            >
                <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
                    <Logo width={120} />
                    <div className="flex items-center gap-5">
                        <Link href="/dashboard" className="hidden sm:block text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Sign in
                        </Link>
                        <a
                            href="#early-access"
                            className="h-8 px-4 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            style={{ background: RED, color: "#fff" }}
                        >
                            Get early access <ArrowRight size={11} />
                        </a>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <main>
                {/* ══════════════════════════════════════════════════════════
                    HERO — forced dark, monumental type
                ══════════════════════════════════════════════════════════ */}
                <section
                    className="relative overflow-hidden"
                    style={{ background: DARK_BG, color: DARK_FG }}
                >
                    {/* Red glow */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                                radial-gradient(ellipse 55% 60% at 85% 15%, rgba(232,68,34,0.13), transparent),
                                radial-gradient(ellipse 40% 40% at 10% 90%, rgba(232,68,34,0.05), transparent)
                            `,
                        }}
                    />
                    {/* Dot grid */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    {/* Giant decorative "FF" */}
                    <span
                        className="absolute right-0 top-1/2 -translate-y-1/2 font-mono font-bold leading-none select-none pointer-events-none translate-x-8 sm:translate-x-0"
                        style={{
                            fontSize: "clamp(12rem, 28vw, 26rem)",
                            color: "#fff",
                            opacity: 0.025,
                            letterSpacing: "-0.05em",
                        }}
                        aria-hidden
                    >
                        FF
                    </span>

                    <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-28">
                        {/* Badge */}
                        <div
                            className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-8 border"
                            style={{ borderColor: `${RED}44`, background: `${RED}14` }}
                        >
                            <span className="size-1.5 rounded-full shrink-0 animate-pulse" style={{ background: RED }} />
                            <span className="font-mono text-[0.6375rem] uppercase tracking-[0.18em]" style={{ color: RED }}>
                                Early access — now open
                            </span>
                        </div>

                        {/* Main headline */}
                        <h1
                            className="font-mono font-bold leading-[1.05] tracking-tight mb-8"
                            style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)", color: DARK_FG }}
                        >
                            From fixtures
                            <br />
                            to final{" "}
                            <span style={{ color: RED }}>whistles.</span>
                        </h1>

                        <div className="max-w-xl">
                            <p className="font-sans text-base sm:text-lg leading-relaxed mb-10" style={{ color: DARK_MUTED }}>
                                FixtureFlow is the modern club management platform for football clubs
                                who want beautiful fixtures, live results, and automatic standings —
                                without the complexity or the cost.
                            </p>
                            <InterestForm />
                        </div>

                        {/* Floating stat pills */}
                        <div className="flex flex-wrap gap-3 mt-12">
                            {[
                                "Live scores",
                                "Auto standings",
                                "Embeddable widgets",
                                "Knockout brackets",
                                "Public pages",
                            ].map((tag, i) => (
                                <Reveal key={tag} delay={300 + i * 60}>
                                    <span
                                        className="font-mono text-[0.6875rem] uppercase tracking-wider px-3 py-1.5 rounded-full border"
                                        style={{ color: DARK_MUTED, borderColor: DARK_BORDER }}
                                    >
                                        {tag}
                                    </span>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    MARQUEE — kinetic feature ticker
                ══════════════════════════════════════════════════════════ */}
                <div
                    className="overflow-hidden border-y py-4 select-none"
                    style={{ background: DARK_CARD, borderColor: DARK_BORDER }}
                >
                    <div className="flex animate-marquee whitespace-nowrap">
                        {[...marqueeItems, ...marqueeItems].map((item, i) => (
                            <span key={i} className="flex items-center gap-4 mx-4">
                                <span className="font-mono text-xs uppercase tracking-[0.14em]" style={{ color: DARK_MUTED }}>
                                    {item}
                                </span>
                                <span className="size-1 rounded-full shrink-0" style={{ background: RED }} />
                            </span>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    PROBLEM
                ══════════════════════════════════════════════════════════ */}
                <section className="border-b border-border relative overflow-hidden">
                    {/* Faint section number */}
                    <span
                        className="absolute right-4 top-4 font-mono font-bold leading-none select-none pointer-events-none"
                        style={{ fontSize: "clamp(5rem, 16vw, 14rem)", color: "var(--border)", opacity: 0.8 }}
                        aria-hidden
                    >
                        01
                    </span>
                    <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
                        <div className="max-w-2xl">
                            <Reveal>
                                <RedLabel>The problem</RedLabel>
                                <h2 className="font-mono font-bold text-2xl sm:text-[2rem] text-foreground mb-6 leading-tight">
                                    Most clubs are still managing fixtures in WhatsApp groups and Google Sheets.
                                </h2>
                            </Reveal>
                            <Reveal delay={100}>
                                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                                    <p>
                                        The alternatives — Pitchero, FullTime FA, TeamSnap — were built for a different era. They&apos;re slow, cluttered, and require every parent to download yet another app before they can see anything.
                                    </p>
                                    <p>
                                        Pitchero charges per-player. FullTime FA looks like it was designed in 2005. TeamSnap is priced for the US market. None of them let you embed your standings table on your existing club website.
                                    </p>
                                </div>
                            </Reveal>
                            <Reveal delay={180}>
                                <div
                                    className="mt-7 border-l-2 pl-5 py-1"
                                    style={{ borderColor: RED }}
                                >
                                    <p className="text-sm font-medium text-foreground leading-relaxed">
                                        FixtureFlow is different. One admin dashboard. Beautiful public pages. Widgets for any website. A design that doesn&apos;t make your eyes bleed.
                                    </p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    FEATURES — asymmetric bento grid
                ══════════════════════════════════════════════════════════ */}
                <section className="border-b border-border bg-card relative overflow-hidden">
                    <span
                        className="absolute right-4 top-4 font-mono font-bold leading-none select-none pointer-events-none"
                        style={{ fontSize: "clamp(5rem, 16vw, 14rem)", color: "var(--border)", opacity: 0.8 }}
                        aria-hidden
                    >
                        02
                    </span>
                    <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
                        <Reveal>
                            <RedLabel>Features</RedLabel>
                            <h2 className="font-mono font-bold text-2xl sm:text-[2rem] text-foreground mb-2 leading-tight">
                                Everything your club actually needs.
                            </h2>
                            <p className="text-sm text-muted-foreground mb-12 max-w-lg">
                                Built around how clubs work — multiple teams, age groups, real tournaments, and supporters who just want the results.
                            </p>
                        </Reveal>

                        {/* Bento grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
                            {features.map((f, i) => {
                                const Icon = f.icon
                                const isLarge = f.span === 2
                                return (
                                    <Reveal
                                        key={f.title}
                                        delay={i * 60}
                                        className={`bg-card group hover:bg-muted/30 transition-colors duration-200 ${isLarge ? "lg:col-span-2" : "lg:col-span-1"}`}
                                    >
                                        <div className="p-7 h-full flex flex-col">
                                            <div
                                                className="size-9 rounded-lg flex items-center justify-center mb-5 transition-colors group-hover:bg-primary/15"
                                                style={{ background: `${RED}18` }}
                                            >
                                                <Icon size={16} style={{ color: RED }} className="transition-transform duration-200 group-hover:scale-125" />
                                            </div>
                                            <h3 className="font-mono font-semibold text-sm text-foreground mb-2">
                                                {f.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                                                {f.description}
                                            </p>
                                            {f.detail && (
                                                <p
                                                    className="mt-4 text-xs font-medium flex items-center gap-1.5"
                                                    style={{ color: RED }}
                                                >
                                                    <ChevronRight size={11} />
                                                    {f.detail}
                                                </p>
                                            )}
                                        </div>
                                    </Reveal>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    DASHBOARD SCREENSHOT
                ══════════════════════════════════════════════════════════ */}
                <section className="border-b border-border">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-12">
                            <Reveal direction="left" className="lg:w-72 shrink-0">
                                <RedLabel>The dashboard</RedLabel>
                                <h2 className="font-mono font-bold text-2xl text-foreground mb-4 leading-tight">
                                    One place for everything.
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                    The admin dashboard gives you a clear overview of every fixture, result, and standing across all your tournaments — filtered to the active season.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Switch seasons without losing history",
                                        "Update scores from any device",
                                        "All age groups in one roof",
                                        "Role-based access for coaches",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                                            <Check size={12} style={{ color: RED }} className="shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                            <Reveal className="flex-1">
                                <div className="relative pb-10">
                                    <ScreenshotFrame
                                        lightSrc="/screenshots/dashboard-light.png"
                                        darkSrc="/screenshots/dashboard-dark.png"
                                        alt="FixtureFlow admin dashboard showing fixtures, standings, and season stats"
                                        urlBar="app.fixtureflow.app/dashboard"
                                    />
                                    <div className="absolute bottom-4 -right-3 border border-border rounded-lg px-4 py-3 w-56 bg-card/90 backdrop-blur-sm shadow-lg">
                                        <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-primary mb-1">Admin overview</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Season stats, upcoming schedule, and live match status — everything your admins need without digging through menus.</p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    EMBED — code + widget preview
                ══════════════════════════════════════════════════════════ */}
                <section className="border-b border-border bg-card">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
                        <div className="flex flex-col lg:flex-row-reverse lg:items-start gap-12">
                            <Reveal direction="left" className="lg:w-72 shrink-0">
                                <RedLabel>Embeddable widgets</RedLabel>
                                <h2 className="font-mono font-bold text-2xl text-foreground mb-4 leading-tight">
                                    Your existing website, upgraded.
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    Already have a Wix, Squarespace, or WordPress site? Don&apos;t rebuild it. One line of code and your live fixtures appear automatically.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    No API keys. No plugin. No technical knowledge required.
                                </p>
                            </Reveal>
                            <Reveal className="flex-1 space-y-4">
                                {/* Code block */}
                                <div className="rounded-xl border border-border bg-background overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
                                        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                                        <span className="size-2.5 rounded-full bg-[#febc2e]" />
                                        <span className="size-2.5 rounded-full bg-[#28c840]" />
                                        <span className="font-mono text-[0.6rem] text-muted-foreground ml-2">embed.html</span>
                                    </div>
                                    <pre className="px-5 py-5 font-mono text-[0.75rem] leading-6 overflow-x-auto">
                                        <span className="text-muted-foreground">{`<!-- Paste anywhere on your club site -->`}</span>{"\n"}
                                        <span style={{ color: RED }}>{`<iframe`}</span>{"\n"}
                                        {"  "}<span className="text-foreground">src</span><span className="text-muted-foreground">{"=\""}</span><span className="text-foreground">https://yourclub.fixtureflow.app/embed/fixtures</span><span className="text-muted-foreground">{"\""}</span>{"\n"}
                                        {"  "}<span className="text-foreground">width</span><span className="text-muted-foreground">{"=\""}</span><span className="text-foreground">100%</span><span className="text-muted-foreground">{"\""}</span>{"\n"}
                                        {"  "}<span className="text-foreground">height</span><span className="text-muted-foreground">{"=\""}</span><span className="text-foreground">480</span><span className="text-muted-foreground">{"\""}</span>{"\n"}
                                        {"  "}<span className="text-foreground">frameborder</span><span className="text-muted-foreground">{"=\""}</span><span className="text-foreground">0</span><span className="text-muted-foreground">{"\""}</span>{"\n"}
                                        <span style={{ color: RED }}>{"/>"}</span>
                                    </pre>
                                </div>
                                <div className="relative pb-10">
                                    <ScreenshotFrame
                                        lightSrc="/screenshots/public-fixtures-light.png"
                                        darkSrc="/screenshots/public-fixtures-dark.png"
                                        alt="FixtureFlow embedded fixtures widget showing live matches and results"
                                        urlBar="yourclub.fixtureflow.app/fixtures"
                                    />
                                    <div className="absolute bottom-4 -right-3 border border-border rounded-lg px-4 py-3 w-56 bg-card/90 backdrop-blur-sm shadow-lg">
                                        <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-primary mb-1">What supporters see</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">Live match badges, tournament filters, and scores in real time — exactly what gets embedded on your existing club site.</p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    PUBLIC PAGES
                ══════════════════════════════════════════════════════════ */}
                <section className="border-b border-border">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-12">
                            <Reveal direction="left" className="lg:w-72 shrink-0">
                                <RedLabel>Public pages</RedLabel>
                                <h2 className="font-mono font-bold text-2xl text-foreground mb-4 leading-tight">
                                    A site for your supporters, out of the box.
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    Every FixtureFlow club gets a clean, public-facing site. Supporters check fixtures, results, standings, and brackets — no account, no app, no friction.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Works on every device. Light and dark mode. Always up to date.
                                </p>
                            </Reveal>
                            <Reveal className="flex-1">
                                <div className="relative pb-10">
                                    <ScreenshotFrame
                                        lightSrc="/screenshots/public-standings-light.png"
                                        darkSrc="/screenshots/public-standings-dark.png"
                                        alt="FixtureFlow public standings page showing league table with team rankings"
                                        urlBar="yourclub.fixtureflow.app/standings"
                                    />
                                    <div className="absolute bottom-4 -right-3 border border-border rounded-lg px-4 py-3 w-56 bg-card/90 backdrop-blur-sm shadow-lg">
                                        <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-primary mb-1">League table</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">P, W, D, L, GD, Pts, and form — recalculated instantly the moment a score is entered. No manual updates.</p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    COMPARISON — highlighted FixtureFlow column
                ══════════════════════════════════════════════════════════ */}
                <section className="border-b border-border bg-card relative overflow-hidden">
                    <span
                        className="absolute right-4 top-4 font-mono font-bold leading-none select-none pointer-events-none"
                        style={{ fontSize: "clamp(5rem, 16vw, 14rem)", color: "var(--border)", opacity: 0.8 }}
                        aria-hidden
                    >
                        03
                    </span>
                    <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
                        <Reveal>
                            <RedLabel>How we compare</RedLabel>
                            <h2 className="font-mono font-bold text-2xl sm:text-[2rem] text-foreground mb-10 leading-tight">
                                Built for clubs that deserve better.
                            </h2>
                        </Reveal>
                        <Reveal delay={80}>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[500px]">
                                    <colgroup>
                                        <col className="w-1/2" />
                                        <col className="w-[18%]" />
                                        <col className="w-[16%]" />
                                        <col className="w-[16%]" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th className="text-left pb-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground font-normal" />
                                            {/* FixtureFlow — highlighted header */}
                                            <th className="pb-0 px-3 text-center">
                                                <div
                                                    className="rounded-t-xl px-3 py-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] font-semibold"
                                                    style={{ background: RED, color: "#fff" }}
                                                >
                                                    FixtureFlow
                                                </div>
                                            </th>
                                            <th className="pb-4 px-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground font-normal">
                                                Pitchero
                                            </th>
                                            <th className="pb-4 px-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground font-normal">
                                                FullTime FA
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comparison.map((row, i) => (
                                            <tr
                                                key={row.feature}
                                                className="border-t border-border"
                                            >
                                                <td className="py-3.5 pr-4 text-sm text-foreground">{row.feature}</td>
                                                {/* FixtureFlow cell — highlighted */}
                                                <td
                                                    className="py-3.5 px-3 text-center border-x"
                                                    style={{
                                                        background: `${RED}09`,
                                                        borderColor: `${RED}30`,
                                                        borderBottomLeftRadius: i === comparison.length - 1 ? "0.75rem" : undefined,
                                                        borderBottomRightRadius: i === comparison.length - 1 ? "0.75rem" : undefined,
                                                    }}
                                                >
                                                    <Tick ok={row.ff} />
                                                </td>
                                                <td className="py-3.5 px-4 text-center"><Tick ok={row.pitchero} /></td>
                                                <td className="py-3.5 px-4 text-center"><Tick ok={row.fulltime} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-muted-foreground mt-5">
                                * Based on publicly available feature information, 2025.
                            </p>
                        </Reveal>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    CTA — forced dark, centered, impactful
                ══════════════════════════════════════════════════════════ */}
                <section
                    id="early-access"
                    className="relative overflow-hidden"
                    style={{ background: DARK_BG, color: DARK_FG }}
                >
                    {/* Glow */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(ellipse 60% 70% at 50% 100%, rgba(232,68,34,0.14), transparent)`,
                        }}
                    />
                    {/* Dot grid */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-32">
                        <div className="max-w-lg mx-auto text-center">
                            <Reveal>
                                <div
                                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-8 border"
                                    style={{ borderColor: `${RED}44`, background: `${RED}14` }}
                                >
                                    <span className="size-1.5 rounded-full shrink-0 animate-pulse" style={{ background: RED }} />
                                    <span className="font-mono text-[0.6375rem] uppercase tracking-[0.18em]" style={{ color: RED }}>
                                        Limited early access
                                    </span>
                                </div>
                                <h2
                                    className="font-mono font-bold text-3xl sm:text-4xl lg:text-5xl mb-5 leading-tight"
                                    style={{ color: DARK_FG }}
                                >
                                    Ready to simplify your club?
                                </h2>
                                <p className="text-sm leading-relaxed mb-10" style={{ color: DARK_MUTED }}>
                                    We&apos;re onboarding clubs one by one to get the experience right.
                                    Leave your details and we&apos;ll be in touch.
                                </p>
                            </Reveal>
                            <Reveal delay={100}>
                                <InterestForm />
                            </Reveal>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <footer
                className="border-t"
                style={{ borderColor: DARK_BORDER, background: DARK_BG }}
            >
                <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <Image src="/logo-inverse.svg" alt="FixtureFlow" width={100} height={22} />
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <Link href="/fixtures" className="text-xs transition-colors hover:opacity-80" style={{ color: DARK_MUTED }}>
                            Public site
                        </Link>
                        <Link href="/dashboard" className="text-xs transition-colors hover:opacity-80" style={{ color: DARK_MUTED }}>
                            Admin sign in
                        </Link>
                        <span className="text-xs" style={{ color: `${DARK_MUTED}80` }}>
                            © {new Date().getFullYear()} FixtureFlow · v{commitSha}
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
