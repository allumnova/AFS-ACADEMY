"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import JitsiMeet from "@/components/jitsi-meet"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function LiveClassPage() {
    const params = useParams()
    const router = useRouter()
    const { id } = params

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [lecture, setLecture] = useState<any>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/login")
                return
            }

            try {
                // 1. Get User Profile
                const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(userRes.data)

                // 2. Get Lecture Details 
                // Note: The backend should ideally verify enrollment here
                const lectureRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lectures/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setLecture(lectureRes.data)

                setLoading(false)
            } catch (err) {
                console.error("Error fetching class details", err)
                setError("Failed to load class. You might not be enrolled or the class doesn't exist.")
                setLoading(false)
            }
        }

        fetchData()
    }, [id, router])

    if (loading) return <div className="p-10 text-center">Loading Class Environment...</div>

    if (error) return (
        <div className="p-10 text-center text-red-500">
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
        </div>
    )

    // Generate unique room name: AFS_Academy_CourseID_LectureID
    const roomName = `AFS_Academy_${lecture.courseId}_${lecture.id}`

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{lecture.title}</h1>
                    <p className="text-muted-foreground">Live Interactive Session</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    Exit Class
                </Button>
            </div>

            <Card className="flex-1 overflow-hidden border-0 shadow-lg">
                <CardContent className="p-0 h-full">
                    <JitsiMeet
                        roomName={roomName}
                        displayName={user.name}
                        email={user.email}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
