"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
    const { setTheme } = useTheme()

    function toggle() {
        const isDark = document.documentElement.classList.contains("dark")
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <button
            onClick={toggle}
            className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
            aria-label="Toggle theme"
        >
            <Sun size={15} className="hidden dark:block" />
            <Moon size={15} className="block dark:hidden" />
        </button>
    )
}
