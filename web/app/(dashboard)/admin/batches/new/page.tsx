"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronLeft, Save, Loader2 } from "lucide-react"

export default function NewBatchPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState<any[]>([])
    const [instructors, setInstructors] = useState<any[]>([])

    const [formData, setFormData] = useState({
        name: "",
        courseId: "",
        instructorId: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        maxCapacity: 30,
        days: [] as string[]
    })

    const availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, usersRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`) // Need to filter for faculty later
                ])
                setCourses(coursesRes.data)
                // Filter for faculty role
                setInstructors(usersRes.data.filter((u: any) => u.role === 'faculty' || u.role === 'admin'))
            } catch (error) {
                console.error("Failed to fetch dependencies", error)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/batches`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            router.push("/admin/batches")
        } catch (error: any) {
            console.error("Failed to create batch", error)
            alert(error.response?.data?.message || "Failed to create batch")
        } finally {
            setLoading(false)
        }
    }

    const toggleDay = (day: string) => {
        setFormData(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day]
        }))
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/admin/batches">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Batch</h1>
                    <p className="text-slate-500">Define the schedule and assignment for a new class.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle>Batch Details</CardTitle>
                        <CardDescription>Fill in the basic information about the batch.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {/* Basic Section */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Batch Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Flutter Advanced - Jan 2024"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="course">Select Course</Label>
                                <select
                                    id="course"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                >
                                    <option value="">Choose a course...</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instructor">Assign Instructor</Label>
                                <select
                                    id="instructor"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.instructorId}
                                    onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                                >
                                    <option value="">Optionally assign faculty...</option>
                                    {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxCapacity">Max Capacity</Label>
                                <Input
                                    id="maxCapacity"
                                    type="number"
                                    value={formData.maxCapacity}
                                    onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Scheduling Section */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Schedule & Timing</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date (Optional)</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">Start Time</Label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        required
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endTime">End Time</Label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        required
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Recurring Days</Label>
                                <div className="flex flex-wrap gap-2">
                                    {availableDays.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${formData.days.includes(day)
                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                            <Button variant="outline" asChild disabled={loading}>
                                <Link href="/admin/batches">Cancel</Link>
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[120px]" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Batch
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
