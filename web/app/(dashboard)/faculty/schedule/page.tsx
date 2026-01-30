"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function FacultySchedulePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
            </div>

            <Card className="border-dashed shadow-none bg-slate-50">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-6 w-6 text-slate-400" />
                    </div>
                    <CardTitle className="text-lg font-medium text-slate-900">No Classes Scheduled</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-slate-500 pb-8">
                    You don't have any upcoming live sessions or office hours scheduled.
                    <br />
                    <span className="text-xs text-slate-400">Integration with Calendar API coming soon.</span>
                </CardContent>
            </Card>
        </div>
    )
}
