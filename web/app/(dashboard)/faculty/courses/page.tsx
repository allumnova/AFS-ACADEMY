"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit, Users } from "lucide-react"

export default function FacultyCoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await axios.get("http://localhost:5000/api/courses/my/created", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setCourses(res.data)
            } catch (error) {
                console.error("Failed to fetch my courses", error)
            } finally {
                setLoading(false)
            }
        }
        fetchMyCourses()
    }, [])

    if (loading) return <div className="p-8">Loading your courses...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
                <Button asChild>
                    <Link href="/admin/courses/new"> {/* Faculty uses same create form for now */}
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Course
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <Card key={course.id} className="group overflow-hidden border-slate-200 hover:shadow-lg transition-shadow">
                        <CardHeader className="p-0">
                            {course.thumbnail ? (
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={`http://localhost:5000${course.thumbnail}`}
                                        alt={course.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ) : (
                                <div className="bg-slate-100 aspect-video flex items-center justify-center text-slate-400">
                                    <span className="text-sm font-semibold">No Thumbnail</span>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
                                <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600 font-medium">
                                    {course.category}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">{course.description}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" /> 0 Students
                                </span>
                                <span className="font-medium text-slate-900">${course.price}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="p-6 pt-0 flex justify-between gap-4">
                            <Button variant="outline" size="sm" className="w-full" asChild>
                                <Link href={`/admin/courses/${course.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">No courses yet</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">You haven't created any courses yet. Start sharing your knowledge today!</p>
                    <Button asChild>
                        <Link href="/admin/courses/new">Create Your First Course</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
