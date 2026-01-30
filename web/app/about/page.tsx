export default function AboutPage() {
    return (
        <div className="container py-12 md:py-24 space-y-8">
            <div className="max-w-[800px] space-y-4">
                <h1 className="font-bold text-4xl tracking-tight lg:text-5xl">About AFS Academy</h1>
                <p className="text-xl text-muted-foreground">
                    Empowering students with cutting-edge skills for the digital age.
                </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Our Mission</h2>
                    <p className="text-muted-foreground">
                        To provide accessible, high-quality education that bridges the gap between academic learning and industry requirements. We believe in practical, hands-on training that prepares students for real-world challenges.
                    </p>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Our Vision</h2>
                    <p className="text-muted-foreground">
                        To be a global leader in skills training, creating a community of lifelong learners and innovators who drive positive change in the technology landscape.
                    </p>
                </div>
            </div>
        </div>
    )
}
