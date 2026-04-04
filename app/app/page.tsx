import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { InterestForm } from "@/components/marketing/interest-form"
import {
    Calendar,
    BarChart2,
    Trophy,
    Layers,
    Globe,
    Users,
    Check,
    X,
    Code2,
    Zap,
    ArrowRight,
} from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
    {
        icon: Zap,
        title: "Live Score Updates",
        description:
            "Enter scores from any device and watch standings recalculate instantly. No refresh, no delay, no spreadsheet.",
    },
    {
        icon: Globe,
        title: "Embeddable Widgets",
        description:
            "Already have a club website? Drop your fixtures or standings table anywhere with a single embed code.",
    },
    {
        icon: Trophy,
        title: "Knockout Brackets",
        description:
            "Run cup competitions and playoffs with automatic bracket progression. Handles byes, replays, and finals.",
    },
    {
        icon: Layers,
        title: "Season Scoping",
        description:
            "Switch between seasons in one click. Full history stays intact — your current season stays clean and focused.",
    },
    {
        icon: Calendar,
        title: "Public Club Pages",
        description:
            "A ready-made public site — fixtures, standings, bracket. Share a link with supporters, no setup needed.",
    },
    {
        icon: Users,
        title: "Multi-Age-Group Support",
        description:
            "Manage every team from U7 to adults under one roof. Coaches see only their teams. Admins see everything.",
    },
]

const comparison = [
    { feature: "Live score updates",     ff: true,  pitchero: true,  fulltime: false },
    { feature: "Embeddable widgets",     ff: true,  pitchero: false, fulltime: false },
    { feature: "Tournament brackets",    ff: true,  pitchero: false, fulltime: false },
    { feature: "Season history",         ff: true,  pitchero: false, fulltime: false },
    { feature: "Public club pages",      ff: true,  pitchero: true,  fulltime: false },
    { feature: "No per-player fees",     ff: true,  pitchero: false, fulltime: true  },
    { feature: "Multi-age-group",        ff: true,  pitchero: true,  fulltime: false },
    { feature: "Role-based access",      ff: true,  pitchero: true,  fulltime: false },
]

const stats = [
    { value: "1 dashboard", label: "for every team & age group" },
    { value: "Real-time", label: "standings after every score" },
    { value: "Zero setup", label: "for public club pages" },
]

// ─── Components ──────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary mb-3">
            {children}
        </p>
    )
}

function ScreenshotPlaceholder({
    label,
    description,
    tall,
}: {
    label: string
    description: string
    tall?: boolean
}) {
    return (
        <div
            className={`w-full rounded-xl border border-border bg-muted/50 flex flex-col items-center justify-center text-center gap-3 px-6 ${tall ? "min-h-[480px]" : "min-h-[340px]"}`}
            style={{
                backgroundImage:
                    "repeating-linear-gradient(0deg,transparent,transparent 39px,var(--border) 39px,var(--border) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,var(--border) 39px,var(--border) 40px)",
            }}
        >
            <div className="bg-card border border-border rounded-lg px-5 py-4 max-w-sm">
                <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1.5">
                    Screenshot
                </p>
                <p className="font-sans font-semibold text-sm text-foreground mb-1">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </div>
    )
}

