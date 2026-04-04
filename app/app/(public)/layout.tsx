import Link from "next/link"
import Image from "next/image"
import { Logo } from "@/components/ui/logo"
import { clientEnv } from "@/lib/env.client"

function getInitials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const clubName = clientEnv.NEXT_PUBLIC_CLUB_NAME
    const logoUrl = clientEnv.NEXT_PUBLIC_CLUB_LOGO_URL
    const primaryColor = clientEnv.NEXT_PUBLIC_CLUB_PRIMARY_COLOR

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border bg-card sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
                    {/* Club branding */}
                    <Link href="/fixtures" className="flex items-center gap-2.5 shrink-0">
                        <div
                            className="size-8 rounded flex items-center justify-center overflow-hidden shrink-0"
                            style={{ background: primaryColor }}
                        >
                            {logoUrl ? (
                                <Image
                                    src={logoUrl}
                                    alt={clubName}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                />
                            ) : (
                                <span className="font-sans font-bold text-[0.625rem] text-white leading-none">
                                    {getInitials(clubName)}
                                </span>
                            )}
                        </div>
                        <span className="font-bold text-sm text-foreground truncate max-w-[160px]">
                            {clubName}
                        </span>
                    </Link>

                    {/* Nav links */}
                    <nav className="flex items-center gap-1 flex-1">
                        <Link
                            href="/fixtures"
                            className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                            Fixtures
                        </Link>
                        <Link
                            href="/standings"
                            className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                            Standings
                        </Link>
                        <Link
                            href="/bracket"
                            className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                            Bracket
                        </Link>
                    </nav>

                    <Link
                        href="/dashboard"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    >
                        Admin →
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>

            <footer className="border-t border-border mt-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{clubName}</p>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        Powered by <Logo width={72} />
                    </span>
                </div>
            </footer>
        </div>
    )
}
