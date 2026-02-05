"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, Loader2 } from "lucide-react"

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCertificates = async () => {
            const token = localStorage.getItem("token")
            if (!token) return
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/certificates/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setCertificates(res.data)
            } catch (err) {
                console.error("Failed to fetch certificates", err)
            } finally {
                setLoading(false)
            }
        }
        fetchCertificates()
    }, [])

    if (loading) return <div className="p-8 flex items-center gap-2 text-slate-500"><Loader2 className="animate-spin" /> Loading certificates...</div>

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-8 w-8 text-primary" />
                My Certificates
            </h1>

            {certificates.length === 0 ? (
                <div className="glass-card rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        <Award className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No certificates yet</h3>
                    <p className="text-sm text-muted-foreground mt-2">Complete courses to earn your certificates.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="glass-card border-none hover-card overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{cert.course?.title || "Course Certificate"}</CardTitle>
                                <p className="text-xs text-slate-500">Issued on {new Date(cert.issueDate).toLocaleDateString()}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="aspect-[1.414/1] bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center border border-slate-200">
                                    <Award className="h-16 w-16 text-slate-300" />
                                </div>
                                <div className="text-xs text-center text-slate-400 font-mono">ID: {cert.uniqueId}</div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full gap-2" asChild>
                                    <a href={`${(process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '')}${cert.certificateUrl}`} target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4" /> Download PDF
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
