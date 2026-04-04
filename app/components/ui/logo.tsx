import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
    /** Width of the rendered logo */
    width?: number
    className?: string
}

/**
 * FixtureFlow wordmark — automatically switches between
 * logo.svg (light) and logo-inverse.svg (dark) via CSS.
 */
export function Logo({ width = 140, className }: LogoProps) {
    const height = Math.round(width * (142.6 / 824.6))

    return (
        <span className={cn("inline-flex select-none", className)} aria-label="FixtureFlow">
            {/* Light mode */}
            <Image
                src="/logo.svg"
                alt="FixtureFlow"
                width={width}
                height={height}
                className="dark:hidden"
                priority
            />
            {/* Dark mode */}
            <Image
                src="/logo-inverse.svg"
                alt="FixtureFlow"
                width={width}
                height={height}
                className="hidden dark:block"
                priority
            />
        </span>
    )
}

/**
 * FixtureFlow square mark (icon only).
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
    return (
        <Image
            src="/logo-mark.svg"
            alt="FixtureFlow"
            width={size}
            height={size}
            className={cn("select-none", className)}
            priority
        />
    )
}
