import { Sidebar } from "@/components/layout/sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { UserCircle } from "lucide-react"
import NotificationCenter from "@/components/NotificationCenter"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-slate-50 text-slate-900 relative">

            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 md:block fixed inset-y-0 left-0 z-50">
                <Sidebar className="h-full shadow-sm bg-white border-r border-slate-200" />
            </aside>

            <main className="flex-1 md:pl-64 flex flex-col min-h-screen">
                {/* Desktop Header */}
                <header className="hidden md:flex h-16 items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                        <div className="h-6 w-[1px] bg-slate-200 mx-1" />
                        <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg">
                            <UserCircle className="h-5 w-5" />
                            <span className="text-sm font-semibold">Profile</span>
                        </Button>
                    </div>
                </header>

                {/* Mobile Header */}
                <div className="md:hidden h-16 border-b border-slate-200 flex items-center justify-between px-4 bg-white sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-2">
                        <MobileSidebar />
                        <span className="font-bold text-lg flex items-center gap-2 text-slate-900">
                            AFS Manager
                        </span>
                    </div>
                    <NotificationCenter />
                </div>

                <div className="p-6 md:p-8 animate-fade-in flex-1">
                    {children}
                </div>
            </main>
        </div>
    )
}
