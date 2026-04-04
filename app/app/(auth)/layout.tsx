import { clubConfig } from "@/lib/club-config"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* App brand */}
                <div className="mb-8 text-center">
                    <p
                        className="font-display text-[2.5rem] tracking-[0.04em] leading-none mb-4"
                        aria-label="FixtureFlow"
                    >
                        <span className="text-foreground">Fixture</span>
                        <span className="text-primary">Flow</span>
                    </p>

                    {/* Club name */}
                    <p className="text-[0.75rem] uppercase tracking-[0.22em] text-muted-foreground">
                        {clubConfig.name}
                        {clubConfig.tagline ? ` · ${clubConfig.tagline}` : ""}
                    </p>
                </div>
                {children}
            </div>
        </div>
    )
}
