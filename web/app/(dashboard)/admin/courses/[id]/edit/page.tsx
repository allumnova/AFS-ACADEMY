"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Unwrap params using React.use for Next.js 15+ compatibility
    const { id } = use(params)

    const [thumbnail, setThumbnail] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Development",
        level: "Beginner",
    })

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`)
                const course = res.data
                setFormData({
                    title: course.title,
                    description: course.description,
                    price: course.price,
                    category: course.category,
                    level: course.level || "Beginner",
                })
            } catch (err) {
                console.error("Failed to fetch course", err)
                setError("Failed to load course details")
            } finally {
                setLoading(false)
            }
        }
        fetchCourse()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("Not authenticated")

            const data = new FormData()
            data.append("title", formData.title)
            data.append("description", formData.description)
            data.append("price", formData.price)
            data.append("category", formData.category)
            data.append("level", formData.level)
            if (thumbnail) {
                data.append("thumbnail", thumbnail)
            }

            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            router.push("/admin/courses")
            router.refresh()
        } catch (err: any) {
            console.error("Failed to update course", err)
            setError(err.response?.data?.message || err.message || "Something went wrong")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8">Loading course details...</div>

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/courses">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                    <CardDescription>Update information for this course.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="title">Course Title</Label>
                            <Input id="title" placeholder="e.g. Advanced React Patterns" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Course overview..." value={formData.description} onChange={handleChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input id="price" type="number" min="0" step="1" placeholder="999" value={formData.price} onChange={handleChange} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="Development">Development</option>
                                    <option value="Design">Design</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="level">Level</Label>
                            <select
                                id="level"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.level}
                                onChange={handleChange}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="thumbnail">Course Thumbnail</Label>
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setThumbnail(e.target.files[0])
                                    }
                                }}
                            />
                            <p className="text-xs text-muted-foreground">Upload a new image to replace the current thumbnail.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/admin/courses">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
