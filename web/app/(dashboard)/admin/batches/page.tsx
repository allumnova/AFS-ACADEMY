"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PlusCircle, Edit, Trash, Users, Calendar, Clock } from "lucide-react"

export default function AdminBatchesPage() {
    const [batches, setBatches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/batches`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setBatches(res.data)
            } catch (error) {
                console.error("Failed to fetch batches", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBatches()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this batch?")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/batches/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBatches(batches.filter(b => b.id !== id));
        } catch (error: any) {
            console.error("Failed to delete batch", error);
            alert(error.response?.data?.message || "Failed to delete batch");
        }
    }

    if (loading) return <div className="p-8">Loading batches...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Batch Management</h1>
                    <p className="text-slate-500 mt-1">Manage class schedules and student assignments.</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20">
                    <Link href="/admin/batches/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Batch
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {batches.map((batch) => (
                    <Card key={batch.id} className="border-slate-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                        <div className="h-1.5 bg-blue-600 w-full" />
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-start">
                                <span className="text-xl font-bold text-slate-800">{batch.name}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${batch.status === 'active' ? 'bg-green-100 text-green-700' :
                                        batch.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-700'
                                    }`}>
                                    {batch.status}
                                </span>
                            </CardTitle>
                            <div className="text-xs font-semibold text-blue-600 flex items-center gap-1.5 mt-1">
                                <div className="h-1 w-1 bg-blue-600 rounded-full" />
                                {batch.course?.title || 'Unknown Course'}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center text-slate-600 gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span>{batch.startDate || 'No date'}</span>
                                </div>
                                <div className="flex items-center text-slate-600 gap-2">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span>{batch.startTime || 'No time'}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>Instructor: <span className="text-slate-900 font-medium">{batch.instructor?.name || 'Unassigned'}</span></span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 bg-slate-50/50 p-3">
                            <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <Link href={`/admin/batches/${batch.id}`}>
                                    <Users className="h-4 w-4 mr-2" />
                                    Students
                                </Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(batch.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {batches.length === 0 && (
                <Card className="border-dashed border-2 border-slate-200 shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No Batches Found</h3>
                        <p className="text-slate-500 max-w-xs mt-1 mb-6 text-sm">Create your first batch to start scheduling classes and managing student enrollments.</p>
                        <Button asChild className="bg-blue-600">
                            <Link href="/admin/batches/new">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Batch
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
