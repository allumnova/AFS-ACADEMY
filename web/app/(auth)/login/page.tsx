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
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 mb-4 animate-fade-in">
                        <span className="text-white font-black text-2xl">A</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Welcome back
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Enter your credentials to access your account
                    </p>
                </div>

                <div className="glass-card rounded-[2rem] p-8 shadow-2xl border-white/50 animate-fade-in delay-100">
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label className="font-bold text-[10px] uppercase tracking-widest text-slate-500 ml-1" htmlFor="email">
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
                                    className="h-12 bg-white/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold text-[10px] uppercase tracking-widest text-slate-500 ml-1" htmlFor="password">
                                        Password
                                    </Label>
                                    <span className="text-xs font-bold text-primary hover:underline cursor-pointer">Forgot?</span>
                                </div>
                                <Input
                                    id="password"
                                    placeholder="••••••••"
                                    type="password"
                                    autoCapitalize="none"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    className="h-12 bg-white/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                                    required
                                />
                            </div>
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-600 flex items-center animate-shake">
                                    <ShieldCheck className="w-4 h-4 mr-2" /> {error}
                                </div>
                            )}
                            <Button disabled={isLoading} className="h-12 md:h-14 text-base font-bold rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all">
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : null}
                                Sign In
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-slate-500 font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-bold text-primary hover:underline underline-offset-4">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Demo Login Buttons */}
                    <div className="mt-10 pt-8 border-t border-slate-200/60">
                        <p className="text-[10px] text-center text-slate-400 mb-5 font-black uppercase tracking-[0.2em]">
                            Quick Demo Access
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 text-[10px] font-black uppercase tracking-wider border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all rounded-lg"
                                onClick={() => loginAs('admin')}
                            >
                                Admin
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 text-[10px] font-black uppercase tracking-wider border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all rounded-lg"
                                onClick={() => loginAs('faculty')}
                            >
                                Faculty
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 text-[10px] font-black uppercase tracking-wider border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all rounded-lg"
                                onClick={() => loginAs('student')}
                            >
                                Student
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