function Tick({ ok }: { ok: boolean }) {
    return ok ? (
        <Check size={15} className="text-[var(--win)] mx-auto" />
    ) : (
        <X size={15} className="text-muted-foreground/40 mx-auto" />
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* ── Nav ─────────────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border">
                <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
                    <Logo width={120} />
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="hidden sm:block text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sign in
                        </Link>
                        <a
                            href="#early-access"
                            className="h-8 px-4 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-1.5"
                        >
                            Get early access
                            <ArrowRight size={11} />
                        </a>
                    </div>
                </div>
            </nav>

            <main>
                {/* ── Hero ────────────────────────────────────────────────── */}
                <section
                    className="relative border-b border-border overflow-hidden"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--primary) 6%, transparent), transparent 60%)",
                    }}
                >
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/8 rounded-full px-3 py-1 mb-7">
                                <span className="size-1.5 rounded-full bg-primary shrink-0" />
                                <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-primary">
                                    Early access — now open
                                </span>
                            </div>

                            <h1 className="font-mono font-bold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] tracking-tight text-foreground mb-6">
                                From fixtures
                                <br />
                                to final whistles.
                            </h1>

                            <p className="font-sans text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
                                FixtureFlow is the clean, modern club management platform for football
                                clubs who want beautiful fixtures, live results, and automatic
                                standings — without the complexity or the cost.
                            </p>

                            <InterestForm />
                        </div>
                    </div>
                </section>

                {/* ── Stats bar ───────────────────────────────────────────── */}
                <section className="border-b border-border bg-card">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                        {stats.map((s) => (
                            <div key={s.label} className="py-5 sm:py-0 sm:px-8 first:pl-0 last:pr-0">
                                <p className="font-mono font-bold text-xl text-foreground mb-0.5">
                                    {s.value}
                                </p>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Problem ─────────────────────────────────────────────── */}
                <section className="border-b border-border">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
                        <div className="max-w-2xl">
                            <SectionLabel>The problem</SectionLabel>
                            <h2 className="font-mono font-bold text-2xl sm:text-3xl text-foreground mb-5">
                                Most clubs are still managing fixtures in WhatsApp groups and
                                Google Sheets.
                            </h2>
                            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                                <p>
                                    The alternatives — Pitchero, FullTime FA, TeamSnap — were built for a different era. They&apos;re slow, cluttered, and often require every parent and player to download yet another app before they can see anything.
                                </p>
                                <p>
                                    Pitchero charges per-player. FullTime FA looks like it was designed in 2005. TeamSnap is built for the US market and priced to match. None of them let you embed your standings table on your existing club website.
                                </p>
                                <p className="text-foreground font-medium">
                                    FixtureFlow is different. One admin dashboard. Beautiful public pages. Widgets you can drop onto any website. And a design that doesn&apos;t make your eyes bleed.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Features ────────────────────────────────────────────── */}
                <section className="border-b border-border bg-card">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
                        <SectionLabel>Features</SectionLabel>
                        <h2 className="font-mono font-bold text-2xl sm:text-3xl text-foreground mb-3">
                            Everything your club actually needs.
                        </h2>
                        <p className="text-sm text-muted-foreground mb-12 max-w-lg">
                            Built around how clubs actually work — multiple teams, multiple age groups, real tournaments, and supporters who just want to see the results.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
                            {features.map((f) => {
                                const Icon = f.icon
                                return (
                                    <div
                                        key={f.title}
                                        className="bg-card p-7 group hover:bg-muted/40 transition-colors"
                                    >
                                        <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                                            <Icon size={15} className="text-primary" />
                                        </div>
                                        <h3 className="font-mono font-semibold text-sm text-foreground mb-2">
                                            {f.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {f.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* ── Screenshot 1: Dashboard ──────────────────────────────── */}
                <section className="border-b border-border">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-12">
                            <div className="lg:w-80 shrink-0">
                                <SectionLabel>The dashboard</SectionLabel>
                                <h2 className="font-mono font-bold text-2xl text-foreground mb-4">
                                    One place for everything.
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                    The admin dashboard gives you a clear overview of every fixture, result, and standing across all your tournaments and age groups — filtered to the current season.
                                </p>
                                <ul className="space-y-2.5">
                                    {[
                                        "Switch seasons without losing history",
                                        "Update scores from any device",
                                        "Manage all age groups from one place",
                                        "Role-based access for coaches & admins",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                            <Check size={13} className="text-primary mt-0.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1">
                                <ScreenshotPlaceholder
                                    tall
                                    label="Dashboard — Fixtures view"
                                    description="Show the main fixtures list page with match cards showing home/away teams, scores, status badges (upcoming/live/full-time), and the sidebar navigation with season switcher visible."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Embed section ───────────────────────────────────────── */}
                <section className="border-b border-border bg-card">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
                        <div className="flex flex-col lg:flex-row-reverse lg:items-start gap-12">
                            <div className="lg:w-80 shrink-0">
                                <SectionLabel>Embeddable widgets</SectionLabel>
                                <h2 className="font-mono font-bold text-2xl text-foreground mb-4">
                                    Your existing website, upgraded.
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                    Already have a Wix, Squarespace, or WordPress site for your club? Don&apos;t rebuild it. Just drop in one line of code and your live fixtures and standings appear automatically.
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    No API keys. No plugin. Just copy, paste, done.
                                </p>
                            </div>
                            <div className="flex-1 space-y-4">
                                {/* Code snippet */}
                                <div className="rounded-lg border border-border bg-background overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
                                        <div className="flex gap-1.5">
                                            <span className="size-2.5 rounded-full bg-border" />
                                            <span className="size-2.5 rounded-full bg-border" />
                                            <span className="size-2.5 rounded-full bg-border" />
                                        </div>
                                        <span className="font-mono text-[0.6875rem] text-muted-foreground ml-1">
                                            embed.html
                                        </span>
                                    </div>
                                    <pre className="px-5 py-4 text-[0.75rem] leading-relaxed overflow-x-auto">
                                        <code>
                                            <span className="text-muted-foreground">{`<!-- Paste anywhere on your club site -->`}</span>
                                            {"\n"}
                                            <span className="text-primary">{`<iframe`}</span>
                                            {"\n  "}
                                            <span className="text-foreground">{`src`}</span>
                                            <span className="text-muted-foreground">{`="`}</span>
                                            <span className="text-foreground">{`https://yourclub.fixtureflow.app/embed/fixtures`}</span>
                                            <span className="text-muted-foreground">{`"`}</span>
                                            {"\n  "}
                                            <span className="text-foreground">{`width`}</span>
                                            <span className="text-muted-foreground">{`="`}</span>
                                            <span className="text-foreground">100%</span>
                                            <span className="text-muted-foreground">{`"`}</span>
                                            {"\n  "}
                                            <span className="text-foreground">{`height`}</span>
                                            <span className="text-muted-foreground">{`="`}</span>
                                            <span className="text-foreground">500</span>
                                            <span className="text-muted-foreground">{`"`}</span>
                                            {"\n  "}
                                            <span className="text-foreground">{`frameborder`}</span>
                                            <span className="text-muted-foreground">{`="`}</span>
                                            <span className="text-foreground">0</span>
                                            <span className="text-muted-foreground">{`"`}</span>
                                            {"\n"}
                                            <span className="text-primary">{`/>`}</span>
                                        </code>
                                    </pre>
                                </div>
                                <ScreenshotPlaceholder
                                    label="Embedded fixtures widget"
                                    description="Show the /embed/fixtures widget as it would appear embedded on a third-party website — compact fixture list with team names, dates, scores, and the FixtureFlow watermark at the bottom."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Public pages ────────────────────────────────────────── */}
                <section className="border-b border-border">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-12">
                            <div className="lg:w-80 shrink-0">
                                <SectionLabel>Public pages</SectionLabel>
                                <h2 className="font-mono font-bold text-2xl text-foreground mb-4">
                                    A site for your supporters, out of the box.
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                    Every FixtureFlow club gets a clean, public-facing site. Supporters can check fixtures, results, standings, and brackets — no account, no app, no friction.
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Works on every device. Looks good in light and dark mode. Always up to date.
                                </p>
                            </div>
                            <div className="flex-1">
                                <ScreenshotPlaceholder
                                    tall
                                    label="Public fixtures & standings page"
                                    description="Show the public-facing /fixtures page — a clean list of upcoming and past matches with scores, plus a link to the standings table. Club logo and name visible in the top nav. Mobile-friendly layout."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Comparison ──────────────────────────────────────────── */}
                <section className="border-b border-border bg-card">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
                        <SectionLabel>How we compare</SectionLabel>
                        <h2 className="font-mono font-bold text-2xl sm:text-3xl text-foreground mb-10">
                            Built for clubs that deserve better.
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[480px]">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 pr-6 font-mono text-xs uppercase tracking-widest text-muted-foreground font-normal w-1/2">
                                            Feature
                                        </th>
                                        <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                                            FixtureFlow
                                        </th>
                                        <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-muted-foreground font-normal">
                                            Pitchero
                                        </th>
                                        <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-muted-foreground font-normal">
                                            FullTime FA
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparison.map((row, i) => (
                                        <tr
                                            key={row.feature}
                                            className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/30"}`}
                                        >
                                            <td className="py-3.5 pr-6 text-sm text-foreground">{row.feature}</td>
                                            <td className="py-3.5 px-4 text-center">
                                                <Tick ok={row.ff} />
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <Tick ok={row.pitchero} />
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <Tick ok={row.fulltime} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-5">
                            * Comparison based on publicly available feature information as of 2025.
                        </p>
                    </div>
                </section>

                {/* ── Final CTA ───────────────────────────────────────────── */}
                <section id="early-access" className="border-b border-border">
                    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
                        <div className="max-w-lg mx-auto text-center">
                            <SectionLabel>Early access</SectionLabel>
                            <h2 className="font-mono font-bold text-3xl sm:text-4xl text-foreground mb-4">
                                Ready to simplify your club?
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-10">
                                We&apos;re onboarding clubs one by one to make sure the experience is right.
                                Drop your email and we&apos;ll reach out when we&apos;re ready for you.
                            </p>
                            <InterestForm />
                        </div>
                    </div>
                </section>
            </main>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <footer className="border-t border-border">
                <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Logo width={100} />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <Link
                            href="/fixtures"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Public site
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Admin sign in
                        </Link>
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} FixtureFlow
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
