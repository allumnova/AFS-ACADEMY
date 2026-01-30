"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Check } from "lucide-react"

interface EnrollButtonProps {
    courseId: number
    price: number
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

            // Mocking a successful payment verification directly for demo
            await axios.post("http://localhost:5000/api/payments/verify",
                {
                    courseId,
                    amount: price,
                    paymentId: `mock_pay_${Date.now()}`
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setEnrolled(true)
            setTimeout(() => setEnrolled(false), 3000) // Reset after 3 seconds
        } catch (error) {
            console.error("Enrollment failed", error)
            alert("Failed to enroll. Please try again.")
        } finally {
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
