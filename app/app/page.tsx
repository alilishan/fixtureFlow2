import Link from "next/link"

export default function MarketingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
            <div className="text-center max-w-md">
                <span
                    className="font-display text-[2.5rem] tracking-[0.06em] select-none block mb-4"
                    aria-label="FixtureFlow"
                >
                    <span className="text-foreground">Fixture</span>
                    <span className="text-primary">Flow</span>
                </span>
                <p className="font-sans font-light text-muted-foreground text-lg mb-10">
                    Football club management, beautifully simple.
                </p>
                <p className="text-sm text-muted-foreground">
                    Marketing page coming soon.{" "}
                    <Link href="/dashboard" className="text-primary hover:underline">
                        Admin dashboard →
                    </Link>
                </p>
            </div>
        </div>
    )
}
