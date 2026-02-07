"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreVertical, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface Student {
    id: string
    name: string
    email: string
    avatar?: string
    status: string
    joined: string
    activeCourses: number
    completedCourses: number
    courses: number
}

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/students`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setStudents(res.data)
            } catch (err) {
                console.error("Failed to fetch students", err)
                setError("Failed to load student directory.")
            } finally {
                setLoading(false)
            }
        }
        fetchStudents()
    }, [])

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleExport = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/export/students`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'students.csv')
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error("Export failed", error)
        }
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto p-6 md:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">Student Directory</h1>
                    <p className="text-slate-500 text-sm">Manage and monitor student enrollments and status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-full md:w-auto">
                        <Search className="h-4 w-4 text-slate-400 ml-2" />
                        <Input
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-none shadow-none focus-visible:ring-0 text-sm w-full md:w-64"
                        />
                    </div>
                    <Button variant="outline" onClick={handleExport} className="rounded-xl border-slate-200">
                        <MoreVertical className="h-4 w-4 mr-2" /> Export to CSV
                    </Button>
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 shadow-lg shadow-slate-200">
                        Add Student
                    </Button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" /> {error}
                </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50 border-b border-slate-100">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="py-4 pl-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[300px]">Student</TableHead>
                                <TableHead className="py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                                <TableHead className="py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</TableHead>
                                <TableHead className="py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrollments</TableHead>
                                <TableHead className="py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[200px]">Progress</TableHead>
                                <TableHead className="py-4 pr-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // Loading Skeleton
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="pl-6"><div className="h-10 w-40 bg-slate-100 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-6 w-16 bg-slate-100 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-4 w-12 bg-slate-100 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-2 w-full bg-slate-100 rounded animate-pulse" /></TableCell>
                                        <TableCell className="pr-6"><div className="h-8 w-8 bg-slate-100 rounded-full ml-auto animate-pulse" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                        No students found matching your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.id} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                                        <TableCell className="py-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-slate-100 bg-white shadow-sm">
                                                    <AvatarImage src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                                                    <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                                                        {student.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{student.name}</p>
                                                    <p className="text-xs text-slate-500 font-mono">{student.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant="secondary" className={
                                                student.status === 'Active'
                                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"
                                            }>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                {student.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-slate-600">
                                            {new Date(student.joined).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-medium text-slate-900">{student.activeCourses}</span>
                                                <span className="text-slate-400 text-xs">Active</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="w-full max-w-[140px]">
                                                <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-medium">
                                                    <span>Completion Rate</span>
                                                    <span>{student.courses > 0 ? Math.round((student.completedCourses / student.courses) * 100) : 0}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${student.courses > 0 ? (student.completedCourses / student.courses) * 100 : 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 pr-6 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination (Visual Only for now) */}
                <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-slate-50/50">
                    <p className="text-xs text-slate-500">Showing <span className="font-medium text-slate-900">{filteredStudents.length}</span> students</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs bg-white border-slate-200 hover:bg-slate-50 text-slate-600" disabled>Previous</Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs bg-white border-slate-200 hover:bg-slate-50 text-slate-600" disabled>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
