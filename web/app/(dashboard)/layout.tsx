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
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 md:block fixed inset-y-0 left-0 z-50 border-r bg-slate-50/40 dark:bg-slate-900/40">
                <Sidebar className="border-none" />
            </aside>

            <main className="flex-1 md:pl-64">
                {/* Desktop Header */}
                <header className="hidden md:flex h-16 border-b items-center justify-between px-8 bg-white sticky top-0 z-40">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                        <div className="h-8 w-[1px] bg-slate-100 mx-2" />
                        <Button variant="ghost" size="sm" className="gap-2">
                            <UserCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">My Profile</span>
                        </Button>
                    </div>
                </header>

                {/* Mobile Header */}
                <div className="md:hidden h-16 border-b flex items-center justify-between px-4 bg-background">
                    <div className="flex items-center gap-2">
                        <MobileSidebar />
                        <span className="font-semibold text-lg flex items-center gap-2">
                            AFS Manager
                        </span>
                    </div>
                    <NotificationCenter />
                </div>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
