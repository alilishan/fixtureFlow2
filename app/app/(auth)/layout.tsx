import { clubConfig } from "@/lib/club-config"
import { Logo } from "@/components/ui/logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* App brand */}
                <div className="mb-8 text-center flex flex-col items-center gap-3">
                    <Logo width={160} />
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
