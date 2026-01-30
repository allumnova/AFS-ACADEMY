export default function StudentDashboardPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">My Learning</h1>

            <div className="rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <h3 className="mt-4 text-lg font-semibold">No courses enrolled</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        You haven't enrolled in any courses yet. Explore our catalog to get started.
                    </p>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Browse Courses
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder for Course Cards */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6 flex flex-col items-center justify-center h-48 bg-muted/50">
                            <span className="text-muted-foreground">Course Preview {i}</span>
                        </div>
                        <div className="p-6 pt-0 mt-4 space-y-2">
                            <h3 className="font-semibold leading-none tracking-tight">Introduction to Web Dev</h3>
                            <p className="text-sm text-muted-foreground">By AFS Faculty</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
