export default function EmbedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background text-foreground text-sm">
            {children}
        </div>
    )
}
