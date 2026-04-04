import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function MarketingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
            <div className="text-center max-w-md">
                <Logo width={200} className="mb-4" />
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
