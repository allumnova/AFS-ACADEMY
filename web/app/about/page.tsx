export default function AboutPage() {
    return (
        <div className="container relative py-12 md:py-24 space-y-12">

            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold uppercase tracking-wider mb-4 animate-fade-in">
                    Our Story
                </div>
                <h1 className="font-black text-5xl md:text-7xl tracking-tight text-slate-900 animate-slide-up">
                    Forging the Future <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">of Education</span>
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    AFS Academy is a premier digital learning ecosystem designed to empower the next generation of innovators directly from the browser.
                </p>
            </div>

            {/* Mission & Vision Grid */}
            <div className="grid gap-8 md:grid-cols-2 pt-12">
                <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-8 md:p-12 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 rounded-[2rem]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <svg viewBox="0 0 24 24" fill="none" className="w-64 h-64 stroke-slate-900" strokeWidth="0.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Our Mission</h2>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            To bridge the critical gap between academic theory and industry reality. We deliver high-velocity, practical training that equips students with the exact toolsets needed to tackle modern technical challenges.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 text-white shadow-xl p-8 md:p-12 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 rounded-[2rem]">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <svg viewBox="0 0 24 24" fill="none" className="w-64 h-64 stroke-white" strokeWidth="0.5">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white mb-6">Our Vision</h2>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            To become the global standard for digital skill acquisition, fostering a borderless community of lifelong learners who drive progress and define the technology landscape of tomorrow.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
                {[
                    { label: "Students", value: "10k+" },
                    { label: "Instructors", value: "50+" },
                    { label: "Courses", value: "100+" },
                    { label: "Success Rate", value: "95%" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 shadow-sm p-6 text-center rounded-2xl hover:shadow-md transition-shadow">
                        <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
