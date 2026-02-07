"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, Mail, Calendar, TrendingUp } from "lucide-react"

export default function FacultyCourseStudentsPage() {
    const params = useParams()
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/${params.id}/students`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setEnrollments(res.data)
            } catch (error) {
                console.error("Failed to fetch students", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStudents()
    }, [params.id])

    if (loading) return <div className="p-8 text-slate-500 animate-pulse">Loading roster...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/faculty/courses">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Course Roster</h1>
                    <p className="text-slate-500">View and manage students enrolled in this course.</p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700">Student</TableHead>
                                <TableHead className="font-bold text-slate-700">Join Date</TableHead>
                                <TableHead className="font-bold text-slate-700">Progress</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 pr-6">Contact</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrollments.map((enr) => (
                                <TableRow key={enr.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-slate-100">
                                                <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-bold">
                                                    {enr.student?.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 text-sm font-bold">{enr.student?.name}</span>
                                                <span className="text-slate-500 text-[10px] font-mono">{enr.student?.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">
                                        <div className="flex items-center gap-1.5 font-medium text-xs">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {new Date(enr.createdAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="w-full max-w-[120px] space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                                <span>{enr.completionPercentage}%</span>
                                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${enr.completionPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full" asChild>
                                            <a href={`mailto:${enr.student?.email}`}>
                                                <Mail className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {enrollments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-slate-400 italic text-sm">No students enrolled in this course yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
