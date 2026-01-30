"use client"

import { useEffect, useState, use } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle, CheckCircle, Lock, Menu, MonitorPlay } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CoursePlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const [course, setCourse] = useState<any>(null)
    const [activeLesson, setActiveLesson] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [attendanceCode, setAttendanceCode] = useState("")
    const [markingAttendance, setMarkingAttendance] = useState(false)
    const [reviews, setReviews] = useState<any[]>([])
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")

    useEffect(() => {
        const fetchCourse = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourse(res.data);
                if (res.data.lectures && res.data.lectures.length > 0) {
                    setActiveLesson(res.data.lectures[0]);
                }

                // Fetch reviews
                const reviewRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/course/${id}`);
                setReviews(reviewRes.data);
            } catch (err) {
                console.error("Failed to fetch player data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCourse()
    }, [id])

    const handleMarkAttendance = async () => {
        if (!attendanceCode) return alert("Please enter the attendance code");
        setMarkingAttendance(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lectures/${activeLesson.id}/verify-attendance`, {
                code: attendanceCode
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Attendance marked successfully!");
            setAttendanceCode("");
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to mark attendance");
        } finally {
            setMarkingAttendance(false);
        }
    }

    const handleSubmitReview = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
                courseId: id,
                rating,
                comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Review submitted!");
            setComment("");
            // Refresh reviews
            const reviewRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/course/${id}`);
            setReviews(reviewRes.data);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to submit review");
        }
    }

    if (loading) return <div className="p-8">Loading player...</div>
    if (!course) return <div className="p-8">Course not found</div>

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-4">
            <div className="flex-1 flex flex-col gap-4">
                <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                        <div className="text-center text-white/80 group-hover:text-white transition-colors">
                            <PlayCircle className="h-20 w-20 mx-auto mb-4 opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer" />
                            <p className="font-semibold text-lg tracking-wide">Start {activeLesson?.isLive ? 'Live Session' : 'Lesson'}</p>
                        </div>
                    </div>
                </div>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">{activeLesson?.title}</h1>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                    {activeLesson?.isLive && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold animate-pulse">LIVE</span>}
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600">{activeLesson?.durationMinutes} mins</span>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                {activeLesson?.isLive && (
                                    <div className="flex gap-2 mr-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                        <input
                                            type="text"
                                            placeholder="Code"
                                            className="w-20 px-2 py-1 text-sm border rounded"
                                            value={attendanceCode}
                                            onChange={(e) => setAttendanceCode(e.target.value.toUpperCase())}
                                        />
                                        <Button
                                            size="sm"
                                            onClick={handleMarkAttendance}
                                            disabled={markingAttendance}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            {markingAttendance ? "..." : "Mark Presence"}
                                        </Button>
                                    </div>
                                )}
                                <Button variant="outline">Schedule</Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-700">Resources</Button>
                            </div>
                        </div>
                        <div className="mt-8 border-t pt-8">
                            <div className="flex gap-8 mb-8">
                                <button className="text-primary font-bold border-b-2 border-primary pb-2 uppercase text-xs tracking-wider">About</button>
                                <button className="text-slate-400 font-bold hover:text-slate-600 pb-2 uppercase text-xs tracking-wider">Resources</button>
                                <button className="text-slate-400 font-bold hover:text-slate-600 pb-2 uppercase text-xs tracking-wider">Reviews ({reviews.length})</button>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600">{activeLesson?.description || course.description}</p>
                            </div>

                            {/* Reviews Section */}
                            <div className="mt-12">
                                <h3 className="text-xl font-bold mb-6">Student Feedback</h3>
                                <div className="grid gap-6">
                                    <Card className="bg-slate-50/50 border-dashed">
                                        <CardContent className="p-4 space-y-4">
                                            <p className="text-sm font-semibold">Write a review</p>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${rating >= star ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                className="w-full p-3 text-sm border rounded-lg bg-white"
                                                placeholder="Share your experience with this course..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                rows={3}
                                            />
                                            <Button size="sm" onClick={handleSubmitReview}>Post Review</Button>
                                        </CardContent>
                                    </Card>

                                    {reviews.map((review) => (
                                        <div key={review.id} className="flex gap-4 p-4 rounded-xl border border-slate-100">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                                {review.student?.name?.[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-sm">{review.student?.name}</span>
                                                    <span className="text-amber-500 font-bold text-xs">{'★'.repeat(review.rating)}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{review.comment}</p>
                                                <p className="text-[10px] text-slate-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="w-full lg:w-80 border-slate-200">
                <CardHeader className="border-b bg-slate-50/50 p-4">
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                        <span>Curriculum</span>
                        <span className="text-xs font-normal text-muted-foreground">{course.lectures?.length || 0} Sessions</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-full max-h-[500px]">
                        <div className="flex flex-col">
                            {course.lectures?.map((lecture: any, idx: number) => (
                                <button
                                    key={lecture.id}
                                    onClick={() => setActiveLesson(lecture)}
                                    className={`flex items-start gap-3 p-4 text-left border-b hover:bg-slate-50 transition-colors ${activeLesson?.id === lecture.id ? 'bg-indigo-50' : 'bg-white'}`}
                                >
                                    <div className="mt-0.5">
                                        {lecture.isLive ? (
                                            <MonitorPlay className={`h-4 w-4 ${activeLesson?.id === lecture.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        ) : (
                                            <PlayCircle className={`h-4 w-4 ${activeLesson?.id === lecture.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${activeLesson?.id === lecture.id ? 'text-indigo-600' : 'text-slate-700'}`}>
                                            {idx + 1}. {lecture.title}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">{lecture.durationMinutes} mins {lecture.isLive ? '• Live' : '• Recorded'}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
