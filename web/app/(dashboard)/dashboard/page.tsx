"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StudentDashboardPage() {
    const router = useRouter()

    useEffect(() => {
        const userStr = localStorage.getItem("user")
        if (userStr) {
            try {
                const user = JSON.parse(userStr)
                if (user.role === 'admin') {
                    router.push("/admin")
                } else if (user.role === 'faculty') {
                    router.push("/faculty")
                } else if (user.role === 'student') {
                    router.push("/student")
                }
            } catch (e) {
                console.error("Error parsing user", e)
            }
        }
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground animate-pulse">Redirecting to your dashboard...</p>
            </div>
        </div>
    )
}
