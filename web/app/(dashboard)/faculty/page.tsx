"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Star, BarChart, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

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
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Dashboard</h1>
                    <p className="text-slate-500">Manage your courses and track student progress.</p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2 shadow-sm">
                        Create New Course
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">My Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalCourses}</div>
                        <p className="text-xs text-slate-500 mt-1">Active courses</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalStudents}</div>
                        <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
                            +12
                            <span className="text-slate-400 font-normal ml-1">this week</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{stats.averageRating}</div>
                        <p className="text-xs text-slate-500 mt-1">From 45 reviews</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-200 shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold text-slate-900">Student Feedback</CardTitle>
                        <MessageSquare className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                <Star className="h-5 w-5 text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-900">No approved reviews yet</p>
                            <p className="text-xs text-slate-500 mt-1">Student feedback will appear here once moderated.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold text-slate-900">Syllabus Suggestion</CardTitle>
                        <Send className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-500">Suggest changes to your assigned courses directly to the Admin.</p>
                        <textarea
                            placeholder="Describe your proposed changes..."
                            className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <Button className="w-full bg-slate-900 text-white rounded-xl">
                            Send Proposal
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
