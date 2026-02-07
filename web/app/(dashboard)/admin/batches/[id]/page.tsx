"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, UserPlus, Search, Calendar, Clock, BookOpen, UserCheck, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function BatchDetailsPage() {
    const params = useParams()
    const [batch, setBatch] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [allStudents, setAllStudents] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [addingStudent, setAddingStudent] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [batchRes, studentsRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/batches/${params.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/students`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ])
                setBatch(batchRes.data)
                setAllStudents(studentsRes.data)
            } catch (error) {
                console.error("Failed to fetch data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [params.id])

    const handleAddStudent = async (studentId: string) => {
        setAddingStudent(true)
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/batches/add-student`, {
                batchId: params.id,
                studentId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            // Refresh batch data
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/batches/${params.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setBatch(res.data)
        } catch (error: any) {
            console.error("Failed to add student", error)
            alert(error.response?.data?.message || "Failed to add student")
        } finally {
            setAddingStudent(false)
        }
    }

    const filteredStudents = allStudents.filter(s =>
        (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !batch?.students.some((existing: any) => existing.id === s.id)
    )

    if (loading) return <div className="p-8 text-slate-500 animate-pulse">Loading batch details...</div>
    if (!batch) return <div className="p-8 text-red-500">Batch not found.</div>

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 p-4 md:p-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full bg-slate-100 hover:bg-slate-200">
                        <Link href="/admin/batches">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{batch.name}</h1>
                            <Badge className={
                                batch.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                    batch.status === 'upcoming' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-slate-500'
                            }>
                                {batch.status.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                            <BookOpen className="h-4 w-4" /> {batch.course?.title}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Batch Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Session Info</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Timeline</p>
                                    <p className="text-sm font-bold text-slate-800">{batch.startDate} — {batch.endDate || 'Ongoing'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Time & Frequency</p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {batch.startTime} - {batch.endTime} • {Array.isArray(batch.days) ? batch.days.join(', ') : batch.days}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group pt-4 border-t border-slate-100">
                                <Avatar className="h-10 w-10 border-2 border-slate-100 group-hover:border-blue-200 transition-colors">
                                    <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                                        {batch.instructor?.name?.substring(0, 2).toUpperCase() || 'NA'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Faculty</p>
                                    <p className="text-sm font-bold text-slate-800">{batch.instructor?.name || 'No Instructor Assigned'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-500">Student Capacity</span>
                                    <span className="text-slate-900">{batch.students?.length || 0} / {batch.maxCapacity}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${(batch.students?.length / batch.maxCapacity) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content: Student Management */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Add Student Form */}
                    <Card className="border-slate-200 shadow-md shadow-slate-200/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-blue-600" />
                                Assign Student to Batch
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {searchTerm && (
                                <div className="border border-slate-100 rounded-lg mt-2 overflow-hidden bg-slate-50/50 max-h-[300px] overflow-y-auto divide-y divide-slate-100 shadow-inner">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map(student => (
                                            <div key={student.id} className="flex items-center justify-between p-3 hover:bg-white transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-slate-200 text-xs">{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 leading-tight">{student.name}</p>
                                                        <p className="text-[10px] text-slate-500 font-mono">{student.email}</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" onClick={() => handleAddStudent(student.id)} disabled={addingStudent}>
                                                    Assign
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-xs text-slate-500 italic">No matching students found or already enrolled.</div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Enrolled Students Table */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Enrolled Roster ({batch.students?.length || 0})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-700">Student</TableHead>
                                        <TableHead className="font-bold text-slate-700">Joined Date</TableHead>
                                        <TableHead className="font-bold text-slate-700">Status</TableHead>
                                        <TableHead className="text-right font-bold text-slate-700 pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {batch.students?.length > 0 ? (
                                        batch.students.map((student: any) => (
                                            <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                                <TableCell className="py-4 font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-slate-100">
                                                            <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-bold">
                                                                {student.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="text-slate-900 text-sm font-bold">{student.name}</span>
                                                            <span className="text-slate-500 text-[10px] font-mono">{student.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-600 font-medium">
                                                    {new Date(student.BatchStudent?.joiningDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] font-bold border-emerald-100 bg-emerald-50 text-emerald-700">
                                                        {student.BatchStudent?.status?.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-slate-400 italic text-sm">No students assigned to this batch yet.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
