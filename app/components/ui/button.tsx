"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    // Base: brand typography — uppercase, tracked, semibold, 2px radius
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm border border-transparent px-[18px] text-[0.8125rem] font-semibold uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-100 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
    {
        variants: {
            variant: {
                // Solid accent fill
                default:
                    "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] active:bg-[var(--primary-hover)]",
                // Ghost border — hover turns accent
                outline:
                    "border-[var(--border-strong)] bg-transparent text-foreground hover:border-primary hover:text-primary",
                // Muted ghost
                ghost: "bg-transparent text-muted-foreground hover:bg-card hover:text-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20",
                link: "text-primary underline-offset-4 hover:underline px-0 tracking-normal normal-case",
            },
            size: {
                default: "h-8 px-[18px]",
                sm: "h-7 px-3 text-[0.6875rem]",
                lg: "h-10 px-6",
                icon: "size-8 px-0",
                "icon-sm": "size-7 px-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

function Button({
    className,
    variant = "default",
    size = "default",
    ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
    return (
        <ButtonPrimitive
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }
