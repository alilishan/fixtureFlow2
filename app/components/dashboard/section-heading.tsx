import { cn } from "@/lib/utils"

interface SectionHeadingProps {
    children: React.ReactNode
    className?: string
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
    return (
        <h2 className={cn("font-mono font-semibold text-lg", className)}>
            {children}
        </h2>
    )
}
