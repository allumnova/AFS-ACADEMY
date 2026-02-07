"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Settings,
    Palette,
    CreditCard,
    Lock,
    Save,
    RefreshCcw,
    Globe
} from "lucide-react"

export default function PlatformSettingsPage() {
    const [settings, setSettings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setSettings(res.data)
        } catch (error) {
            console.error("Fetch settings failed", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const token = localStorage.getItem("token")
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/settings`, { settings }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert("Platform updated successfully")
        } catch (error) {
            alert("Failed to update settings")
        } finally {
            setSaving(false)
        }
    }

    const updateValue = (key: string, value: string) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s))
    }

    const getVal = (key: string) => settings.find(s => s.key === key)?.value || ""

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Platform Configuration</h1>
                    <p className="text-slate-500 font-medium">Global site parameters and internal API integrations.</p>
                </div>
                <Button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="bg-slate-900 hover:bg-black text-white border-0 shadow-lg shadow-black/20 font-bold rounded-xl h-12 px-8"
                >
                    {saving ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Branding Section */}
                <Card className="border-slate-200 shadow-sm rounded-3xl bg-white overflow-hidden">
                    <div className="bg-indigo-50 px-8 py-4 border-b border-indigo-100 flex items-center justify-between">
                        <h2 className="text-indigo-900 font-black uppercase tracking-widest text-xs flex items-center">
                            <Palette className="h-4 w-4 mr-2" /> Visual Identity
                        </h2>
                    </div>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academy Name</Label>
                            <Input
                                value={getVal("SITE_NAME")}
                                onChange={(e) => updateValue("SITE_NAME", e.target.value)}
                                className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Public Logo URL</Label>
                            <Input
                                value={getVal("LOGO_URL")}
                                onChange={(e) => updateValue("LOGO_URL", e.target.value)}
                                className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Support Email</Label>
                            <Input
                                value={getVal("SUPPORT_EMAIL")}
                                onChange={(e) => updateValue("SUPPORT_EMAIL", e.target.value)}
                                className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Integration Section */}
                <Card className="border-slate-200 shadow-sm rounded-3xl bg-white overflow-hidden">
                    <div className="bg-emerald-50 px-8 py-4 border-b border-emerald-100 flex items-center justify-between">
                        <h2 className="text-emerald-900 font-black uppercase tracking-widest text-xs flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" /> Financial Gateways
                        </h2>
                    </div>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cashfree App ID</Label>
                            <Input
                                type="password"
                                value={getVal("CASHFREE_APP_ID")}
                                onChange={(e) => updateValue("CASHFREE_APP_ID", e.target.value)}
                                className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cashfree Secret Key</Label>
                            <Input
                                type="password"
                                value={getVal("CASHFREE_SECRET_KEY")}
                                onChange={(e) => updateValue("CASHFREE_SECRET_KEY", e.target.value)}
                                className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                            />
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                                <Globe className="h-4 w-4 text-amber-700" />
                            </div>
                            <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                Updating these keys will transition all future payments to the new account. Ensure the sandbox/production toggle is correctly verified.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Security/Maintenance Section */}
                <Card className="border-slate-200 shadow-sm rounded-3xl bg-white overflow-hidden lg:col-span-2">
                    <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-slate-900 font-black uppercase tracking-widest text-xs flex items-center">
                            <Lock className="h-4 w-4 mr-2" /> System Status
                        </h2>
                    </div>
                    <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                        <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                            <div>
                                <p className="font-black text-slate-900 text-sm uppercase">Maintenance Mode</p>
                                <p className="text-xs text-slate-500 mt-1">Locks all non-admin users out of the system.</p>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={getVal("MAINTENANCE_MODE") === "true"}
                                    onChange={(e) => updateValue("MAINTENANCE_MODE", e.target.checked.toString())}
                                    className="h-6 w-12 rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                            <div>
                                <p className="font-black text-slate-900 text-sm uppercase">Enrollment Switch</p>
                                <p className="text-xs text-slate-500 mt-1">Globally disables new course registrations.</p>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={getVal("DISABLE_ENROLLMENTS") === "true"}
                                    onChange={(e) => updateValue("DISABLE_ENROLLMENTS", e.target.checked.toString())}
                                    className="h-6 w-12 rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
