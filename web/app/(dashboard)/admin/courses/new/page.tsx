"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, ChevronLeft, Upload, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NewCoursePage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        level: "",
        price: "",
        description: "",
        thumbnail: null as File | null
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSelectChange = (value: string, id: string) => {
        setFormData({ ...formData, [id]: value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, thumbnail: e.target.files[0] })
        }
    }

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    const onSubmit = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const finalData = new FormData()

            finalData.append('title', formData.title)
            finalData.append('category', formData.category)
            finalData.append('level', formData.level)
            finalData.append('price', formData.price)
            finalData.append('description', formData.description)
            if (formData.thumbnail) {
                finalData.append('thumbnail', formData.thumbnail)
            }

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/courses`, finalData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            router.push("/dashboard/faculty/courses")
        } catch (error) {
            console.error("Failed to create course", error)
            alert("Failed to create course. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Course</h1>
                <p className="text-slate-500">Share your knowledge with the world. Follow the steps below.</p>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"></div>
                {[1, 2, 3].map((s) => (
                    <div key={s} className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                        step >= s ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 text-slate-400"
                    )}>
                        {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                ))}
            </div>

            <Card className="border-slate-200 shadow-lg shadow-slate-200/50">
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Basic Information"}
                        {step === 2 && "Course Details"}
                        {step === 3 && "Media & Preview"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Let's start with the basics of your course."}
                        {step === 2 && "Tell students what they will learn."}
                        {step === 3 && "Upload a catchy thumbnail."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Course Title</Label>
                                <Input id="title" placeholder="e.g. Advanced Web Development" value={formData.title} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={formData.category} onValueChange={(val) => handleSelectChange(val, 'category')}>
                                        <SelectTrigger id="category"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Development">Development</SelectItem>
                                            <SelectItem value="Design">Design</SelectItem>
                                            <SelectItem value="Business">Business</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="level">Level</Label>
                                    <Select value={formData.level} onValueChange={(val) => handleSelectChange(val, 'level')}>
                                        <SelectTrigger id="level"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input id="price" type="number" placeholder="499" value={formData.price} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" className="min-h-[200px]" placeholder="Detailed description of your course..." value={formData.description} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label>Course Thumbnail</Label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group relative">
                                    <Input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {formData.thumbnail ? (
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                                                <CheckCircle2 className="w-8 h-8" />
                                            </div>
                                            <p className="font-medium text-slate-900">{formData.thumbnail.name}</p>
                                            <p className="text-sm text-slate-500">Click to replace</p>
                                        </div>
                                    ) : (
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <p className="font-medium text-slate-900">Click to upload or drag and drop</p>
                                            <p className="text-sm text-slate-500">SVG, PNG, JPG (max 5MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" onClick={prevStep} disabled={step === 1}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>

                    {step < 3 ? (
                        <Button onClick={nextStep}>
                            Next Step <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={onSubmit} disabled={loading}>
                            {loading ? "Creating..." : "Create Course"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
