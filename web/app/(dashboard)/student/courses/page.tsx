"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, CheckCircle, Search, Filter, BookOpen, Loader2 } from "lucide-react"

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/my/enrolled`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to fetch enrolled courses", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses()
    }, [])

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    )

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            {/* Header Section with Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">My Courses</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage your learning journey and track progress</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-600 shrink-0 rounded-xl">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course, idx) => (
                    <Card key={course.id} className="group flex flex-col overflow-hidden border border-slate-200 bg-white relative hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md" style={{ animationDelay: `${idx * 100}ms` }}>

                        <div className="relative p-3">
                            <div className="aspect-video bg-slate-100 rounded-2xl relative overflow-hidden group cursor-pointer border border-slate-100">
                                {/* Placeholders or Course Image would go here */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />

                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <BookOpen className="h-12 w-12 opacity-20" />
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3 z-10">
                                    <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border shadow-sm ${course.enrollmentStatus === 'completed'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        {course.enrollmentStatus}
                                    </span>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/10 backdrop-blur-[1px]">
                                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                        <PlayCircle className="h-6 w-6 text-blue-600 ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <CardContent className="flex-1 p-6 pt-2 relative space-y-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">{course.description}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                                    <span>Progress</span>
                                    <span className="text-slate-700">{course.completionPercentage}%</span>
                                </div>
                                <Progress value={course.completionPercentage} className="h-2 bg-slate-100" indicatorClassName={course.enrollmentStatus === 'completed' ? "bg-emerald-500" : "bg-blue-600"} />
                            </div>

                            {course.enrollmentStatus === 'completed' ? (
                                <Button className="w-full gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 font-bold rounded-xl h-10 shadow-sm">
                                    <CheckCircle className="h-4 w-4" /> Completed
                                </Button>
                            ) : (
                                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl h-10 shadow-md shadow-slate-900/10">
                                    Continue Learning
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="rounded-[2rem] p-16 text-center animate-slide-up bg-white border border-slate-200 shadow-sm">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-6 ring-4 ring-slate-50">
                        <BookOpen className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
                    <p className="text-slate-500 mb-8 font-medium">Explore our catalog to find your next mission.</p>
                    <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 px-8 h-11">
                        <Link href="/courses">Explore Courses</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
