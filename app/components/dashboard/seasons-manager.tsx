"use client"

import { useState, useTransition } from "react"
import { Check, Plus } from "lucide-react"
import { setActiveSeason } from "@/lib/actions/season"
import { Button } from "@/components/ui/button"

export function SeasonsManager({
    seasons,
    activeSeason,
    currentSeason,
}: {
    seasons: string[]
    activeSeason: string
    currentSeason: string
}) {
    const [, startTransition] = useTransition()
    const [adding, setAdding] = useState(false)
    const [input, setInput] = useState("")
    const [allSeasons, setAllSeasons] = useState(seasons)
    const [active, setActive] = useState(activeSeason)

    function handleSetActive(season: string) {
        setActive(season)
        startTransition(() => setActiveSeason(season))
    }

    function handleAdd() {
        const trimmed = input.trim()
        if (!trimmed || allSeasons.includes(trimmed)) return
        const updated = [trimmed, ...allSeasons].sort().reverse()
        setAllSeasons(updated)
        setActive(trimmed)
        startTransition(() => setActiveSeason(trimmed))
        setInput("")
        setAdding(false)
    }

    return (
        <div className="flex flex-col gap-2">
            {allSeasons.map((s) => (
                <div
                    key={s}
                    className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3"
                >
                    <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-foreground">{s}</span>
                        {s === currentSeason && (
                            <span className="text-[0.625rem] font-semibold uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                                Current
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => handleSetActive(s)}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                            s === active
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Check size={13} className={s === active ? "opacity-100" : "opacity-0"} />
                        {s === active ? "Active" : "Set active"}
                    </button>
                </div>
            ))}

            {adding ? (
                <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                    <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAdd()
                            if (e.key === "Escape") setAdding(false)
                        }}
                        placeholder="e.g. 2026/27"
                        className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground font-mono"
                    />
                    <button
                        onClick={handleAdd}
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        Add
                    </button>
                    <button
                        onClick={() => setAdding(false)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <Button
                    variant="outline"
                    onClick={() => setAdding(true)}
                    className="w-fit"
                >
                    <Plus size={13} />
                    Add season
                </Button>
            )}
        </div>
    )
}
