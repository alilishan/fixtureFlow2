import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"
import { clubConfig } from "@/lib/club-config"
import "./globals.css"

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-sans",
    display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "600"],
    variable: "--font-mono",
    display: "swap",
})

export const metadata: Metadata = {
    title: clubConfig.name,
    description: clubConfig.tagline || `${clubConfig.name} — Fixtures, Results & Standings`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning
        >
            <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Providers>{children}</Providers>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                color: "var(--foreground)",
                                borderRadius: "2px",
                            },
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    )
}
