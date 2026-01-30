"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Users, Calendar, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"

export default function AttendanceReportPage() {
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const token = localStorage.getItem("token")
                // Fetch all attendance records (restricted by role in backend)
                const res = await axios.get("http://localhost:5000/api/attendance", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setReports(res.data)
            } catch (error) {
                console.error("Failed to fetch attendance reports", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAttendance()
    }, [])

    if (loading) return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading reports...</div>

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Reports</h1>
                    <p className="text-muted-foreground">Monitor student presence across all courses and lectures.</p>
                </div>
                <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reports.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Present Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reports.filter(r => new Date(r.date).toDateString() === new Date().toDateString() && r.status === 'present').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Attendance Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reports.length > 0 ? ((reports.filter(r => r.status === 'present').length / reports.length) * 100).toFixed(1) : 0}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-100 shadow-sm">
                <CardHeader>
                    <CardTitle>Detailed Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Lecture</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                                                <Users className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{record.student?.name}</div>
                                                <div className="text-xs text-slate-500">{record.student?.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-slate-700">{record.lecture?.title}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-xs text-slate-500">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {new Date(record.date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {record.status === 'present' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 uppercase">
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                Present
                                            </span>
                                        ) : record.status === 'late' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-700 uppercase">
                                                <Clock className="mr-1 h-3 w-3" />
                                                Late
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 uppercase">
                                                <XCircle className="mr-1 h-3 w-3" />
                                                Absent
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {reports.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No attendance records found.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
