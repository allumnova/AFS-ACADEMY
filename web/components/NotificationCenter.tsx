"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
    Bell,
    X,
    Check,
    Info,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Trash2,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        fetchNotifications()
    }, [])

    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.isRead).length)
    }, [notifications])

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return
            const res = await axios.get("http://localhost:5000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setNotifications(res.data)
        } catch (error) {
            console.error("Failed to fetch notifications", error)
        }
    }

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem("token")
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
        } catch (error) {
            console.error("Failed to mark as read", error)
        }
    }

    const deleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            const token = localStorage.getItem("token")
            await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setNotifications(notifications.filter(n => n.id !== id))
        } catch (error) {
            console.error("Failed to delete notification", error)
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />
            case 'error': return <XCircle className="h-4 w-4 text-red-500" />
            default: return <Info className="h-4 w-4 text-blue-500" />
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-500 hover:text-primary transition-colors">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] font-bold text-white items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl border-slate-100 shadow-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                    {unreadCount > 0 && <Badge variant="secondary" className="bg-slate-200 text-[10px] font-bold">New</Badge>}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => !n.isRead && markAsRead(n.id)}
                                className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 flex gap-3 ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                            >
                                <div className="mt-1">{getTypeIcon(n.type)}</div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <p className={`text-sm leading-none font-bold ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>
                                            {n.title}
                                        </p>
                                        <button
                                            onClick={(e) => deleteNotification(n.id, e)}
                                            className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-white"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                        {n.message}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center text-slate-400 space-y-2">
                            <Bell className="h-8 w-8 mx-auto opacity-10" />
                            <p className="text-xs">No notifications yet</p>
                        </div>
                    )}
                </div>
                <div className="p-2 border-t border-slate-100">
                    <Button variant="ghost" size="sm" className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary">
                        View All Activity
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
