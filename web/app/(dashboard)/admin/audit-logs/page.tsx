"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    History,
    FileText,
    Terminal,
    User,
    Calendar,
    Search as SearchIcon,
    AlertCircle
} from "lucide-react"

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/super-admin/audit-logs`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLogs(res.data)
        } catch (error) {
            console.error("Fetch logs failed", error)
        } finally {
            setLoading(false)
        }
    }

    const getActionColor = (action: string) => {
        if (action.includes("CREATE")) return "bg-emerald-500/10 text-emerald-600 border-emerald-200"
        if (action.includes("DELETE")) return "bg-red-500/10 text-red-600 border-red-200"
        if (action.includes("UPDATE")) return "bg-indigo-500/10 text-indigo-600 border-indigo-200"
        return "bg-slate-100 text-slate-600 border-slate-200"
    }

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-50 pb-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Audit Trails</h1>
                        <p className="text-slate-500 font-medium">Immutable registry of administrative activities.</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl shadow-black/20">
                        <Terminal className="h-6 w-6" />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            placeholder="Filter by action or user..."
                            className="w-full h-12 bg-slate-50 border-0 rounded-2xl pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-20 text-slate-300">
                        <History className="h-8 w-8 animate-spin" />
                    </div>
                ) : logs.map((log) => (
                    <Card key={log.id} className="border-slate-100 shadow-sm rounded-2xl bg-white hover:border-indigo-100 transition-all group">
                        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <Badge variant="outline" className={`text-[10px] uppercase font-black px-2 py-0.5 tracking-widest ${getActionColor(log.action)}`}>
                                            {log.action}
                                        </Badge>
                                        <span className="text-slate-900 font-bold text-sm tracking-tight">{log.target}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                                        <span className="flex items-center text-slate-600">
                                            <User className="h-3 w-3 mr-1.5" /> {log.user?.name} ({log.user?.email})
                                        </span>
                                        <span className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1.5" /> {new Date(log.createdAt).toLocaleString()}
                                        </span>
                                        <span className="flex items-center font-mono">
                                            IP: {log.ipAddress}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {log.details && (
                                <div className="md:text-right">
                                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-mono text-slate-600">
                                        <AlertCircle className="h-3 w-3 mr-2 text-indigo-500" />
                                        Context Captured
                                    </div>
                                    <p className="mt-1 text-[10px] text-slate-400 max-w-[200px] truncate">{JSON.stringify(log.details)}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {!loading && logs.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
                        <History className="h-12 w-12 mx-auto mb-4 opacity-10" />
                        <p className="font-medium">No activity records found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
