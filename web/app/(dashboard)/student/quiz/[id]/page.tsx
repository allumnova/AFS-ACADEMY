"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

interface Question {
    id: number
    question: string
    options: string[]
}

interface QuizData {
    id: string
    title: string
    description: string
    durationMinutes: number
    questions: Question[]
}

export default function QuizPage() {
    const params = useParams()
    const router = useRouter()
    const { id } = params

    const [loading, setLoading] = useState(true)
    const [quiz, setQuiz] = useState<QuizData | null>(null)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState<any>(null)

    useEffect(() => {
        const fetchQuiz = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                router.push("/login")
                return
            }

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setQuiz(res.data)
                setLoading(false)
            } catch (error) {
                console.error("Failed to load quiz", error)
                alert("Failed to load quiz. You might not be enrolled.")
                router.back()
            }
        }
        fetchQuiz()
    }, [id, router])

    const handleOptionSelect = (questionId: number, option: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }))
    }

    const handleSubmit = async () => {
        if (!quiz) return

        // Basic validation
        if (Object.keys(answers).length < quiz.questions.length) {
            if (!confirm("You haven't answered all questions. Submit anyway?")) return
        }

        setSubmitting(true)
        const token = localStorage.getItem("token")

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}/submit`,
                { answers },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setResult(res.data.result)
        } catch (error) {
            console.error("Submit failed", error)
            alert("Failed to submit quiz.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-8 text-center">Loading Quiz...</div>

    if (result) {
        return (
            <div className="container max-w-2xl py-12">
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle className="text-3xl">Quiz Result</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-center">
                            {result.status === 'pass' ? (
                                <CheckCircle className="h-20 w-20 text-green-500" />
                            ) : (
                                <XCircle className="h-20 w-20 text-red-500" />
                            )}
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">{result.score}%</div>
                            <div className={`text-xl font-medium ${result.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                {result.status === 'pass' ? 'PASSED' : 'FAILED'}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-left bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                            <div>Total Questions:</div>
                            <div className="font-bold text-right">{result.totalQuestions}</div>
                            <div>Correct Answers:</div>
                            <div className="font-bold text-right">{result.correctCount}</div>
                        </div>
                        <Button className="w-full" onClick={() => router.push("/dashboard/student")}>
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container max-w-3xl py-8 space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold">{quiz?.title}</h1>
                    <p className="text-muted-foreground">{quiz?.description}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium">Time Limit</div>
                    <div className="text-xl font-bold">{quiz?.durationMinutes} mins</div>
                </div>
            </div>

            <div className="space-y-6">
                {quiz?.questions.map((q, index) => (
                    <Card key={q.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                                {q.question}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                value={answers[q.id]}
                                onValueChange={(val: string) => handleOptionSelect(q.id, val)}
                            >
                                {q.options.map((opt, i) => (
                                    <div key={i} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                                        <RadioGroupItem value={opt} id={`q${q.id}-opt${i}`} />
                                        <Label htmlFor={`q${q.id}-opt${i}`} className="flex-1 cursor-pointer">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end pt-4">
                <Button size="lg" onClick={handleSubmit} disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Quiz
                </Button>
            </div>
        </div>
    )
}
