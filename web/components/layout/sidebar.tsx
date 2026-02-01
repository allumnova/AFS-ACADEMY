"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    CreditCard,
    Calendar
} from "lucide-react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        role: "admin",
    },
    {
        title: "Courses",
        href: "/admin/courses",
        icon: BookOpen,
        role: "admin", // and faculty
    },
    {
        title: "Students",
        href: "/admin/students",
        icon: Users,
        role: "admin",
    },
    {
        title: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
        role: "admin",
    },
    // Faculty Routes
    {
        title: "Dashboard",
        href: "/faculty",
        icon: LayoutDashboard,
        role: "faculty",
    },
    {
        title: "My Courses",
        href: "/faculty/courses",
        icon: BookOpen,
        role: "faculty",
    },
    {
        title: "Schedule",
        href: "/faculty/schedule",
        icon: Calendar,
        role: "faculty",
    },
    // Student Routes
    {
        title: "Dashboard",
        href: "/student",
        icon: LayoutDashboard,
        role: "student",
    },
    {
        title: "My Learning",
        href: "/student/courses",
        icon: BookOpen,
        role: "student",
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        role: "all",
    },
]

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()
    // Simple client-side role check
    const [role, setRole] = React.useState<string | null>(null);

    React.useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setRole(user.role);
            } catch (e) { console.error("Error parsing user", e) }
        }
    }, []);

    const filteredItems = sidebarItems.filter(item => {
        if (item.role === 'all') return true;
        if (item.role === role) return true;
        return false;
    });

    return (
        <div className={cn("pb-12 h-screen border-r bg-white dark:bg-slate-950 flex flex-col shadow-sm", className)}>
            <div className="space-y-4 py-8 flex-1">
                <div className="px-4">
                    <div className="flex items-center gap-3 px-2 mb-10 group cursor-pointer">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110 duration-300">
                            <span className="text-white font-black text-xl">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">AFS Academy</span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Management</span>
                        </div>
                    </div>

                    <h2 className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {role === 'admin' ? 'Administration' : role === 'faculty' ? 'Faculty Portal' : 'Student Menu'}
                    </h2>
                    <div className="space-y-1">
                        {filteredItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <div className={cn(
                                    "flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 group relative mx-2",
                                    pathname === item.href
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                                )}>
                                    <item.icon className={cn("mr-3 h-4 w-4 transition-colors", pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200")} />
                                    <span className="tracking-tight">{item.title}</span>
                                    {pathname === item.href && (
                                        <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                    }}
                    className="flex items-center w-full rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-red-500 hover:text-white transition-all duration-300 group shadow-sm hover:shadow-red-500/20"
                >
                    <LogOut className="mr-3 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
