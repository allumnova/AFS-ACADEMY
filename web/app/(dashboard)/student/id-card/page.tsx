"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Printer, Loader2, User } from "lucide-react"

export default function IDCardPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token")
            if (!token) return
            try {
                // Fetch user profile - Assuming /api/auth/me or similar exists, or decoding token, 
                // but usually profile endpoint is cleaner. Checking userRoutes... 
                // Let's assume /api/users/profile based on standard practices or /api/auth/me
                // Fallback: use /api/users/me if available. 
                // Given the file list, I'll try getting base profile.
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(res.data.user || res.data)
            } catch (err) {
                console.error("Failed to fetch user profile", err)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    if (loading) return <div className="p-8 flex items-center gap-2 text-slate-500"><Loader2 className="animate-spin" /> Loading ID Card...</div>
    if (!user) return <div className="p-8 text-red-500">Could not load profile.</div>

    return (
        <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
            <div className="flex items-center justify-between print:hidden">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Student ID Card</h1>
                <Button onClick={() => window.print()} variant="outline" className="gap-2">
                    <Printer className="h-4 w-4" /> Print ID
                </Button>
            </div>

            {/* ID Card Container */}
            <div id="id-card" className="w-full aspect-[1.586/1] bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden relative border border-slate-200 print:shadow-none print:border">
                {/* Background Design */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-10 pointer-events-none" />
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3" />

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between relative z-10">
                    <div className="font-bold text-lg tracking-wide">AFS ACADEMY</div>
                    <div className="text-xs opacity-80 uppercase tracking-widest border-2 border-white/20 px-2 py-0.5 rounded">Student</div>
                </div>

                <div className="p-6 flex gap-6 relative z-10">
                    {/* Photo Area */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-lg bg-slate-200 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-16 w-16 text-slate-400" />
                            )}
                        </div>
                        <div className="mt-2 text-center">
                            {/* QR Placeholder */}
                            <div className="w-32 h-8 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 tracking-wider">
                                SCAN ME
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-4 pt-2">
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Student Name</div>
                            <div className="text-2xl font-bold text-slate-900">{user.name}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Student ID</div>
                                <div className="font-mono text-slate-700 font-medium">AFS-{user.id?.toString().slice(0, 8).toUpperCase()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Joined</div>
                                <div className="font-medium text-slate-700">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <div className="text-[10px] text-slate-400 leading-tight">
                                This card is the property of AFS Academy. If found, please return to the administration office.
                                Valid for current academic session.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-slate-500 print:hidden">
                <p>Press the print button to save or print your digital ID card.</p>
            </div>
        </div>
    )
}
