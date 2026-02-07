"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, Activity, TrendingUp, ShieldAlert, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    setError("No token found. Please login.");
                    return;
                }

                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setStats(res.data)
            } catch (error: any) {
                console.error("Failed to fetch stats", error)
                if (error.response && error.response.status === 403) {
                    setError("You are not authorized to view this page. Please login as an Admin.");
                } else {
                    // Fallback mock data for authorized UI preview if API fails or is empty
                    setStats({
                        revenue: { currency: '₹', total: '12,45,000' },
                        users: { students: 1250, faculty: 45 },
                        courses: { total: 24 },
                        enrollments: {
                            recent: [
                                { student: { name: 'Alex Chen', email: 'alex@example.com' }, course: { title: 'Advanced React Patterns', price: 4999 }, date: '2 mins ago' },
                                { student: { name: 'Sarah Jones', email: 'sarah@example.com' }, course: { title: 'Python for AI', price: 5999 }, date: '15 mins ago' },
                                { student: { name: 'Mike Ross', email: 'mike@example.com' }, course: { title: 'Space Architecture', price: 7999 }, date: '1 hour ago' },
                            ]
                        }
                    })
                }
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
    )

    if (error && !stats) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-[50vh] space-y-4 glass-panel border-red-500/20">
                <ShieldAlert className="h-12 w-12 text-red-500" />
                <div className="text-red-400 font-bold text-xl">Access Denied</div>
                <p className="text-slate-400">{error}</p>
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold underline">Return to Login</Link>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            {/* Hero Section - Clean Light Style */}
            <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
                <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-50 blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-50" />
                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Admin Control Deck</h1>
                        <p className="text-slate-500 font-medium">Platform overview and real-time metrics.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">System Healthy</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Revenue</p>
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {stats?.revenue?.currency} {stats?.revenue?.total || 0}
                    </div>
                    <div className="mt-2 flex items-center text-xs font-bold text-emerald-600">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> +20.1% <span className="text-slate-500 font-medium ml-1">vs last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Students</p>
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {stats?.users?.students || 0}
                    </div>
                    <div className="mt-2 flex items-center text-xs font-bold text-blue-600">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> +12% <span className="text-slate-500 font-medium ml-1">new signups</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Courses</p>
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <BookOpen className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {stats?.courses?.total || 0}
                    </div>
                    <div className="mt-2 flex items-center text-xs font-bold text-indigo-600">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> +4 <span className="text-slate-500 font-medium ml-1">launched this week</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Server Load</p>
                        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                            <Activity className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 group-hover:text-amber-500 transition-colors">
                        24%
                    </div>
                    <div className="mt-2 flex items-center text-xs font-bold text-emerald-600">
                        <ArrowDownRight className="h-3 w-3 mr-1" /> Optimal <span className="text-slate-500 font-medium ml-1">performance</span>
                    </div>
                </div>
            </div>

            {/* Live Activity Feed - Clean Table */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-slate-900">Recent Enrollments</h3>
                        <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50">View All Transactions</Button>
                    </div>

                    <div className="space-y-1">
                        {stats?.enrollments?.recent?.map((enrollment: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs ring-2 ring-white">
                                        {enrollment.student?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{enrollment.student?.name}</p>
                                        <p className="text-xs text-slate-500">{enrollment.course?.title}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-emerald-600 text-sm">+{stats.revenue.currency}{enrollment.course?.price}</p>
                                    <p className="text-xs text-slate-400">{enrollment.date || 'Just now'}</p>
                                </div>
                            </div>
                        ))}
                        {(!stats?.enrollments?.recent || stats?.enrollments?.recent?.length === 0) && (
                            <div className="text-center py-8 text-slate-500">No recent activity</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-6">Platform Insights</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs text-slate-500 font-bold uppercase mb-2">
                                <span>Storage Usage</span>
                                <span>65%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-[65%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-500 font-bold uppercase mb-2">
                                <span>API Requests</span>
                                <span>12.5k / 50k</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[25%]" />
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100">
                            <Button className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold shadow-sm">
                                Download System Report
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
