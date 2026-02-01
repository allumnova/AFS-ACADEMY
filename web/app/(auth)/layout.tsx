export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-white dark:bg-slate-950">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex mesh-gradient overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-20 flex items-center text-2xl font-bold tracking-tight">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mr-3 border border-white/30 shadow-xl">
                        <span className="text-white">A</span>
                    </div>
                    AFS Academy
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-medium leading-relaxed italic">
                            &ldquo;This platform has completely transformed how I learn. The live sessions and recorded lectures are top-notch.&rdquo;
                        </p>
                        <footer className="text-lg font-semibold flex items-center gap-3">
                            <div className="h-0.5 w-10 bg-white/50" />
                            Sofia Davis
                        </footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
