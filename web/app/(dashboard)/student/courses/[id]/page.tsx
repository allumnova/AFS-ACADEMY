"use client"

// ... imports
import { useEffect, useState, use, useRef } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle, CheckCircle, Lock, Menu, MonitorPlay, Star } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import dynamic from "next/dynamic"

const JitsiMeet = dynamic(() => import("@/components/jitsi-meet"), { ssr: false })

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

    // Video Player State
    const [isPlaying, setIsPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const progressRef = useRef(0) // Keep track of latest progress to send

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

    // Fetch Progress when activeLesson changes
    useEffect(() => {
        if (!activeLesson || activeLesson.isLive) return;

        const fetchProgress = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lectures/${activeLesson.id}/progress`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.progressSeconds > 0) {
                    // If player is already open, seek. If not, wait for start.
                    if (videoRef.current) {
                        videoRef.current.currentTime = res.data.progressSeconds;
                    }
                    progressRef.current = res.data.progressSeconds;
                }
            } catch (error) {
                console.error("Failed to fetch progress", error);
            }
        };
        fetchProgress();
        setIsPlaying(false); // Reset player state on lesson change
    }, [activeLesson]);

    // Heartbeat for Progress Tracking
    useEffect(() => {
        if (!isPlaying || activeLesson?.isLive) return;

        const interval = setInterval(async () => {
            if (!videoRef.current) return;

            const currentTime = Math.floor(videoRef.current.currentTime);
            const token = localStorage.getItem("token");

            // Only update if progressed
            if (currentTime > progressRef.current) {
                try {
                    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/courses/progress`, {
                        courseId: id,
                        lectureId: activeLesson.id,
                        progressSeconds: currentTime,
                        isCompleted: false
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    progressRef.current = currentTime;
                } catch (err) {
                    console.error("Failed to sync progress", err);
                }
            }
        }, 15000); // 15 seconds heartbeat

        return () => clearInterval(interval);
    }, [isPlaying, activeLesson, id]);

    const handleVideoEnd = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/courses/progress`, {
                courseId: id,
                lectureId: activeLesson.id,
                progressSeconds: Math.floor(videoRef.current?.duration || 0),
                isCompleted: true
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Lesson Completed!");
        } catch (err) {
            console.error("Failed to mark complete", err);
        }
    }

    const handleStartLesson = () => {
        setIsPlaying(true);
        // Timeout to allow DOM to update and ref to attach
        setTimeout(() => {
            if (videoRef.current && progressRef.current > 0) {
                videoRef.current.currentTime = progressRef.current;
                videoRef.current.play();
            }
        }, 100);
    }

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
                    {activeLesson?.isLive ? (
                        <div className="w-full h-[600px] bg-slate-900">
                            {!isPlaying ? (
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center z-10"
                                    onClick={handleStartLesson}
                                >
                                    <div className="text-center text-white/80 group-hover:text-white transition-colors cursor-pointer">
                                        <MonitorPlay className="h-20 w-20 mx-auto mb-4 opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                                        <p className="font-semibold text-lg tracking-wide">Join Live Session</p>
                                    </div>
                                </div>
                            ) : (
                                <JitsiMeet
                                    roomName={`AFS_${course.id}_${activeLesson.id}`}
                                    displayName="Student" // Ideally from User Context
                                    email="student@example.com"
                                    onApiReady={(api) => {
                                        // Auto-mark attendance
                                        api.addEventListener("videoConferenceJoined", async () => {
                                            const token = localStorage.getItem("token");
                                            try {
                                                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attendance/auto`,
                                                    { lectureId: activeLesson.id },
                                                    { headers: { Authorization: `Bearer ${token}` } }
                                                );
                                                console.log("Auto-attendance marked");
                                            } catch (e) {
                                                console.error("Auto-attendance failed", e);
                                            }
                                        });
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        isPlaying ? (
                            <video
                                ref={videoRef}
                                src={activeLesson?.videoUrl ? `${process.env.NEXT_PUBLIC_API_URL}${activeLesson.videoUrl}` : ""}
                                controls
                                className="w-full h-full object-contain"
                                onEnded={handleVideoEnd}
                                autoPlay
                            />
                        ) : (
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center"
                                onClick={handleStartLesson}
                            >
                                <div className="text-center text-white/80 group-hover:text-white transition-colors cursor-pointer">
                                    <PlayCircle className="h-20 w-20 mx-auto mb-4 opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                                    <p className="font-semibold text-lg tracking-wide">
                                        {progressRef.current > 0 ? 'Resume Lesson' : 'Start Lesson'}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
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
                            <div className="mt-16 pt-8 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        Student Feedback
                                        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{reviews.length}</span>
                                    </h3>
                                </div>

                                <div className="grid gap-8">
                                    <Card className="bg-blue-50/30 border-blue-100 border-dashed rounded-2xl overflow-hidden">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-blue-900">Share your journey</p>
                                                <div className="flex gap-1.5 p-1 bg-white/50 rounded-full border border-blue-100">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setRating(star)}
                                                            className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${rating >= star
                                                                ? 'bg-amber-400 text-white shadow-sm'
                                                                : 'text-slate-300 hover:text-amber-200'
                                                                }`}
                                                        >
                                                            <Star className={`h-4 w-4 ${rating >= star ? 'fill-white' : ''}`} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <textarea
                                                className="w-full p-4 text-sm border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 min-h-[100px]"
                                                placeholder="What did you think of this session? Your insights help us improve!"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] text-blue-600/70 font-medium max-w-[200px]">
                                                    * Your review will be moderated before appearing publicly.
                                                </p>
                                                <Button
                                                    size="sm"
                                                    onClick={handleSubmitReview}
                                                    className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 shadow-md shadow-blue-500/20"
                                                >
                                                    Post Review
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="flex gap-4 p-5 rounded-2xl border border-slate-50 bg-white shadow-sm hover:shadow-md transition-all group">
                                                <Avatar className="h-10 w-10 border border-slate-100">
                                                    <AvatarFallback className="bg-slate-100 text-slate-500 text-xs font-bold">
                                                        {review.student?.name?.[0].toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-bold text-slate-900 text-sm">{review.student?.name}</span>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 line-height-relaxed">{review.comment}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-2">
                                                        <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                                        {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {reviews.length === 0 && (
                                            <div className="text-center py-12 text-slate-400 italic text-sm">
                                                Be the first to share your thoughts on this course!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="w-full lg:w-80 border-slate-200">
// ... rest of file
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
