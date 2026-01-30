"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

function VerifyContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const orderId = searchParams.get("order_id")
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")

    useEffect(() => {
        if (!orderId) {
            setStatus("failed")
            return
        }

        const verify = async () => {
            try {
                const token = localStorage.getItem("token")
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/payments/verify`,
                    { orderId },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setStatus("success")
            } catch (error) {
                console.error("Verification failed", error)
                setStatus("failed")
            }
        }

        verify()
    }, [orderId])

    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Verifying your payment...</p>
                    </div>
                )}
                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                        <h2 className="mt-4 text-xl font-bold text-green-600">Payment Successful!</h2>
                        <p className="text-sm text-muted-foreground mt-2">You have been enrolled in the course.</p>
                        <Button className="mt-6 w-full" onClick={() => router.push("/dashboard/student")}>
                            Go to Dashboard
                        </Button>
                    </div>
                )}
                {status === "failed" && (
                    <div className="flex flex-col items-center">
                        <XCircle className="h-12 w-12 text-red-500" />
                        <h2 className="mt-4 text-xl font-bold text-red-600">Payment Failed</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            We couldn't verify your payment. Please try again or contact support.
                        </p>
                        <Button variant="outline" className="mt-6 w-full" onClick={() => router.push("/courses")}>
                            Back to Courses
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function VerifyPaymentPage() {
    return (
        <div className="container max-w-md py-20">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
                <VerifyContent />
            </Suspense>
        </div>
    )
}
