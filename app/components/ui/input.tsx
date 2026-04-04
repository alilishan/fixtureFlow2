import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex h-10 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground",
                "outline-none transition-colors",
                "focus:border-ring",
                "placeholder:text-muted-foreground",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
}

export { Input }
