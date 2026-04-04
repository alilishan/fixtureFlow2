export function MatchStatusBadge({ status }: { status: string }) {
    if (status === "LIVE") {
        return (
            <span className="inline-flex items-center gap-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em] px-2 py-0.5 border border-primary/40 bg-primary/10 text-primary badge-live">
                <span className="size-1 rounded-full bg-primary animate-[blink_1.2s_ease-in-out_infinite]" />
                Live
            </span>
        )
    }
    if (status === "FINISHED") {
        return (
            <span className="inline-flex items-center text-[0.625rem] font-semibold uppercase tracking-[0.18em] px-2 py-0.5 bg-secondary text-[#555555]">
                FT
            </span>
        )
    }
    return null
}
