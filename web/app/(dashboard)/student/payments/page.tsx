"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, CreditCard, Calendar } from "lucide-react"

export default function PaymentHistoryPage() {
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPayments = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPayments(res.data);
            } catch (err) {
                console.error("Failed to fetch payments", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPayments()
    }, [])

    const handleDownloadInvoice = async (paymentId: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/invoice`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${paymentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Failed to download invoice", err);
            alert("Failed to download invoice");
        }
    }

    if (loading) return <div className="p-8">Loading payments...</div>

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Payment History</h1>
            <p className="text-slate-600">View your transaction history and download invoices.</p>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {payments.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No payment history found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payments.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{payment.course?.title || "Course Purchase"}</p>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}</span>
                                                <span className="text-xs px-2 py-0.5 bg-slate-100 rounded">ID: {payment.cfOrderId || payment.id.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">₹{payment.amount}</p>
                                            <p className={`text-xs uppercase font-bold ${payment.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                                                {payment.status}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleDownloadInvoice(payment.id)}
                                            disabled={payment.status !== 'completed'}
                                        >
                                            <Download className="h-4 w-4" /> Invoice
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
