"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Printer, Loader2, User, QrCode, ShieldCheck, Sparkles } from "lucide-react"

export default function IDCardPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token")
            if (!token) return
            try {
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

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
    )

    if (!user) return <div className="p-8 text-red-400 font-bold glass-panel border-red-500/20">Could not load profile.</div>

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto relative z-10 p-4">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">Digital Halo-ID</h1>
                    <p className="text-slate-400 text-sm font-medium">Your universal pass to the AFS Academy ecosystem</p>
                </div>
                <Button onClick={() => window.print()} variant="outline" className="gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl font-bold">
                    <Printer className="h-4 w-4" /> Print ID
                </Button>
            </div>

            {/* 3D Container Perspective */}
            <div className="perspective-1000 flex justify-center py-8">
                {/* ID Card */}
                <div id="id-card" className="w-full max-w-lg aspect-[1.586/1] rounded-3xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(79,70,229,0.3)] shadow-2xl group border border-white/10 print:shadow-none print:border print:max-w-none print:w-[3.375in] print:h-[2.125in]">

                    {/* Dynamic Holographic Background */}
                    <div className="absolute inset-0 bg-slate-900">
                        {/* Mesh Gradients */}
                        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-indigo-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

                        {/* Glass Texture */}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />

                        {/* Holographic Overlay Pattern */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s infinite linear' }} />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 h-full flex flex-col p-6 md:p-8">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-black text-white text-lg leading-none tracking-wide">AFS ACADEMY</h2>
                                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-[0.2em]">Future Protocol</span>
                                </div>
                            </div>
                            <div className="bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                <span className="text-[10px] font-black text-white uppercase tracking-wider">Verified</span>
                            </div>
                        </div>

                        {/* Main ID Body */}
                        <div className="flex-1 flex gap-6 items-center">
                            {/* Avatar Section */}
                            <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl blur-md opacity-50" />
                                <div className="relative h-32 w-32 rounded-2xl bg-slate-900 border-2 border-white/20 overflow-hidden flex items-center justify-center shadow-2xl">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="h-16 w-16 text-slate-500" />
                                    )}
                                </div>

                                {/* Rank/Level Badge (Mockup) */}
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-300 to-amber-500 text-amber-950 text-[10px] font-black px-3 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-amber-200/50">
                                    CADET LVL. 1
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="text-[9px] text-slate-400 uppercase font-black tracking-widest block mb-0.5">Identify As</label>
                                    <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">{user.name}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-y-3 gap-x-1">
                                    <div>
                                        <label className="text-[9px] text-slate-400 uppercase font-bold tracking-widest block">Cadet ID</label>
                                        <p className="font-mono text-indigo-200 text-sm font-bold tracking-wider">#{user.id?.toString().slice(0, 6).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <label className="text-[9px] text-slate-400 uppercase font-bold tracking-widest block">Cohort</label>
                                        <p className="text-white text-sm font-bold">2026-A</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[9px] text-slate-400 uppercase font-bold tracking-widest block">Access Level</label>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <ShieldCheck className="h-3 w-3 text-indigo-400" />
                                            <span className="text-xs text-white font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10 inline-block">STUDENT CLEARANCE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / QR Bar */}
                    <div className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-white/5 p-4 flex items-center justify-between">
                        <div className="text-[9px] text-slate-500 font-medium max-w-[200px] leading-relaxed">
                            Authorized for campus and digital access. Non-transferable. Property of AFS Academy.
                        </div>
                        <div className="bg-white p-1.5 rounded-lg shadow-lg">
                            <QrCode className="h-10 w-10 text-slate-900" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-slate-500 print:hidden hidden md:block">
                <p>Hover over the card to reveal security holograms.</p>
            </div>
        </div>
    )
}
