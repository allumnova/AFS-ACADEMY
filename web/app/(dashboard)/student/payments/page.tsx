"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, CreditCard, Calendar, CheckCircle2, Loader2 } from "lucide-react"

export default function StudentPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem("token")
                // In a real app, there would be a student-specific payments endpoint
                // For now, we'll fetch from a generic one if it exists or use admin's stats
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setPayments(res.data)
            } catch (error) {
                console.error("Failed to fetch payments", error)
            } finally {
                setLoading(false)
            }
        }
        fetchPayments()
    }, [])

    const handleDownloadInvoice = async (paymentId: string) => {
        try {
            const token = localStorage.getItem("token")
            window.open(`${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/invoice?token=${token}`, '_blank')
        } catch (error) {
            console.error("Failed to download invoice", error)
            alert("Failed to generate invoice")
        }
    }

    if (loading) return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading records...</div>

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payments & Invoices</h1>
                <p className="text-muted-foreground">Manage your course fees and download transaction receipts.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Invoices Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{payments.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Last Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {payments.length > 0 ? new Date(payments[0].paymentDate).toLocaleDateString() : 'N/A'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All your course enrollments and payment details.</CardDescription>
                </CardHeader>
                <CardContent>
                    {payments.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Invoice</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">{payment.course?.title || 'General Fee'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-xs text-slate-500">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                {new Date(payment.paymentDate).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>₹{payment.amount}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-green-600 text-xs font-bold uppercase">
                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                {payment.status}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDownloadInvoice(payment.id)}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                PDF
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <CreditCard className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                            <p>No transactions found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
