"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PlayCircle, CheckCircle } from "lucide-react"

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await axios.get("http://localhost:5000/api/courses/my/enrolled", {
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

    if (loading) return <div className="p-8">Loading courses...</div>

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <Card key={course.id} className="flex flex-col overflow-hidden border-slate-200 hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative group cursor-pointer">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                                <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                            </div>
                        </div>
                        <CardContent className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${course.enrollmentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {course.enrollmentStatus}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2">{course.description}</p>

                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Progress</span>
                                    <span>{course.completionPercentage}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${course.completionPercentage}%` }} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            {course.enrollmentStatus === 'completed' ? (
                                <Button variant="outline" className="w-full gap-2 text-green-600 border-green-200 hover:bg-green-50">
                                    <CheckCircle className="h-4 w-4" /> Completed
                                </Button>
                            ) : (
                                <Button className="w-full">Continue Learning</Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="text-center py-20">
                    <h3 className="text-lg font-semibold">No courses found</h3>
                    <p className="text-muted-foreground mb-6">Explore our catalog to find your next skill.</p>
                    <Button asChild>
                        <Link href="/courses">Explore Courses</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
