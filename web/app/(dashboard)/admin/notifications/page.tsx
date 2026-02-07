"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Users, User, Layout, Megaphone, Loader2, CheckCircle2 } from "lucide-react"

export default function AdminNotificationsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [batches, setBatches] = useState<any[]>([])
    const [courses, setCourses] = useState<any[]>([])

    const [targetType, setTargetType] = useState("all")
    const [targetId, setTargetId] = useState("")
    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [type, setType] = useState("info")

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            try {
                const [studRes, batchRes, courseRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/students`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/batches`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`, { headers: { Authorization: `Bearer ${token}` } })
                ])
                setStudents(studRes.data)
                setBatches(batchRes.data)
                setCourses(courseRes.data)
            } catch (error) {
                console.error("Failed to fetch notification targets", error)
            } finally {
                setFetching(false)
            }
        }
        fetchData()
    }, [])

    const handleSend = async () => {
        if (!title || !message) {
            alert("Please fill in title and message")
            return
        }
        if (targetType !== "all" && !targetId) {
            alert("Please select a target")
            return
        }

        setLoading(true)
        const token = localStorage.getItem("token")
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/send`, {
                targetType,
                targetId,
                title,
                message,
                type
            }, { headers: { Authorization: `Bearer ${token}` } })

            alert("Notification broadcasted successfully!")
            setTitle("")
            setMessage("")
            setTargetId("")
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to send notification")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Communication Hub</h1>
                <p className="text-slate-500">Send targeted announcements and alerts across the platform.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-2 border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Send className="h-5 w-5 text-blue-600" />
                            Compose Announcement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Target Type</label>
                                <Select value={targetType} onValueChange={(val) => { setTargetType(val); setTargetId("") }}>
                                    <SelectTrigger className="rounded-xl border-slate-200 h-11">
                                        <SelectValue placeholder="Select target" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Broadcast to All Students</SelectItem>
                                        <SelectItem value="batch">Specific Batch</SelectItem>
                                        <SelectItem value="course">Entire Course</SelectItem>
                                        <SelectItem value="individual">Individual Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {targetType !== "all" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Target Selection</label>
                                    <Select value={targetId} onValueChange={setTargetId}>
                                        <SelectTrigger className="rounded-xl border-slate-200 h-11">
                                            <SelectValue placeholder={`Select ${targetType}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {targetType === "batch" && batches.map(b => (
                                                <SelectItem key={b.id} value={b.id}>{b.name} ({b.course?.title})</SelectItem>
                                            ))}
                                            {targetType === "course" && courses.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                                            ))}
                                            {targetType === "individual" && students.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.name} ({s.email})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Announcement Title</label>
                            <Input
                                placeholder="e.g. Schedule Update for React Batch"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="rounded-xl border-slate-200 h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Message Content</label>
                            <Textarea
                                placeholder="Write your announcement here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="rounded-2xl border-slate-200 min-h-[150px] resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex gap-4">
                                {["info", "success", "warning", "error"].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${type === t ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-40 hover:opacity-100'
                                            } ${t === 'info' ? 'bg-blue-500' :
                                                t === 'success' ? 'bg-emerald-500' :
                                                    t === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}
                                    />
                                ))}
                            </div>
                            <Button
                                onClick={handleSend}
                                disabled={loading}
                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-12 shadow-lg shadow-slate-200"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                                Broadcast Now
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-slate-100 bg-blue-50/50 rounded-3xl overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2">
                                <Megaphone className="h-4 w-4" />
                                Pro Tip
                            </h3>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Use <strong>Broadcast</strong> for platform-wide updates, and <strong>Batch</strong> targeting for specific class reminders.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-100 bg-emerald-50/50 rounded-3xl overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Best Practices
                            </h3>
                            <ul className="text-xs text-emerald-700 space-y-2 list-disc list-inside">
                                <li>Keep titles short and urgent</li>
                                <li>Specify if immediate action is needed</li>
                                <li>Use 'Warning' for deadline alerts</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
