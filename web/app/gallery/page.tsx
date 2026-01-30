"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Image as ImageIcon,
    Video,
    Filter,
    Maximize2,
    Play,
    Loader2
} from "lucide-react"

export default function MediaGalleryPage() {
    const [media, setMedia] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")

    const categories = ["all", "events", "campus", "workshop", "achievements"]

    useEffect(() => {
        fetchMedia()
    }, [filter, typeFilter])

    const fetchMedia = async () => {
        setLoading(true)
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/media?`
            if (filter !== "all") url += `category=${filter}&`
            if (typeFilter !== "all") url += `type=${typeFilter}`

            const res = await axios.get(url)
            setMedia(res.data)
        } catch (error) {
            console.error("Failed to fetch media", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Life at AFS Academy
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Explore our journey through captured moments, workshops, and campus highlights.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={filter === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(cat)}
                            className="capitalize rounded-full"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={typeFilter === "all" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setTypeFilter("all")}
                    >
                        All Types
                    </Button>
                    <Button
                        variant={typeFilter === "image" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setTypeFilter("image")}
                    >
                        <ImageIcon className="h-4 w-4 mr-2" /> Photos
                    </Button>
                    <Button
                        variant={typeFilter === "video" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setTypeFilter("video")}
                    >
                        <Video className="h-4 w-4 mr-2" /> Videos
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="animate-spin text-primary h-8 w-8" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {media.map((item) => (
                        <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
                            <CardContent className="p-0 relative aspect-[4/5]">
                                {item.type === 'video' ? (
                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                        <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer">
                                            <Play className="h-8 w-8 fill-white text-white" />
                                        </div>
                                        <Badge className="absolute top-4 left-4 bg-black/50 backdrop-blur-md">Video</Badge>
                                    </div>
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <Badge className="w-fit mb-2 bg-indigo-500 hover:bg-indigo-600 transition-colors capitalize">
                                        {item.category}
                                    </Badge>
                                    <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-white/70 text-sm line-clamp-2">{item.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {media.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-400">
                            <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">No media found in this category.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
