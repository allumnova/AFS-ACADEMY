"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminPaymentsPage() {
    const transactions = [
        { id: "TXN001", user: "Alice Johnson", amount: "$49.99", status: "completed", date: "2024-02-10" },
        { id: "TXN002", user: "Bob Smith", amount: "$199.00", status: "completed", date: "2024-02-09" },
        { id: "TXN003", user: "Charlie Brown", amount: "$49.99", status: "failed", date: "2024-02-08" },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450.00</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1,200.00</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Refunds</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$149.97</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.map((txn) => (
                            <div key={txn.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">{txn.user}</p>
                                    <p className="text-sm text-muted-foreground">{txn.id} • {txn.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{txn.amount}</p>
                                    <Badge variant={txn.status === "completed" ? "default" : "destructive"} className="capitalize">
                                        {txn.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
