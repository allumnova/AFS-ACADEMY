"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import axios from "axios"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export default function SettingsPage() {
    const [user, setUser] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [message, setMessage] = React.useState({ type: "", text: "" })

    React.useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get("http://localhost:5000/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUser(response.data)
        } catch (err) {
            setMessage({ type: "error", text: "Failed to load profile." })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage({ type: "", text: "" })

        try {
            const token = localStorage.getItem("token")
            const response = await axios.put("http://localhost:5000/api/users/profile", {
                name: user.name,
                phone: user.phone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessage({ type: "success", text: "Profile updated successfully!" })
            localStorage.setItem("user", JSON.stringify(response.data.user))
        } catch (err) {
            setMessage({ type: "error", text: "Failed to update profile." })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>

            {message.text && (
                <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${message.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave}>
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>Manage your public profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Display Name</Label>
                            <Input
                                id="name"
                                value={user?.name || ""}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                            <Input
                                id="email"
                                value={user?.email || ""}
                                disabled
                                className="h-11 bg-slate-50/50 border-slate-200 cursor-not-allowed opacity-70"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number</Label>
                            <Input
                                id="phone"
                                value={user?.phone || ""}
                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                placeholder="+91 00000 00000"
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex justify-end py-4">
                        <Button type="submit" disabled={isSaving} className="px-8 shadow-md">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </form>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you receive alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                        <Label htmlFor="marketing-emails" className="flex flex-col space-y-1 cursor-pointer">
                            <span className="font-semibold text-slate-700 text-sm">Marketing emails</span>
                            <span className="font-normal text-xs text-slate-500">Receive emails about new products, features, and more.</span>
                        </Label>
                        <Switch id="marketing-emails" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                        <Label htmlFor="security-emails" className="flex flex-col space-y-1 cursor-pointer">
                            <span className="font-semibold text-slate-700 text-sm">Security emails</span>
                            <span className="font-normal text-xs text-slate-500">Receive emails about your account activity and security.</span>
                        </Label>
                        <Switch id="security-emails" defaultChecked />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
