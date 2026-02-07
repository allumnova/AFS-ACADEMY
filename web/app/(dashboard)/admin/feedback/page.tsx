"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, Trash2, Star, MessageSquare } from "lucide-react"

export default function FeedbackModerationPage() {
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setReviews(res.data)
        } catch (error) {
            console.error("Failed to fetch reviews", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token')
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            // Update local state
            setReviews(reviews.map(r => r.id === id ? { ...r, status } : r))
        } catch (error) {
            console.error("Failed to update status", error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setReviews(reviews.filter(r => r.id !== id))
        } catch (error) {
            console.error("Failed to delete review", error)
        }
    }

    if (loading) return <div className="p-8 text-slate-500">Loading reviews...</div>

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Feedback Moderation</h1>
                <p className="text-slate-500 mt-1 text-sm">Approve or reject student course reviews before they are visible publicly.</p>
            </div>

            <div className="grid gap-6">
                {reviews.map((review) => (
                    <Card key={review.id} className="border-slate-200 shadow-sm overflow-hidden bg-white hover:border-blue-200 transition-colors">
                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                            {/* Review Content */}
                            <div className="flex-1 p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-slate-100">
                                            <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold font-mono">
                                                {review.student?.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 leading-tight">{review.student?.name}</p>
                                            <p className="text-[10px] text-slate-500">{review.student?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 italic text-slate-700 text-sm relative">
                                    <MessageSquare className="absolute -top-2 -left-2 h-4 w-4 text-slate-200 fill-slate-200" />
                                    "{review.comment || 'No comment provided'}"
                                </div>

                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded">Course: <span className="text-slate-600">{review.course?.title}</span></span>
                                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Moderation Controls */}
                            <div className="w-full md:w-64 p-6 bg-slate-50/50 flex flex-col justify-center gap-3">
                                <div className="text-center mb-2">
                                    <Badge variant="outline" className={`font-bold uppercase tracking-widest text-[10px] ${review.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            review.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        {review.status}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={review.status === 'approved' ? 'default' : 'outline'}
                                        size="sm"
                                        className={review.status === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-white border-slate-200 text-slate-600'}
                                        onClick={() => handleStatusUpdate(review.id, 'approved')}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        variant={review.status === 'rejected' ? 'destructive' : 'outline'}
                                        size="sm"
                                        className={review.status === 'rejected' ? '' : 'bg-white border-slate-200 text-slate-600'}
                                        onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600 hover:bg-red-50 mt-1" onClick={() => handleDelete(review.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Permanently
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <MessageSquare className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No Feedback Yet</h3>
                        <p className="text-slate-500 text-sm italic">When students review courses, they will appear here for your approval.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
