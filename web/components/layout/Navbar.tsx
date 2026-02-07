"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={cn(
            "fixed top-0 z-50 w-full transition-all duration-500 border-b border-transparent",
            scrolled ? "bg-white/80 backdrop-blur-xl border-slate-100 shadow-sm" : "bg-transparent"
        )}>
            <div className="container px-4 mx-auto flex h-20 items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-white font-black text-xl tracking-tighter">A</span>
                    </div>
                    <span className="font-black text-xl tracking-tighter text-slate-900">
                        AFS Academy<span className="text-blue-600">.</span>
                    </span>
                </div>

                <nav className="hidden lg:flex items-center gap-8 text-sm font-bold tracking-widest text-slate-500">
                    <Link href="/courses" className="hover:text-blue-600 transition-colors uppercase">Courses</Link>
                    <Link href="/about" className="hover:text-blue-600 transition-colors uppercase">About</Link>
                    <Link href="/faculty" className="hover:text-blue-600 transition-colors uppercase">Faculty</Link>
                </nav>

                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                        Log in
                    </Link>
                    <Button asChild className="rounded-xl px-8 h-11 text-xs font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/20 border-0">
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
