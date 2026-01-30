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
import {
    ArrowLeft,
    Plus,
    Video,
    Trash2,
    Clock,
    MonitorPlay,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react"

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()

    const [course, setCourse] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [lectureLoading, setLectureLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showAddLecture, setShowAddLecture] = useState(false)

    const [lectureForm, setLectureForm] = useState({
        title: "",
        description: "",
        durationMinutes: "60",
        isLive: false
    })

    useEffect(() => {
        fetchCourse()
    }, [id])

    const fetchCourse = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`http://localhost:5000/api/courses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCourse(res.data)
        } catch (err) {
            console.error("Failed to fetch course", err)
            setError("Failed to load course details")
        } finally {
            setLoading(false)
        }
    }

    const handleAddLecture = async (e: React.FormEvent) => {
        e.preventDefault()
        setLectureLoading(true)
        try {
            const token = localStorage.getItem("token")
            await axios.post(`http://localhost:5000/api/lectures`, {
                ...lectureForm,
                courseId: id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setShowAddLecture(false)
            setLectureForm({ title: "", description: "", durationMinutes: "60", isLive: false })
            fetchCourse()
        } catch (err) {
            console.error("Failed to add lecture", err)
            alert("Failed to add lecture")
        } finally {
            setLectureLoading(false)
        }
    }

    const handleDeleteLecture = async (lectureId: string) => {
        if (!confirm("Are you sure you want to delete this lecture?")) return

        try {
            const token = localStorage.getItem("token")
            await axios.delete(`http://localhost:5000/api/lectures/${lectureId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchCourse()
        } catch (err) {
            console.error("Failed to delete lecture", err)
            alert("Failed to delete lecture")
        }
    }

    const handleGenerateCode = async (lectureId: string) => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post(`http://localhost:5000/api/lectures/${lectureId}/attendance-code`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchCourse()
            alert(`Attendance code generated: ${res.data.code}`)
        } catch (err) {
            console.error("Failed to generate code", err)
            alert("Failed to generate attendance code")
        }
    }

    if (loading) return <div className="flex h-[400px] items-center justify-center"><Loader2 className="animate-spin" /></div>
    if (error) return <div className="p-8 text-red-500">{error}</div>

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/courses">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                    <p className="text-muted-foreground">Manage details and curriculum for this course.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    {/* Curriculum Section */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Curriculum</h2>
                        <Button onClick={() => setShowAddLecture(!showAddLecture)} variant={showAddLecture ? "outline" : "default"}>
                            {showAddLecture ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Add Lecture</>}
                        </Button>
                    </div>

                    {showAddLecture && (
                        <Card className="border-primary/20 bg-primary/5 animate-in slide-in-from-top-4 duration-300">
                            <CardHeader>
                                <CardTitle className="text-lg text-primary">New Lecture</CardTitle>
                                <CardDescription>Add a new session to the course curriculum.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleAddLecture}>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Lecture Title</Label>
                                        <Input
                                            id="title"
                                            value={lectureForm.title}
                                            onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                                            placeholder="e.g. Setting up the Project"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={lectureForm.description}
                                            onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                                            placeholder="What will be covered in this session?"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="duration">Duration (Minutes)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                value={lectureForm.durationMinutes}
                                                onChange={(e) => setLectureForm({ ...lectureForm, durationMinutes: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2 pt-8">
                                            <input
                                                type="checkbox"
                                                id="isLive"
                                                checked={lectureForm.isLive}
                                                onChange={(e) => setLectureForm({ ...lectureForm, isLive: e.target.checked })}
                                                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor="isLive">Live Session</Label>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={lectureLoading} className="w-full">
                                        {lectureLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Lecture
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    )}

                    <div className="space-y-4">
                        {course.lectures && course.lectures.length > 0 ? (
                            course.lectures.map((lecture: any, index: number) => (
                                <Card key={lecture.id} className="group hover:border-primary/50 transition-colors shadow-sm">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                {lecture.isLive ? <MonitorPlay className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 line-clamp-1">{index + 1}. {lecture.title}</h4>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {lecture.durationMinutes} mins</span>
                                                    {lecture.isLive && <span className="text-orange-600 font-semibold">• Live Session</span>}
                                                    {lecture.attendanceCode && <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Code: {lecture.attendanceCode}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleGenerateCode(lecture.id)}
                                                className="text-xs h-8"
                                            >
                                                {lecture.attendanceCode ? "Regenerate QR" : "Generate QR"}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                                onClick={() => handleDeleteLecture(lecture.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="rounded-xl border-2 border-dashed p-12 text-center">
                                <Video className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900">No lectures yet</h3>
                                <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start building your course curriculum by adding your first lecture or live session.</p>
                                <Button onClick={() => setShowAddLecture(true)} variant="outline">
                                    Add Your First Lecture
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Category</span>
                                <span className="font-semibold">{course.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Level</span>
                                <span className="font-semibold">{course.level}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Price</span>
                                <span className="font-semibold text-primary">₹{course.price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status</span>
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold uppercase">Active</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/admin/courses/${id}/edit`}>Edit Details</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="bg-slate-950 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{course.lectures?.length || 0}</div>
                                    <div className="text-xs text-slate-400">Total Lectures</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
