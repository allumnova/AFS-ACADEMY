"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, BarChart3, TrendingUp, Loader2, BookOpen } from "lucide-react"

export default function AdminRevenuePage() {
    const [revenueData, setRevenueData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/revenue/courses`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setRevenueData(res.data)
            } catch (error) {
                console.error("Failed to fetch revenue", error)
            } finally {
                setLoading(false)
            }
        }
        fetchRevenue()
    }, [])

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

    const totalRevenue = revenueData.reduce((acc, curr) => acc + parseFloat(curr.totalRevenue), 0)
    const totalSales = revenueData.reduce((acc, curr) => acc + parseInt(curr.totalSales), 0)

    return (
        <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Revenue Analytics</h1>
                <p className="text-slate-500">Detailed breakdown of earnings across all courses.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-slate-900 text-white border-0 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Lifetime Revenue</p>
                            <DollarSign className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div className="text-4xl font-black mb-2">₹{totalRevenue.toLocaleString()}</div>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                            Gross platform earnings
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Enrollments</p>
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="text-4xl font-black text-slate-900 mb-2">{totalSales}</div>
                        <p className="text-sm text-slate-500">Paid student course registrations</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avg. Basket Size</p>
                            <BarChart3 className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div className="text-4xl font-black text-slate-900 mb-2">₹{(totalSales > 0 ? (totalRevenue / totalSales).toFixed(0) : 0).toLocaleString()}</div>
                        <p className="text-sm text-slate-500">Average revenue per enrollment</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <Card className="border-slate-200 shadow-sm rounded-3xl">
                    <CardHeader className="border-b border-slate-100 p-8">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Course-wise Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-8">
                            {revenueData.map((data, i) => {
                                const percentage = (parseFloat(data.totalRevenue) / totalRevenue) * 100
                                return (
                                    <div key={data.courseId} className="group">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-xs tracking-wider">{data.course?.title}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{data.totalSales} Sales • ₹{data.course?.price} per seat</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-slate-900">₹{parseFloat(data.totalRevenue).toLocaleString()}</p>
                                                <p className="text-[10px] font-bold text-emerald-600">{percentage.toFixed(1)}% share</p>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 group-hover:bg-blue-500 transition-all duration-1000"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                            {revenueData.length === 0 && (
                                <div className="text-center py-20 text-slate-500">No revenue data available yet.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
