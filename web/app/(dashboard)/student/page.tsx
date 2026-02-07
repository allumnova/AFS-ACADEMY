"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Award, PlayCircle, Loader2, ArrowRight, Zap, CreditCard } from "lucide-react"

interface EnrolledCourse {
    id: string
    title: string
    enrollmentStatus: 'active' | 'completed' | 'dropped'
    completionPercentage: number
}

interface User {
    name: string
    email: string
}

export default function StudentDashboardPage() {
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
    const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const [stats, setStats] = useState({
        pendingPayments: 0,
        attendancePercentage: "0.0",
        activeEnrollments: 0,
        totalSessions: 0,
        presentCount: 0
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (e) {
                    console.error("Failed to parse user data", e);
                }
            }

            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const [enrolledRes, upcomingRes, statsRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/my/enrolled`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lectures/upcoming`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/stats`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setEnrolledCourses(enrolledRes.data);
                setUpcomingSessions(upcomingRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData()
    }, [])

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
    )

    const activeCourses = enrolledCourses.filter(c => c.enrollmentStatus === 'active');
    const completedCourses = enrolledCourses.filter(c => c.enrollmentStatus === 'completed');

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 animate-fade-in relative z-10">
            {/* Hero Welcome */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
                        Welcome back, {user?.name?.split(' ')[0] || 'Cadet'}! 👋
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl">
                        You're making great progress. You have <span className="text-blue-600 font-semibold">{activeCourses.length} active courses</span> to continue today.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 shadow-lg shadow-slate-200" size="lg">
                            Go to Classroom
                        </Button>
                        <Button variant="outline" className="rounded-full px-6 border-slate-200 text-slate-600 hover:bg-slate-50">
                            View Schedule
                        </Button>
                    </div>
                </div>
            </div>

            {/* Pending Payment Alert */}
            {stats.pendingPayments > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-black text-amber-900 uppercase text-[10px] tracking-widest">Action Required</p>
                            <h4 className="text-amber-800 font-bold">You have {stats.pendingPayments} pending payment(s)</h4>
                        </div>
                    </div>
                    <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 rounded-xl" asChild>
                        <Link href="/payments">Resolve Now</Link>
                    </Button>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-blue-100 transition-colors group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">In Progress</span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">{activeCourses.length}</span>
                        <p className="text-xs text-slate-400 mt-1">Active enrollments</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-emerald-100 transition-colors group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <Award className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Completed</span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">{completedCourses.length}</span>
                        <p className="text-xs text-slate-400 mt-1">Certificates earned</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-purple-100 transition-colors group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <Clock className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Attendance</span>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">{stats.attendancePercentage}%</span>
                        <p className="text-xs text-slate-400 mt-1">{stats.presentCount} of {stats.totalSessions} sessions</p>
                    </div>
                </div>
            </div>

            {/* Current Courses */}
            <div className="space-y-12">
                {/* Upcoming Sessions Widget */}
                {upcomingSessions.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Upcoming Live Sessions</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingSessions.map((session) => (
                                <Card key={session.id} className="border-blue-100 bg-blue-50/30 shadow-sm hover:shadow-md transition-all overflow-hidden relative group rounded-2xl">
                                    <div className="absolute top-0 right-0 p-3">
                                        <div className="flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </div>
                                    </div>
                                    <CardContent className="p-5 flex gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white border border-blue-100 flex flex-col items-center justify-center text-blue-600 shrink-0 shadow-sm">
                                            <span className="text-[10px] font-black uppercase leading-none opacity-60">{new Date(session.startTime).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg font-black leading-none">{new Date(session.startTime).getDate()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate mb-0.5">{session.course?.title}</p>
                                            <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-700 transition-colors">{session.title}</h3>
                                            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                                                <Clock className="h-3 w-3" />
                                                {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.durationMinutes}m
                                            </p>
                                        </div>
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/10 self-center" asChild>
                                            <Link href={`/student/courses/${session.courseId}`}>Join</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Your Courses</h2>
                        <Link href="/courses" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline underline-offset-4">
                            Browse Catalog <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {activeCourses.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {activeCourses.map((course) => (
                                <Card key={course.id} className="group border-slate-200 hover:border-blue-200 transition-all hover:shadow-md overflow-hidden rounded-2xl">
                                    <div className="aspect-[16/9] relative bg-slate-100 overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-slate-900 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                <PlayCircle className="h-6 w-6 ml-0.5" />
                                            </div>
                                        </div>
                                        {/* Placeholder for Course Image if available */}
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                            Module 2
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                            {course.title}
                                        </h3>

                                        <div className="space-y-3 mt-4">
                                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                                <span>Progress</span>
                                                <span className="text-slate-900">{course.completionPercentage || 0}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${course.completionPercentage || 0}%` }}
                                                />
                                            </div>
                                        </div>

                                        <Button className="w-full mt-6 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 font-medium rounded-xl h-10 shadow-sm transition-all group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100">
                                            Continue Learning
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm mb-4 text-slate-400">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 mb-1">No active courses</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">You haven't enrolled in any courses yet. Browse our catalog to get started.</p>
                            <Button asChild className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium shadow-lg shadow-slate-200">
                                <Link href="/courses">Explore Courses</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
