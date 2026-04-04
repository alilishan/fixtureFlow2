"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
    children: React.ReactNode
    delay?: number
    className?: string
    /** "up" slides from below, "left" from the left, "none" just fades */
    direction?: "up" | "left" | "none"
}

export function Reveal({ children, delay = 0, className, direction = "up" }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const from =
        direction === "up"
            ? "translateY(22px)"
            : direction === "left"
            ? "translateX(-16px)"
            : "none"

    return (
        <div
            ref={ref}
            className={cn(className)}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : from,
                transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}
