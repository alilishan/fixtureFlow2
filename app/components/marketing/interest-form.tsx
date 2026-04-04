"use client"

import { useActionState } from "react"
import { submitInterestAction } from "@/lib/actions/interest"
import { ArrowRight, CheckCircle } from "lucide-react"

export function InterestForm({ variant = "default" }: { variant?: "default" | "compact" }) {
    const [state, action, pending] = useActionState(submitInterestAction, null)

    if (state?.success) {
        return (
            <div className="flex items-center gap-2.5 text-sm text-foreground">
                <CheckCircle size={16} className="text-primary shrink-0" />
                <span>You&apos;re on the list — we&apos;ll be in touch.</span>
            </div>
        )
    }

    return (
        <form action={action} className={variant === "compact" ? "flex flex-col gap-2" : "flex flex-col gap-3"}>
            <div className={`flex gap-2 ${variant === "compact" ? "flex-col sm:flex-row" : "flex-col sm:flex-row"}`}>
                <input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="flex-1 h-11 px-4 bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring transition-colors rounded-md"
                />
                <button
                    type="submit"
                    disabled={pending}
                    className="h-11 px-5 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60 flex items-center gap-2 justify-center whitespace-nowrap"
                >
                    {pending ? "Sending…" : "Get early access"}
                    {!pending && <ArrowRight size={14} />}
                </button>
            </div>
            {state?.error && (
                <p className="text-xs text-destructive">{state.error}</p>
            )}
            <p className="text-xs text-muted-foreground">No spam. No credit card. Just early access.</p>
        </form>
    )
}
