import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { EnrollButton } from "@/components/enroll-button"

export const dynamic = 'force-dynamic'

async function getCourses() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
            cache: "no-store",
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <div className="container relative py-12 md:py-24">

            <div className="flex flex-col items-center text-center gap-4 mb-16 max-w-2xl mx-auto">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold uppercase tracking-wider mb-2 animate-fade-in">
                    Catalog
                </div>
                <h1 className="font-black text-4xl tracking-tight lg:text-6xl text-slate-900">
                    Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Curriculum</span>
                </h1>
                <p className="text-xl text-slate-500">
                    Master the skills that matter. From foundational coding to advanced architecture, we have a path for you.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {courses.length > 0 ? (
                    courses.map((course: any) => (
                        <div key={course.id} className="group relative">
                            <Card className="relative flex flex-col h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardHeader className="p-0">
                                    <div className="aspect-video relative overflow-hidden bg-slate-100 flex items-center justify-center">
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-200 font-black text-6xl uppercase tracking-tighter">
                                            {course.title.substring(0, 2)}
                                        </div>
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                                                {course.category || "Development"}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 p-8 space-y-4">
                                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase tracking-widest">
                                        <div className="flex items-center gap-1">
                                            <Zap className="h-3 w-3 text-amber-500" />
                                            {course.level || "Beginner"}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-blue-500" />
                                            Self-Paced
                                        </div>
                                    </div>

                                    <CardTitle className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                                        {course.title}
                                    </CardTitle>

                                    <CardDescription className="text-slate-500 line-clamp-3 leading-relaxed">
                                        {course.description}
                                    </CardDescription>
                                </CardContent>
                                <CardFooter className="p-8 pt-0 flex items-center justify-between mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Price</span>
                                        <div className="text-2xl font-black text-slate-900">₹{course.price}</div>
                                    </div>
                                    <EnrollButton
                                        courseId={course.id}
                                        price={course.price}
                                        size="lg"
                                        className="rounded-xl px-6 font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10"
                                    />
                                </CardFooter>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50">
                        <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                            <Sparkles className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Courses Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            We are currently updating our curriculum. Check back soon for new premium content.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
