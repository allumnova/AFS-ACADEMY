"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, CreditCard, ArrowUpRight, Download, Search, Filter, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useState, useEffect } from "react" // Added useState and useEffect

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPayments = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            // Note: The /export/revenue returns CSV, I need a JSON endpoint.
            // Let's use the dashboard stats recent enrollments or create a new dedicated JSON endpoint.
            // Actually, I'll create a dedicated getAllPayments endpoint in adminController.
            // For now, using a placeholder or a temporary endpoint if available.
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/payments`, { // Assuming a new endpoint /admin/payments
                headers: { Authorization: `Bearer ${token}` }
            })
            setPayments(res.data)
        } catch (error) {
            console.error("Failed to fetch payments", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPayments()
    }, [])

    const handleExportRevenue = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/export/revenue`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'revenue.csv')
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error("Export failed", error)
        }
    }

    const handleRefund = async (id: string) => {
        if (!confirm("Are you sure you want to refund this payment? This will also revoke their enrollment.")) return;

        try {
            const token = localStorage.getItem("token")
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/payments/${id}/refund`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Refund processed successfully!");
            fetchPayments();
        } catch (error) {
            console.error("Refund failed", error);
            alert("Failed to process refund.");
        }
    }

    const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

    const refundCount = payments.filter(p => p.status === 'refunded').length
    const refundRate = payments.length > 0 ? (refundCount / payments.length * 100).toFixed(1) : "0.0"

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-white/10 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Financial Overview</h1>
                        <p className="text-slate-400 font-medium">Track revenue, payouts, and transaction history.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={handleExportRevenue} className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/20 font-bold">
                            <Download className="h-4 w-4 mr-2" /> Export Report
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="glass-panel p-6 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Revenue</p>
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">
                        ₹{totalRevenue.toLocaleString()}
                    </div>
                    <div className="mt-2 flex items-center text-xs font-bold text-emerald-500">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> Verified <span className="text-slate-500 font-medium ml-1">platform earnings</span>
                    </div>
                </div>

                <div className="glass-panel p-6 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transactions</p>
                        <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <CreditCard className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors">
                        {payments.length}
                    </div>
                    <div className="mt-2 text-xs text-slate-500 font-medium">
                        Total payments processed
                    </div>
                </div>

                <div className="glass-panel p-6 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Refund Rate</p>
                        <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                            <ArrowUpRight className="h-4 w-4 rotate-180" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white group-hover:text-red-400 transition-colors">
                        {refundRate}%
                    </div>
                    <div className="mt-2 text-xs text-slate-500 font-medium">
                        {refundCount} total refunds
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-white">Transaction History</h3>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
                            <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-white/20" /></div>
                ) : (
                    <div className="space-y-4">
                        {payments.map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${p.status === 'completed'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        : p.status === 'refunded' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}>
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{p.student?.name}</p>
                                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">{p.course?.title}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-mono tracking-tight">{p.cfOrderId} • {new Date(p.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="font-bold text-white text-base">₹{parseFloat(p.amount).toLocaleString()}</p>
                                        <Badge variant="outline" className={`mt-1 text-[10px] uppercase tracking-wider ${p.status === "completed"
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            : p.status === "refunded" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                            }`}>
                                            {p.status}
                                        </Badge>
                                    </div>
                                    {p.status === 'completed' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRefund(p.id)}
                                            className="h-8 text-[10px] font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20 rounded-lg"
                                        >
                                            Refund
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
