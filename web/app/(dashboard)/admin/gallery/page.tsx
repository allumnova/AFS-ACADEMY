"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Image as ImageIcon,
    Video,
    Plus,
    Trash2,
    Loader2,
    ExternalLink,
    Play
} from "lucide-react"

export default function AdminGalleryPage() {
    const [media, setMedia] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const [newMedia, setNewMedia] = useState({
        title: "",
        description: "",
        type: "image",
        url: "",
        category: "general"
    })

    useEffect(() => {
        fetchMedia()
    }, [])

    const fetchMedia = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/media`)
            setMedia(res.data)
        } catch (error) {
            console.error("Failed to fetch media", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploading(true)
        try {
            const token = localStorage.getItem("token")
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/media`, newMedia, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setNewMedia({ title: "", description: "", type: "image", url: "", category: "general" })
            setShowForm(false)
            fetchMedia()
            alert("Media added successfully!")
        } catch (error) {
            console.error("Upload failed", error)
            alert("Failed to add media.")
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this media item?")) return
        try {
            const token = localStorage.getItem("token")
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/media/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchMedia()
        } catch (error) {
            console.error("Delete failed", error)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Gallery Moderation</h1>
                    <p className="text-slate-500 font-medium">Manage platform images and videos.</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-600/20 font-bold rounded-xl h-12 px-6"
                >
                    {showForm ? "Cancel" : <><Plus className="h-4 w-4 mr-2" /> Add Media</>}
                </Button>
            </div>

            {showForm && (
                <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden animate-slide-up bg-white">
                    <CardContent className="p-8">
                        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media Title</Label>
                                    <Input
                                        required
                                        placeholder="e.g. Graduation Ceremony 2024"
                                        value={newMedia.title}
                                        onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type & Category</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <select
                                            className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                                            value={newMedia.type}
                                            onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value })}
                                        >
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                        <Input
                                            placeholder="Category (e.g. events)"
                                            value={newMedia.category}
                                            onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                                            className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media URL</Label>
                                    <Input
                                        required
                                        placeholder="https://example.com/image.jpg"
                                        value={newMedia.url}
                                        onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                                        className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
                                    <Textarea
                                        placeholder="Brief description of the media..."
                                        className="min-h-[160px] bg-slate-50 border-slate-200 rounded-xl resize-none"
                                        value={newMedia.description}
                                        onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                                    />
                                </div>
                                <Button
                                    disabled={uploading}
                                    className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black rounded-xl shadow-lg transition-all"
                                >
                                    {uploading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Publish to Gallery"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {media.map((item) => (
                    <Card key={item.id} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
                        <CardContent className="p-0 relative aspect-[4/5]">
                            {item.type === 'video' ? (
                                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                    <Play className="h-10 w-10 text-white/20" />
                                </div>
                            ) : (
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                <div className="flex justify-between items-end">
                                    <div className="flex-1 min-w-0">
                                        <Badge className="mb-2 bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px] uppercase">{item.category}</Badge>
                                        <h3 className="text-white font-bold text-sm truncate">{item.title}</h3>
                                    </div>
                                    <div className="flex gap-1">
                                        <a href={item.url} target="_blank" rel="noreferrer">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </a>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(item.id)}
                                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {!loading && media.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-10" />
                        <p className="font-medium">No media uploaded yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
