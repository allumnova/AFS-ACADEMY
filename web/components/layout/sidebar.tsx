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
        <div className={cn("pb-12 h-screen border-r bg-white dark:bg-slate-950", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 px-4 mb-8 text-primary">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">To Admin</span>
                    </div>

                    <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {role === 'admin' ? 'Admin Panel' : role === 'faculty' ? 'Faculty Portal' : 'Student Dashboard'}
                    </h2>
                    <div className="space-y-1">
                        {filteredItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <div className={cn(
                                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 group relative",
                                    pathname === item.href
                                        ? "bg-primary/5 text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200"
                                )}>
                                    {pathname === item.href && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                                    )}
                                    <item.icon className={cn("mr-3 h-4 w-4", pathname === item.href ? "text-primary" : "text-slate-400 group-hover:text-slate-500")} />
                                    <span>{item.title}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-auto p-4 border-t">
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                    }}
                    className="flex items-center w-full rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
