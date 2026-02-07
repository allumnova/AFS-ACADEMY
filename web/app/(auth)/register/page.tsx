"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>("")

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const target = event.target as typeof event.target & {
            name: { value: string };
            email: { value: string };
            password: { value: string };
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                name: target.name.value,
                email: target.email.value,
                password: target.password.value,
                role: 'student' // Default to student
            });

            // Redirect to login on success
            router.push("/login?registered=true");

        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="animate-slide-up">
            <div className="flex flex-col space-y-2 text-center mb-8">
                <div className="mx-auto h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 mb-4 animate-fade-in">
                    <span className="text-white font-bold text-xl">A</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Create an account
                </h1>
                <p className="text-sm text-slate-500">
                    Join AFS Academy and start your learning journey
                </p>
            </div>

            <div className="bg-white p-8 animate-fade-in delay-100">
                <form onSubmit={onSubmit}>
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label className="sr-only" htmlFor="name">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Full Name"
                                type="text"
                                autoCapitalize="words"
                                autoComplete="name"
                                disabled={isLoading}
                                className="h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all rounded-lg"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="sr-only" htmlFor="email">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                className="h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all rounded-lg"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="sr-only" htmlFor="password">
                                Password
                            </Label>
                            <Input
                                id="password"
                                placeholder="Create a password"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="new-password"
                                disabled={isLoading}
                                className="h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all rounded-lg"
                                required
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-600 flex items-center animate-shake">
                                {error}
                            </div>
                        )}
                        <Button disabled={isLoading} className="h-11 text-sm font-bold rounded-lg shadow-sm bg-blue-600 hover:bg-blue-700 text-white border-0 transition-all">
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign Up
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-blue-600 hover:underline underline-offset-4 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
