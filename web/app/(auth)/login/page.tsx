"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
// We'll add Spinner/Icons later, for now simple text
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { ShieldCheck, GraduationCap, User, Loader2 } from "lucide-react"

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>("")

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const target = event.target as typeof event.target & {
            email: { value: string };
            password: { value: string };
        };
        const email = target.email.value;
        const password = target.password.value;

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                email,
                password
            });

            // Save token (in real app use standard cookie/storage)
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Redirect based on role
            if (response.data.user.role === 'admin') {
                router.push("/admin");
            } else if (response.data.user.role === 'faculty') {
                router.push("/faculty");
            } else {
                router.push("/student");
            }

        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false)
        }
    }

    async function loginAs(role: 'admin' | 'faculty' | 'student') {
        setIsLoading(true);
        setError("");
        const demoCredentials = {
            admin: { email: 'admin@afs.com', password: 'password123' },
            faculty: { email: 'faculty@afs.com', password: 'password123' },
            student: { email: 'student@afs.com', password: 'password123' }
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, demoCredentials[role]);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            router.push(`/${role}`);
        } catch (e) {
            setError("Demo Login Failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="animate-slide-up">
                <div className="flex flex-col space-y-2 text-center mb-8">
                    <div className="mx-auto h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 mb-4 animate-fade-in">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Welcome back
                    </h1>
                    <p className="text-sm text-slate-500">
                        Enter your credentials to access your account
                    </p>
                </div>

                <div className="bg-white p-8 animate-fade-in delay-100">
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-5">
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
                                <div className="flex items-center justify-between">
                                    <Label className="sr-only" htmlFor="password">
                                        Password
                                    </Label>
                                </div>
                                <Input
                                    id="password"
                                    placeholder="Password"
                                    type="password"
                                    autoCapitalize="none"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    className="h-11 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all rounded-lg"
                                    required
                                />
                                <div className="flex justify-end">
                                    <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">Forgot password?</span>
                                </div>
                            </div>
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-600 flex items-center animate-shake">
                                    <ShieldCheck className="w-4 h-4 mr-2" /> {error}
                                </div>
                            )}
                            <Button disabled={isLoading} className="h-11 text-sm font-bold rounded-lg shadow-sm bg-blue-600 hover:bg-blue-700 text-white border-0 transition-all">
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Sign In
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-slate-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-bold text-blue-600 hover:underline underline-offset-4">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Demo Login Buttons */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-[10px] text-center text-slate-400 mb-4 font-black uppercase tracking-widest flex items-center justify-center gap-2">
                            <span className="h-px w-8 bg-slate-100" />
                            Quick Demo Access
                            <span className="h-px w-8 bg-slate-100" />
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-14 flex flex-col gap-1 text-[10px] font-black border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all rounded-xl shadow-sm group"
                                onClick={() => loginAs('admin')}
                            >
                                <ShieldCheck className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                Admin
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-14 flex flex-col gap-1 text-[10px] font-black border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all rounded-xl shadow-sm group"
                                onClick={() => loginAs('faculty')}
                            >
                                <GraduationCap className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                Faculty
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-14 flex flex-col gap-1 text-[10px] font-black border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all rounded-xl shadow-sm group"
                                onClick={() => loginAs('student')}
                            >
                                <User className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                Student
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
