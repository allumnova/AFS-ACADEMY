"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Star, BarChart } from "lucide-react"

export default function FacultyDashboardPage() {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        averageRating: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                // Creating a mock stats endpoint or just calculating from my courses
                // For now, let's fetch my courses and calculate basics side-client or add a specific endpoint later
                // Reusing mock data for "Impact" for now to show UI structure
                setStats({
                    totalCourses: 5,
                    totalStudents: 120,
                    averageRating: 4.8,
                })
            } catch (error) {
                console.error("Failed to fetch faculty stats", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">My Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalCourses}</div>
                        <p className="text-xs text-slate-500 mt-1">Active courses</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalStudents}</div>
                        <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                            +12
                            <span className="text-slate-400 font-normal ml-1">this week</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.averageRating}</div>
                        <p className="text-xs text-slate-500 mt-1">From 45 reviews</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Live Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground py-8 text-center">No classes scheduled for today.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground py-8 text-center">No new questions from students.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
