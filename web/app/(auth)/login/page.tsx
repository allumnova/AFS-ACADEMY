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
import { ShieldCheck, GraduationCap, User } from "lucide-react"

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
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });

            // Save token (in real app use standard cookie/storage)
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Redirect based on role (simple check for now)
            if (response.data.user.role === 'admin') {
                router.push("/admin");
            } else {
                router.push("/dashboard"); // Student/Faculty dashboard
            }

        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="flex flex-col space-y-2 text-center mb-6">
                <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                    <span className="text-white font-bold text-2xl">A</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Welcome back
                </h1>
                <p className="text-sm text-slate-500">
                    Enter your credentials to access your account
                </p>
            </div>
            <div className={cn("grid gap-6")}>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label className="font-medium text-slate-600" htmlFor="email">
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
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label className="font-medium text-slate-600" htmlFor="password">
                                    Password
                                </Label>
                                <span className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</span>
                            </div>
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="current-password"
                                disabled={isLoading}
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                required
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center">
                                <ShieldCheck className="w-4 h-4 mr-2" /> {error}
                            </div>
                        )}
                        <Button disabled={isLoading} className="h-11 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                            {isLoading && (
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            )}
                            Sign In
                        </Button>
                    </div>
                </form>
            </div>

            <div className="mt-8 text-center text-sm">
                <p className="text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-semibold text-primary hover:underline underline-offset-4">
                        Sign Up
                    </Link>
                </p>
            </div>

            {/* Demo Login Buttons */}
            <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-xs text-center text-slate-400 mb-4 font-semibold uppercase tracking-wider">
                    Quick Demo Access
                </p>
                <div className="grid grid-cols-3 gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs border-indigo-100 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 transition-colors"
                        onClick={async () => {
                            try {
                                setIsLoading(true);
                                const response = await axios.post("http://localhost:5000/api/auth/login", {
                                    email: 'admin@afs.com',
                                    password: 'password123'
                                });
                                localStorage.setItem("token", response.data.token);
                                localStorage.setItem("user", JSON.stringify(response.data.user));
                                router.push("/admin");
                            } catch (e) { setError("Demo Login Failed"); setIsLoading(false); }
                        }}
                    >
                        Admin
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs border-teal-100 bg-teal-50/50 text-teal-700 hover:bg-teal-100 hover:border-teal-200 transition-colors"
                        onClick={async () => {
                            try {
                                setIsLoading(true);
                                const response = await axios.post("http://localhost:5000/api/auth/login", {
                                    email: 'faculty@afs.com',
                                    password: 'password123'
                                });
                                localStorage.setItem("token", response.data.token);
                                localStorage.setItem("user", JSON.stringify(response.data.user));
                                router.push("/dashboard");
                            } catch (e) { setError("Demo Login Failed"); setIsLoading(false); }
                        }}
                    >
                        Faculty
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs border-orange-100 bg-orange-50/50 text-orange-700 hover:bg-orange-100 hover:border-orange-200 transition-colors"
                        onClick={async () => {
                            try {
                                setIsLoading(true);
                                const response = await axios.post("http://localhost:5000/api/auth/login", {
                                    email: 'student@afs.com',
                                    password: 'password123'
                                });
                                localStorage.setItem("token", response.data.token);
                                localStorage.setItem("user", JSON.stringify(response.data.user));
                                router.push("/dashboard");
                            } catch (e) { setError("Demo Login Failed"); setIsLoading(false); }
                        }}
                    >
                        Student
                    </Button>
                </div>
            </div>
        </>
    )
}
