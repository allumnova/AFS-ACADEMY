"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, Activity } from "lucide-react"
import axios from "axios"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real app, attach token from context/localStorage
                const token = localStorage.getItem('token')
                if (!token) {
                    setError("No token found. Please login.");
                    return;
                }

                const res = await axios.get("http://localhost:5000/api/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setStats(res.data)
            } catch (error: any) {
                console.error("Failed to fetch stats", error)
                if (error.response && error.response.status === 403) {
                    setError("You are not authorized to view this page. Please login as an Admin.");
                } else {
                    setError("Failed to load dashboard data.");
                }
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>
    }

    if (error) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-[50vh] space-y-4">
                <div className="text-red-500 font-bold text-xl">Access Denied</div>
                <p className="text-muted-foreground">{error}</p>
                <a href="/login" className="text-primary hover:underline">Return to Login</a>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {stats?.revenue?.currency} {stats?.revenue?.total || 0}
                        </div>
                        <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                            +20.1%
                            <span className="text-slate-400 font-normal ml-1">from last month</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Students</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats?.users?.students || 0}</div>
                        <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                            +180
                            <span className="text-slate-400 font-normal ml-1">new students</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats?.courses?.total || 0}</div>
                        <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                            +4
                            <span className="text-slate-400 font-normal ml-1">new courses</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Live Sessions</CardTitle>
                        <Activity className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">12</div>
                        <p className="text-xs text-slate-500 mt-1">Scheduled for this week</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Charts could go here */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats?.enrollments?.recent?.length > 0 ? (
                            <div className="space-y-4">
                                {stats.enrollments.recent.map((enrollment: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-sm">{enrollment.student?.name}</p>
                                            <p className="text-xs text-muted-foreground">{enrollment.student?.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-sm">{enrollment.course?.title}</p>
                                            <p className="text-xs text-green-600">Paid INR {enrollment.course?.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent enrollments to show.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
