"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function PasswordInput({
    className,
    ...props
}: Omit<React.ComponentProps<"input">, "type">) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="relative">
            <input
                type={visible ? "text" : "password"}
                className={cn(
                    "flex h-10 w-full rounded-md border border-border bg-input px-3 pr-10 text-sm text-foreground",
                    "outline-none transition-colors focus:border-ring",
                    "placeholder:text-muted-foreground",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={visible ? "Hide password" : "Show password"}
            >
                {visible ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
        </div>
    )
}
