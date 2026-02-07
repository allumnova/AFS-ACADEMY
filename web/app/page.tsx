"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, PlayCircle, Users, ArrowRight, CheckCircle2, ChevronRight, Code2, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EnrollButton } from "@/components/enroll-button";
import { Navbar } from "@/components/layout/Navbar";
import { MeshGradient } from "@/components/visuals/MeshGradient";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Course {
  id: string
  title: string
  description: string
  category: string
  price: string
  isDemo?: boolean
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen flex-col selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden bg-slate-50/50">
      <Navbar />

      <main className="flex-1 relative z-10">
        {/* Hero Section - Clean & Realistic */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

          <div className="container px-4 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Hero Text */}
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="space-y-8 text-center lg:text-left"
              >
                <motion.div variants={fadeIn} className="space-y-6">
                  <div className="inline-flex items-center rounded-full bg-blue-100/50 border border-blue-200 px-4 py-1.5 text-xs font-semibold text-blue-700 tracking-wide">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Admissions Open {new Date().getFullYear()}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                    Master Skills for a <br />
                    <span className="text-blue-600">Digital World.</span>
                  </h1>
                  <p className="max-w-xl mx-auto lg:mx-0 text-lg text-slate-600 leading-relaxed">
                    Practical, project-based learning for the modern engineer. Join AFS Academy to build your portfolio with guidance from industry experts.
                  </p>
                </motion.div>

                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="h-12 px-8 text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5" asChild>
                    <Link href="/courses">Start Learning</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-all" asChild>
                    <Link href="/about">How it works</Link>
                  </Button>
                </motion.div>

                <motion.div variants={fadeIn} className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-slate-400 grayscale opacity-70">
                  {/* Logos using simple text for cleanliness/realism if no SVGs available */}
                  <span className="font-bold text-lg">Google</span>
                  <span className="font-bold text-lg">Microsoft</span>
                  <span className="font-bold text-lg">Amazon</span>
                  <span className="font-bold text-lg">Meta</span>
                </motion.div>
              </motion.div>

              {/* Hero Visual - Realistic Dashboard Preview */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="hidden lg:block relative"
              >
                {/* Abstract 'Device' Wrapper */}
                <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden ring-1 ring-slate-900/5 transform rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                  {/* Header Bar */}
                  <div className="h-10 border-b border-slate-100 bg-slate-50 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="mx-auto h-5 w-40 bg-slate-200/50 rounded-md" />
                  </div>

                  {/* Mock Content matching Student Dashboard */}
                  <div className="p-8 bg-slate-50/30">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <div className="h-6 w-48 bg-slate-900/10 rounded-md mb-2" />
                        <div className="h-4 w-32 bg-slate-900/5 rounded-md" />
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="h-8 w-8 bg-blue-50 rounded-lg mb-3" />
                        <div className="h-6 w-12 bg-slate-900/10 rounded-md mb-1" />
                        <div className="h-3 w-20 bg-slate-900/5 rounded-md" />
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="h-8 w-8 bg-emerald-50 rounded-lg mb-3" />
                        <div className="h-6 w-12 bg-slate-900/10 rounded-md mb-1" />
                        <div className="h-3 w-20 bg-slate-900/5 rounded-md" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="h-4 w-24 bg-slate-900/10 rounded-md" />
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                        <div className="h-20 w-32 bg-slate-100 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-5 w-3/4 bg-slate-900/10 rounded-md" />
                          <div className="h-3 w-1/2 bg-slate-900/5 rounded-md" />
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
                            <div className="h-full w-2/3 bg-blue-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-24 bg-white relative">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col items-center mb-16 space-y-4 text-center">
              <span className="text-blue-600 font-bold tracking-wide uppercase text-xs">Curriculum</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Expert-Led Learning Paths</h2>
              <p className="text-slate-500 max-w-2xl text-lg">Comprehensive courses designed to take you from beginner to professional.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[400px] rounded-2xl bg-slate-100 animate-pulse" />
                ))
              ) : courses.length > 0 ? (
                courses.slice(0, 3).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <div className="col-span-full py-24 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                  <div className="mx-auto h-12 w-12 text-slate-300 mb-3"><BookOpen className="h-full w-full" /></div>
                  <p className="text-slate-500 font-medium">Courses launching soon...</p>
                </div>
              )}

              {/* Realistic Fallback Card if needed */}
              {courses.length === 0 && !loading && (
                <CourseCard course={{
                  id: "demo",
                  title: "Fullstack Systems Architect",
                  description: "Master modern web development with a focus on scalable systems.",
                  category: "Engineering",
                  price: "4,999",
                  isDemo: true
                }} />
              )}
            </div>
          </div>
        </section>

        {/* Features / Value Props - Clean Grid */}
        <section className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="container px-4 mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
              <FeatureItem
                icon={<BookOpen className="h-6 w-6" />}
                title="Structured Learning"
                desc="Step-by-step paths that guide you through complex topics logicallly."
              />
              <FeatureItem
                icon={<PlayCircle className="h-6 w-6" />}
                title="Project Based"
                desc="Build real applications that you can add to your portfolio."
              />
              <FeatureItem
                icon={<Trophy className="h-6 w-6" />}
                title="Verified Certificates"
                desc="Earn credentials that showcase your skills to future employers."
              />
              <FeatureItem
                icon={<Users className="h-6 w-6" />}
                title="Community Support"
                desc="Join a network of peers and mentors to help you succeed."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Clean */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold">A</div>
              <span className="font-bold text-slate-900">AFS Academy</span>
            </div>
            <div className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} AFS Global. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden flex flex-col h-full border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[16/9] relative bg-slate-100 overflow-hidden">
        {/* Abstract pattern placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-500">
            <Code2 className="h-8 w-8" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wide text-slate-600 shadow-sm">
            {course.category || "Development"}
          </span>
        </div>
      </div>

      <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
            {course.description}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <div className="flex -space-x-2">
              <div className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white" />
              <div className="h-6 w-6 rounded-full bg-slate-300 border-2 border-white" />
            </div>
            <span>120+ Enrolled</span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            <span className="text-xs font-medium text-slate-400 mr-1">INR</span>{course.price}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {course.isDemo ? (
          <Button className="w-full h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold transition-all shadow-md active:scale-95">Enroll Now</Button>
        ) : (
          <EnrollButton courseId={course.id} price={course.price} className="w-full h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold transition-all shadow-md active:scale-95" />
        )}
      </CardFooter>
    </motion.div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="space-y-4 group p-6 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100"
    >
      <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto lg:mx-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}
