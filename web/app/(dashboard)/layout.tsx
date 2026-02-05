import { Sidebar } from "@/components/layout/sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { LayoutDashboard, UserCircle } from "lucide-react"
import NotificationCenter from "@/components/NotificationCenter"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row mesh-gradient">
            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 md:block fixed inset-y-0 left-0 z-50 transition-all duration-300">
                <div className="h-full border-r border-white/20 dark:border-slate-800/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                    <Sidebar className="border-none bg-transparent" />
                </div>
            </aside>

            <main className="flex-1 md:pl-64">
                {/* Desktop Header */}
                <header className="hidden md:flex h-16 border-b border-white/20 dark:border-slate-800/20 items-center justify-between px-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm sticky top-0 z-40">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                        <div className="h-8 w-[1px] bg-slate-200/50 mx-2" />
                        <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/20">
                            <UserCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">My Profile</span>
                        </Button>
                    </div>
                </header>

                {/* Mobile Header */}
                <div className="md:hidden h-16 border-b border-white/20 flex items-center justify-between px-4 bg-white/40 backdrop-blur-sm sticky top-0 z-40">
                    <div className="flex items-center gap-2">
                        <MobileSidebar />
                        <span className="font-semibold text-lg flex items-center gap-2">
                            AFS Manager
                        </span>
                    </div>
                    <NotificationCenter />
                </div>

                <div className="p-4 md:p-8 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    )
}
