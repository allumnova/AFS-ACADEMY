"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import axios from "axios"
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    CreditCard,
    Calendar,
    MessageSquare,
    Megaphone,
    TrendingUp,
    Image as ImageIcon,
    History
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
        role: "admin",
    },
    {
        title: "Batches",
        href: "/admin/batches",
        icon: Calendar,
        role: "admin",
    },
    {
        title: "Revenue",
        href: "/admin/revenue",
        icon: TrendingUp,
        role: "admin",
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
    {
        title: "Gallery",
        href: "/admin/gallery",
        icon: ImageIcon,
        role: "admin",
    },
    {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Megaphone,
        role: "admin",
    },
    {
        title: "Feedback",
        href: "/admin/feedback",
        icon: MessageSquare,
        role: "admin",
    },
    // Super Admin Routes
    {
        title: "Admins",
        href: "/admin/admins",
        icon: Users,
        role: "super-admin",
    },
    {
        title: "Platform",
        href: "/admin/settings",
        icon: Settings,
        role: "super-admin",
    },
    {
        title: "Audit Logs",
        href: "/admin/audit-logs",
        icon: History,
        role: "super-admin",
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
    const [isSuperAdmin, setIsSuperAdmin] = React.useState(false);
    const [branding, setBranding] = React.useState({ name: "AFS Academy", logo: "" });

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setRole(user.role);
                    setIsSuperAdmin(!!user.isSuperAdmin);
                } catch (e) { console.error("Error parsing user", e) }
            }
            fetchBranding();
        }
    }, []);

    const fetchBranding = async () => {
        try {
            if (typeof window === 'undefined') return;
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/public-settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const settings = res.data;
            const siteName = settings.find((s: any) => s.key === "SITE_NAME")?.value;
            const logoUrl = settings.find((s: any) => s.key === "LOGO_URL")?.value;
            if (siteName || logoUrl) {
                setBranding({
                    name: siteName || "AFS Academy",
                    logo: logoUrl || ""
                });
            }
        } catch (error) {
            console.error("Failed to fetch branding", error);
        }
    }

    // Filter items based on role and super-admin status (calculated safely with state)
    const filteredItems = sidebarItems.filter(item => {
        if (item.role === 'all') return true;
        if (item.role === 'super-admin') {
            return isSuperAdmin;
        }
        if (item.role === role) return true;
        return false;
    });

    return (
        <div className={cn("pb-12 h-screen flex flex-col bg-slate-50 border-r border-slate-200", className)}>
            <div className="space-y-4 py-8 flex-1">
                <div className="px-6 mb-8">
                    <Link href="/" className="flex items-center gap-3 px-2 group cursor-pointer">
                        {branding.logo ? (
                            <img src={branding.logo} alt="Logo" className="h-9 w-9 object-contain rounded-lg shadow-sm" />
                        ) : (
                            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                                <span className="text-white font-black text-lg">{branding.name.charAt(0)}</span>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">{branding.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {role ? role : 'Management'}
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="px-3">
                    <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Menu
                    </h2>
                    <div className="space-y-1">
                        {filteredItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div className={cn(
                                        "flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 group relative mx-1",
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    )}>
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 rounded-r-full" />
                                        )}
                                        <item.icon className={cn(
                                            "mr-3 h-4 w-4 transition-colors",
                                            isActive
                                                ? "text-blue-600"
                                                : "text-slate-400 group-hover:text-slate-600"
                                        )} />
                                        <span>
                                            {item.title}
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="p-4 m-4 border-t border-slate-200">
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                    }}
                    className="flex items-center w-full rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
