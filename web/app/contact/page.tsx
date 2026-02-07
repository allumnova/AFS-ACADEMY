import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container relative py-12 md:py-24 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="font-black text-4xl tracking-tight lg:text-5xl text-slate-900">Get in Touch</h1>
                        <p className="text-xl text-slate-500">
                            Have questions? We're here to help you start your journey.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-all">
                            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Email Us</h3>
                                <p className="text-slate-500 mb-2">Our friendly team is here to help.</p>
                                <a href="mailto:support@afsacademy.com" className="text-blue-600 hover:text-blue-700 font-medium">support@afsacademy.com</a>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-all">
                            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Visit Us</h3>
                                <p className="text-slate-500 mb-2">Come say hello at our HQ.</p>
                                <p className="text-slate-900">100 Tech Park, Innovation Blvd<br />Silicon Valley, CA 94025</p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-all">
                            <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Call Us</h3>
                                <p className="text-slate-500 mb-2">Mon-Fri from 8am to 5pm.</p>
                                <p className="text-slate-900">+1 (555) 000-0000</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-8">
                    <form className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-slate-700 font-medium">Name</Label>
                            <Input id="name" placeholder="Your name" className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-500/20 focus:border-blue-500 h-12 rounded-xl" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-500/20 focus:border-blue-500 h-12 rounded-xl" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message" className="text-slate-700 font-medium">Message</Label>
                            <Textarea
                                id="message"
                                className="min-h-[150px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-blue-500/20 focus:border-blue-500 resize-none p-4 rounded-xl"
                                placeholder="How can we help you?"
                            />
                        </div>
                        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 rounded-xl transition-all hover:scale-[1.02]">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
