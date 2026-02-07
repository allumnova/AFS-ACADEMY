"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Shield,
    ShieldCheck,
    UserPlus,
    Power,
    Loader2,
    Mail,
    Calendar,
    Search
} from "lucide-react"

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [formData, setFormData] = useState({ name: "", email: "", password: "", isSuperAdmin: false })

    useEffect(() => {
        fetchAdmins()
    }, [])

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/admins`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAdmins(res.data)
        } catch (error) {
            console.error("Fetch admins failed", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("token")
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/admins`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setFormData({ name: "", email: "", password: "", isSuperAdmin: false })
            setShowCreate(false)
            fetchAdmins()
            alert("Admin created successfully")
        } catch (error) {
            alert("Failed to create admin")
        }
    }

    const toggleStatus = async (id: string) => {
        try {
            const token = localStorage.getItem("token")
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/admins/${id}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchAdmins()
        } catch (error) {
            alert("Action failed")
        }
    }

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Internal Governance</h1>
                    <p className="text-slate-500 font-medium">Manage administrative access and system permissions.</p>
                </div>
                <Button
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-600/20 font-bold rounded-xl h-12 px-6"
                >
                    {showCreate ? "Cancel" : <><UserPlus className="h-4 w-4 mr-2" /> New Admin</>}
                </Button>
            </div>

            {showCreate && (
                <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden animate-slide-up bg-white">
                    <CardContent className="p-8">
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                                    <Input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</Label>
                                    <Input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                                    />
                                </div>
                                <div className="flex items-center gap-2 py-2">
                                    <input
                                        type="checkbox"
                                        id="superAdmin"
                                        checked={formData.isSuperAdmin}
                                        onChange={(e) => setFormData({ ...formData, isSuperAdmin: e.target.checked })}
                                        className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <Label htmlFor="superAdmin" className="text-sm font-bold text-slate-900 cursor-pointer">Grant Super Admin Privileges</Label>
                                </div>
                                <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black rounded-xl shadow-lg transition-all">
                                    Initialize Account
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {admins.map((admin) => (
                    <Card key={admin.id} className={`group overflow-hidden border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl bg-white ${!admin.isActive && 'opacity-60'}`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${admin.isSuperAdmin ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-100 text-slate-600'}`}>
                                    {admin.isSuperAdmin ? <ShieldCheck className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
                                </div>
                                <Badge variant="outline" className={`text-[10px] uppercase font-black tracking-widest ${admin.isActive ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-400 border-slate-200 bg-slate-50'}`}>
                                    {admin.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{admin.name}</h3>
                                    <div className="flex items-center text-slate-500 mt-1 text-sm font-medium">
                                        <Mail className="h-3 w-3 mr-2" /> {admin.email}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" /> Since {new Date(admin.createdAt).toLocaleDateString()}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleStatus(admin.id)}
                                        className={`h-8 w-8 p-0 rounded-lg ${admin.isActive ? 'text-red-400 hover:text-red-500 hover:bg-red-50' : 'text-emerald-400 hover:text-emerald-500 hover:bg-emerald-50'}`}
                                    >
                                        <Power className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
