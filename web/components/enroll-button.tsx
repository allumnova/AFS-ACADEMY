"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Check } from "lucide-react"

interface EnrollButtonProps {
    courseId: number
    price: string | number
    variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
}

export function EnrollButton({ courseId, price, variant = "default", size = "default", className }: EnrollButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [enrolled, setEnrolled] = useState(false)

    const handleEnroll = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/login")
                return
            }

            // Parse price to number
            const amount = typeof price === 'string'
                ? parseFloat(price.replace(/,/g, ''))
                : price;

            // 1. Create Order
            const orderRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payments/orders`,
                {
                    courseId,
                    amount,
                    currency: "INR"
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            const { payment_session_id } = orderRes.data

            // 2. Load Cashfree SDK
            const { load } = await import('@cashfreepayments/cashfree-js')
            const cashfree = await load({
                mode: "sandbox"
            })

            // 3. Initiate Checkout
            await cashfree.checkout({
                paymentSessionId: payment_session_id,
                returnUrl: `${window.location.origin}/payments/verify?order_id=${orderRes.data.order_id}`,
            })

            // Note: The redirection happens automatically, so we don't need to manually setEnrolled here.

        } catch (error) {
            console.error("Enrollment initiation failed", error)
            alert("Failed to start payment. Please try again.")
            setLoading(false)
        }
    }

    if (enrolled) {
        return (
            <Button variant="secondary" size={size} className={className} disabled>
                <Check className="mr-2 h-4 w-4" /> Enrolled
            </Button>
        )
    }

    return (
        <Button variant={variant} size={size} className={className} onClick={handleEnroll} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Enroll Now"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
    )
}
