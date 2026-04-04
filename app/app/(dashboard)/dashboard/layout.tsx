import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        /* Outer page: bg-background with padding so the white card floats */
        <div className="min-h-screen bg-background lg:p-5">
            {/* Inner card: white, rounded, fills viewport on mobile, floats on desktop */}
            <div className="flex h-screen lg:h-[calc(100vh-2.5rem)] overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-card lg:rounded-2xl lg:border lg:border-border lg:shadow-float">
                    <Topbar />
                    {/* mt-14 clears the mobile fixed topbar; desktop has no overlap */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 mt-14 lg:mt-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
