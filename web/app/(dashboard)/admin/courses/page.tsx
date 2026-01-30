"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PlusCircle, Edit, Trash, MonitorPlay } from "lucide-react"

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Public endpoint is fine for reading, but restricted actions will need token
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`)
                setCourses(res.data)
            } catch (error) {
                console.error("Failed to fetch courses", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [])

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You need to be logged in to delete courses.");
                return;
            }

            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Remove from state
            setCourses(courses.filter(course => course.id !== id));
        } catch (error: any) {
            console.error("Failed to delete course", error);
            alert(error.response?.data?.message || "Failed to delete course");
        }
    }

    if (loading) return <div className="p-8">Loading courses...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Courses Management</h1>
                <Button asChild>
                    <Link href="/admin/courses/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Course
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <Card key={course.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span className="text-lg line-clamp-1">{course.title}</span>
                                <span className="text-xs bg-muted px-2 py-1 rounded-full font-normal">
                                    ${course.price}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {course.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                                <span className="font-semibold">Instructor:</span> {course.instructor?.name || course.instructorId || 'Unknown'}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="secondary" size="sm" asChild>
                                <Link href={`/admin/courses/${course.id}`}>
                                    <MonitorPlay className="h-4 w-4 mr-2" />
                                    Manage
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/courses/${course.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(course.id)}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {courses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No courses found. Create your first course!
                </div>
            )}
        </div>
    )
}
