"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Award, PlayCircle } from "lucide-react"

export default function StudentDashboardPage() {
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get("http://localhost:5000/api/courses/my/enrolled", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEnrolledCourses(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData()
    }, [])

    if (loading) return <div className="p-8">Loading dashboard...</div>

    const activeCourses = enrolledCourses.filter(c => c.enrollmentStatus === 'active');
    const completedCourses = enrolledCourses.filter(c => c.enrollmentStatus === 'completed');

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-slate-100 shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Courses in Progress</CardTitle>
                        <BookOpen className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeCourses.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Hours Learned</CardTitle>
                        <Clock className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">12.5</div>
                    </CardContent>
                </Card>
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Certificates Earned</CardTitle>
                        <Award className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedCourses.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Resume Learning Section */}
            {activeCourses.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight">Pick up where you left off</h2>
                        <Link href="/dashboard/student/courses" className="text-sm text-primary hover:underline">View All My Courses</Link>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {activeCourses.slice(0, 3).map((course) => (
                            <Card key={course.id} className="group overflow-hidden border-slate-200">
                                <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
                                    {/* Placeholder for thumbnail */}
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                        <PlayCircle className="h-10 w-10 opacity-50" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                                        <div className="h-full bg-primary" style={{ width: `${course.completionPercentage || 0}%` }}></div>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold mb-1 line-clamp-1">{course.title}</h3>
                                    <p className="text-xs text-slate-500 mb-3">{course.completionPercentage}% Complete</p>
                                    <Button size="sm" className="w-full">Continue Learning</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <h3 className="text-lg font-semibold">Start your learning journey</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-4">You are not enrolled in any courses yet.</p>
                    <Button asChild>
                        <Link href="/courses">Browse Courses</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
