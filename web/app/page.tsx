import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, PlayCircle, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EnrollButton } from "@/components/enroll-button";

async function getCourses() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
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
    <div className="flex min-h-screen flex-col bg-white font-sans antialiased text-slate-900 dark:text-slate-50">

      {/* Navbar - Premium Glass & Elevated */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-600/20">
              <span className="text-white font-black text-xl tracking-tighter">A</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-slate-950 dark:text-white">AFS<span className="text-indigo-600">.</span></span>
          </div>
          <nav className="hidden lg:flex items-center gap-10 text-sm font-bold tracking-tight text-slate-600 dark:text-slate-400">
            <Link href="/courses" className="hover:text-indigo-600 transition-colors uppercase tracking-[0.1em]">Courses</Link>
            <Link href="/about" className="hover:text-indigo-600 transition-colors uppercase tracking-[0.1em]">About</Link>
            <Link href="/faculty" className="hover:text-indigo-600 transition-colors uppercase tracking-[0.1em]">Faculty</Link>
          </nav>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors">
              Log in
            </Link>
            <Button asChild className="rounded-2xl px-10 h-12 text-sm font-bold uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all bg-indigo-600 text-white border-0">
              <Link href="/register">Join Now</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-40 mesh-gradient">
          <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12 animate-slide-up">
              <div className="inline-flex items-center rounded-full border border-indigo-200/50 bg-indigo-50/50 px-5 py-2 text-xs font-black text-indigo-700 shadow-sm backdrop-blur-sm uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-3 animate-pulse"></span>
                Next Cohort Feb 2026
              </div>

              <div className="space-y-8">
                <h1 className="text-6xl font-black tracking-tighter text-slate-950 lg:text-8xl leading-[1] dark:text-white">
                  Learn to <span className="text-indigo-600">Build</span> the Future.
                </h1>
                <p className="max-w-[580px] text-xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  Join AFS Academy and master the technology of tomorrow with expert-led courses and a community that cares about your growth.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button size="lg" className="h-16 px-10 text-sm font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-600/30 hover:scale-105 transition-all bg-indigo-600 text-white" asChild>
                  <Link href="/courses">Start Learning</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 text-sm font-black uppercase tracking-widest rounded-2xl border-slate-200 bg-white/50 backdrop-blur-sm hover:bg-white hover:text-slate-950 transition-all dark:border-slate-800" asChild>
                  <Link href="/about">
                    <PlayCircle className="mr-3 h-5 w-5" /> View Curiculum
                  </Link>
                </Button>
              </div>

              <div className="pt-10 flex flex-wrap gap-x-10 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                  Lifetime Access
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                  1v1 Mentorship
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  Industry Certs
                </div>
              </div>
            </div>

            {/* Elevated Hero Visual */}
            <div className="relative animate-fade-in delay-200 hidden lg:block">
              <div className="absolute -inset-10 bg-indigo-600/5 blur-[100px] rounded-full"></div>
              <div className="glass-card rounded-[3rem] p-4 p-8 relative z-10 border border-white rotate-1 hover:rotate-0 transition-transform duration-700">
                <div className="aspect-[4/3] bg-slate-900 rounded-[2rem] overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/50 to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center group">
                    <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/50 group-hover:scale-110 transition-transform cursor-pointer">
                      <PlayCircle className="h-10 w-10" />
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 space-y-3">
                    <div className="h-1.5 w-full bg-white/10 rounded-full">
                      <div className="h-full bg-indigo-600 w-[65%] rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest">
                      <span>Module 04: Advanced API Integration</span>
                      <span>65% Complete</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-3xl animate-float shadow-2xl border border-white">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-950 dark:text-white">12,450+</div>
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Learners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses - Hyper Premium Grid */}
        <section className="container py-32">
          <div className="flex flex-col items-center text-center space-y-4 mb-20 animate-slide-up">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">The Catalog</span>
            <h2 className="text-4xl font-black tracking-tighter text-slate-950 sm:text-5xl dark:text-white">Master In-Demand Skills</h2>
            <p className="text-slate-500 max-w-lg font-medium">Curated learning paths designed to take you from beginner to professional architect.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.length > 0 ? (
              courses.slice(0, 3).map((course: any) => (
                <Card key={course.id} className="group overflow-hidden rounded-[2.5rem] border-0 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_-16px_rgba(124,58,237,0.12)] hover:-translate-y-4 transition-all duration-700">
                  <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-rose-600/5 group-hover:scale-110 transition-transform duration-1000`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MonitorPlay className="h-12 w-12 text-indigo-100 opacity-20" />
                    </div>
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="px-4 py-2 bg-white/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-indigo-700 rounded-xl shadow-sm border border-white">
                        {course.category || "General"}
                      </span>
                      <span className="px-4 py-2 bg-slate-950 text-[9px] font-black uppercase tracking-widest text-white rounded-xl shadow-sm">
                        {course.level}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-10 space-y-6">
                    <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{course.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium">{course.description}</p>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {[1, 2, 3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 shadow-sm overflow-hidden"></div>)}
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">3k Joined</span>
                      </div>
                      <div className="text-3xl font-black text-indigo-600 tracking-tighter">₹{course.price}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-10 pt-0">
                    <EnrollButton courseId={course.id} price={course.price} className="w-full rounded-2xl h-14 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 bg-indigo-600 text-white" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass-card rounded-[3rem] border-dashed border-2 border-indigo-100">
                <p className="text-slate-400 font-bold uppercase tracking-widest">New Courses Coming Soon</p>
              </div>
            )}
          </div>
        </section>

        {/* Value Prop - Minimalist Icon Cards */}
        <section className="bg-slate-50 py-32 rounded-[4rem] mx-4 lg:mx-10 my-10">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-24">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-4 block">The Advantage</span>
              <h2 className="text-4xl font-black tracking-tighter text-slate-950 mb-6 sm:text-5xl dark:text-white">Why Learn at AFS?</h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">Built by industry veterans to solve the gap between academic learning and real-world engineering.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <FeatureCard
                icon={<BookOpen className="h-7 w-7" />}
                title="Curated Paths"
                color="indigo"
                description="Forget tutorial hell. We provide a step-by-step roadmap to mastery."
              />
              <FeatureCard
                icon={<PlayCircle className="h-7 w-7" />}
                title="Live Sessions"
                color="rose"
                description="Interactive classes where you code along with elite instructors."
              />
              <FeatureCard
                icon={<GraduationCap className="h-7 w-7" />}
                title="Elite Content"
                color="emerald"
                description="Production-grade knowledge focusing on scalability and performance."
              />
              <FeatureCard
                icon={<Users className="h-7 w-7" />}
                title="The Circle"
                color="amber"
                description="Join an exclusive Discord community for networking and job referrals."
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 text-center container">
          <div className="glass-card rounded-[4rem] p-20 space-y-10 animate-fade-in border-white bg-white/80 shadow-[0_80px_100px_-20px_rgba(124,58,237,0.15)]">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1] text-slate-950 dark:text-white">Ready to <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-8">Level Up</span>?</h2>
            <p className="max-w-xl mx-auto text-xl text-slate-500 font-medium">Join 10,000+ students on their journey to becoming top 1% engineers.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Button size="lg" className="h-16 px-12 rounded-2xl text-xs font-black uppercase tracking-widest bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30">Get Started Now</Button>
              <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl text-xs font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50">Browse Catalog</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 py-20 bg-white">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <span className="font-extrabold text-xl tracking-tighter text-slate-900">AFS Academy<span className="text-indigo-600">.</span></span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Contact</Link>
          </div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">© 2026 AFS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-600/5 text-indigo-600 ring-indigo-600/10",
    rose: "bg-rose-600/5 text-rose-600 ring-rose-600/10",
    emerald: "bg-emerald-600/5 text-emerald-600 ring-emerald-600/10",
    amber: "bg-amber-600/5 text-amber-600 ring-amber-600/10",
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
      <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center mb-10 ring-1", colors[color])}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-950 mb-4 dark:text-white leading-tight uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  )
}
