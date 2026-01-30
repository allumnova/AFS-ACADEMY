import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EnrollButton } from "@/components/enroll-button"

async function getCourses() {
    try {
        const res = await fetch("http://localhost:5000/api/courses", {
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
        <div className="container py-12 md:py-24">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8 mb-8">
                <div className="flex-1 space-y-4">
                    <h1 className="inline-block font-bold text-4xl tracking-tight lg:text-5xl">
                        All Courses
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Explore our comprehensive catalog of courses designed to help you master new skills.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.length > 0 ? (
                    courses.map((course: any) => (
                        <Card key={course.id} className="flex flex-col">
                            <CardHeader className="p-0">
                                <div className="aspect-video relative bg-muted rounded-t-lg overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                                        <span className="text-xs uppercase font-semibold">Course Preview</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-6 pt-4 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                                        {course.category || "Development"}
                                    </span>
                                    <span className="text-xs text-muted-foreground capitalize">{course.level}</span>
                                </div>
                                <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {course.description}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 flex items-center justify-between">
                                <div className="font-bold text-lg">${course.price}</div>
                                <EnrollButton courseId={course.id} price={course.price} size="sm" className="gap-2" />
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No courses found.
                    </div>
                )}
            </div>
        </div>
    );
}
