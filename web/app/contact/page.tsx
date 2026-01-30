import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming you might have this or use standard textarea

export default function ContactPage() {
    return (
        <div className="container py-12 md:py-24 max-w-2xl">
            <div className="mb-8 space-y-4 text-center">
                <h1 className="font-bold text-4xl tracking-tight lg:text-5xl">Contact Us</h1>
                <p className="text-xl text-muted-foreground">
                    Have questions? We'd love to hear from you.
                </p>
            </div>
            <div className="grid gap-6 p-6 border rounded-lg shadow-sm">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                        id="message"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="How can we help?"
                        rows={5}
                    />
                </div>
                <Button className="w-full">Send Message</Button>
            </div>
        </div>
    );
}
