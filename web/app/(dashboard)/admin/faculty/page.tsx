"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from "lucide-react"

export default function AdminFacultyPage() {
    const [faculties, setFaculties] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({ name: "", email: "", password: "" })

    useEffect(() => {
        fetchFaculties()
    }, [])

    const fetchFaculties = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            // Fetching users with role='faculty'. Assuming GET /users?role=faculty is supported or will be.
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?role=faculty`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFaculties(res.data);
        } catch (err) {
            console.error("Failed to fetch faculties", err);
        } finally {
            setLoading(false);
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/faculty`, {
                ...formData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Faculty created successfully");
            setOpen(false);
            setFormData({ name: "", email: "", password: "" });
            fetchFaculties();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to create faculty");
        }
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Faculty Management</h1>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button className="gap-2">
                            <PlusCircle className="h-4 w-4" /> Add Faculty
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add New Faculty</SheetTitle>
                            <SheetDescription>
                                Create a new faculty account. They will receive an email to login.
                            </SheetDescription>
                        </SheetHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div>
                                <Label>Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div>
                                <Label>Password</Label>
                                <Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                            </div>
                            <Button type="submit" className="w-full">Create Faculty</Button>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {faculties.map((faculty) => (
                                <TableRow key={faculty.id}>
                                    <TableCell className="font-medium">{faculty.name}</TableCell>
                                    <TableCell>{faculty.email}</TableCell>
                                    <TableCell>{new Date(faculty.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {faculties.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">No faculty members found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
