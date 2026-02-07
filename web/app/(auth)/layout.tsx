export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-white">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex bg-slate-900 border-r border-slate-200">
                <div className="absolute inset-0 bg-blue-600/20" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/50" />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="relative z-20 flex items-center text-2xl font-bold tracking-tight">
                    <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3 shadow-lg shadow-blue-900/20">
                        <span className="text-white">A</span>
                    </div>
                    AFS Academy
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-4">
                        <p className="text-xl font-medium leading-relaxed text-slate-200">
                            &ldquo;This platform has completely transformed how I learn. The live sessions and recorded lectures are top-notch.&rdquo;
                        </p>
                        <footer className="text-base font-semibold text-slate-100 flex items-center gap-3">
                            <div className="h-0.5 w-8 bg-blue-500" />
                            Sofia Davis
                        </footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8 flex items-center justify-center bg-white">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
