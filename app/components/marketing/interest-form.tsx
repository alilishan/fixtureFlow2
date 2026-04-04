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

    const isCompact = variant === "compact"

    return (
        <form action={action} className="flex flex-col gap-3">
            <div className={`grid gap-3 ${isCompact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
                <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="h-11 px-4 bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring transition-colors rounded-md"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="h-11 px-4 bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring transition-colors rounded-md"
                />
            </div>
            <input
                name="clubName"
                type="text"
                placeholder="Club name (optional)"
                className="h-11 px-4 bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring transition-colors rounded-md"
            />
            {!isCompact && (
                <textarea
                    name="message"
                    placeholder="Anything you'd like us to know? (optional)"
                    rows={3}
                    className="px-4 py-3 bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring transition-colors rounded-md resize-none"
                />
            )}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <button
                    type="submit"
                    disabled={pending}
                    className="h-11 px-6 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60 flex items-center gap-2 justify-center whitespace-nowrap"
                >
                    {pending ? "Sending…" : "Get early access"}
                    {!pending && <ArrowRight size={14} />}
                </button>
                <p className="text-xs text-muted-foreground">No spam. No credit card. Just early access.</p>
            </div>
            {state?.error && (
                <p className="text-xs text-destructive">{state.error}</p>
            )}
        </form>
    )
}
