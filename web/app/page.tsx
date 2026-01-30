import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, PlayCircle, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EnrollButton } from "@/components/enroll-button";

async function getCourses() {
  try {
    const res = await fetch("http://localhost:5000/api/courses", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-slate-900 dark:text-slate-50">

      {/* Navbar - Minimalist & Sticky */}{/* Rebuild Trigger */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">AFS Academy</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/faculty" className="hover:text-primary transition-colors">Faculty</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Button asChild className="rounded-full px-6 shadow-md shadow-primary/20">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - High Contrast & Better Layout */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-40 lg:pb-48 bg-slate-50">

          {/* Grid Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-white px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/10">
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-2.5 animate-pulse"></span>
                New Cohort Starting Soon
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl leading-[1.1]">
                  Unlock Your Potential with <span className="text-primary">Expert-Led</span> Learning
                </h1>
                <p className="max-w-[640px] text-lg sm:text-xl text-slate-600 leading-relaxed font-medium">
                  Master in-demand skills in development, design, and business. Join a community of learners and build your future today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 focus:ring-4 focus:ring-primary/20 transition-all" asChild>
                  <Link href="/courses">Explore Courses</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold rounded-full border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-900 transition-all" asChild>
                  <Link href="/about">
                    <PlayCircle className="mr-2 h-5 w-5" /> How it Works
                  </Link>
                </Button>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  Life-time Access
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  Expert Mentors
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  Certificate Included
                </div>
              </div>
            </div>

            {/* Abstract Visual - Refined & Modern */}
            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none perspective-1000">
              <div className="aspect-square rounded-[2.5rem] bg-gradient-to-tr from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-10 flex items-center justify-center relative shadow-2xl shadow-slate-200/50 dark:shadow-none border border-white/50 dark:border-slate-800">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

                <div className="relative z-10 w-full">
                  {/* Main Card */}
                  <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 transform transition-transform hover:scale-[1.02] duration-500">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-primary">
                          <BookOpen className="h-7 w-7" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white">Web Development</div>
                          <div className="text-sm text-slate-500">Masterclass</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">Active</div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Course Progress</span>
                        <span className="font-bold text-slate-900 dark:text-white">78%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[78%] rounded-full"></div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-800">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800"></div>
                        ))}
                        <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-950 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-500">+12k</div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/5">Continue</Button>
                    </div>
                  </div>

                  {/* Floating Element 1 - Top Right */}
                  <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-float delay-100">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Task Completed</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">React Basics</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses - Grid Layout */}
        <section className="container py-24">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Featured Courses</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl">Explore our hand-picked selection of top-rated courses designed to fast-track your career.</p>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5" asChild>
              <Link href="/courses">View All Courses <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.slice(0, 3).map((course: any) => (
                <Card key={course.id} className="group overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {/* Gradient Overlay Placeholder */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 group-hover:scale-105 transition-transform duration-500`} />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold text-slate-900 dark:text-white rounded-full shadow-sm">
                        {course.category || "Development"}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Users className="h-4 w-4" />
                        <span>2.5k Students</span>
                      </div>
                      <div className="font-bold text-lg text-slate-900 dark:text-white">${course.price}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <EnrollButton courseId={course.id} price={course.price} className="w-full rounded-full" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No courses found. Please check back later.
              </div>
            )}
          </div>
        </section>

        {/* Value Proposition - Clean Cards */}
        <section className="bg-slate-50 dark:bg-slate-900/50 py-24">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Why AFS Academy?</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">We focus on providing the best learning experience through technology and expert mentorship.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<BookOpen className="h-6 w-6 text-primary" />}
                title="Structured Learning"
                description="Curriculum designed by experts to ensure a step-by-step learning path."
              />
              <FeatureCard
                icon={<PlayCircle className="h-6 w-6 text-primary" />}
                title="Interactive Classes"
                description="Engage in live sessions with two-way communication and instant doubt solving."
              />
              <FeatureCard
                icon={<GraduationCap className="h-6 w-6 text-primary" />}
                title="Industry Certification"
                description="Earn certificates recognized by top companies upon course completion."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6 text-primary" />}
                title="Peer Community"
                description="Network with fellow learners and grow together in a collaborative environment."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Minimal */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">AFS Academy</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 AFS Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="h-12 w-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 text-primary ring-1 ring-primary/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  )
}
