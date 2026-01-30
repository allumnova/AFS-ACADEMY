"use client"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/sidebar" // Reuse existing Sidebar content

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="md:hidden pr-4">
                    <Menu />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white dark:bg-slate-900 border-none w-72">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <Sidebar className="block border-none" />
            </SheetContent>
        </Sheet>
    )
}
