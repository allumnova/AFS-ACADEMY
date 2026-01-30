"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminStudentsPage() {
    // Mock Data for now as we don't have a dedicated "getAllUsers" endpoint for admin yet exposed cleanly
    // Ideally we would fetch from /api/admin/users?role=student
    const [students, setStudents] = useState([
        { id: 1, name: "Alice Johnson", email: "alice@example.com", joined: "2023-10-15", status: "Active", courses: 2 },
        { id: 2, name: "Bob Smith", email: "bob@example.com", joined: "2023-11-02", status: "Active", courses: 1 },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com", joined: "2023-12-10", status: "Inactive", courses: 0 },
        { id: 4, name: "David Wilson", email: "david@example.com", joined: "2024-01-05", status: "Active", courses: 3 },
        { id: 5, name: "Eva Green", email: "eva@example.com", joined: "2024-01-20", status: "Active", courses: 1 },
    ])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input placeholder="Search students..." className="pl-8" />
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b bg-slate-50/50">
                    <CardTitle className="text-base font-semibold">All Registered Students</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined Date</TableHead>
                                <TableHead>Enrolled Courses</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                                <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span>{student.name}</span>
                                                <span className="text-xs text-slate-500">{student.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={student.status === 'Active' ? 'default' : 'secondary'} className={student.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-600'}>
                                            {student.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{student.joined}</TableCell>
                                    <TableCell>{student.courses}</TableCell>
                                    <TableCell className="text-right">
                                        <button className="text-sm text-primary hover:underline">View Details</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
