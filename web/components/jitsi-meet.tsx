"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface JitsiMeetProps {
    roomName: string
    displayName: string
    email?: string
    onApiReady?: (api: any) => void
}

export default function JitsiMeet({ roomName, displayName, email, onApiReady }: JitsiMeetProps) {
    const jitsiContainerRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadJitsiScript = () => {
            if (window.JitsiMeetExternalAPI) {
                initJitsi()
                return
            }

            const script = document.createElement("script")
            script.src = "https://meet.jit.si/external_api.js"
            script.async = true
            script.onload = () => initJitsi()
            document.body.appendChild(script)
        }

        const initJitsi = () => {
            if (!jitsiContainerRef.current) return

            const domain = "meet.jit.si"
            const options = {
                roomName: roomName,
                width: "100%",
                height: "100%",
                parentNode: jitsiContainerRef.current,
                userInfo: {
                    displayName: displayName,
                    email: email
                },
                configOverwrite: {
                    startWithAudioMuted: true,
                    disableDeepLinking: true,
                },
                interfaceConfigOverwrite: {
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    TOOLBAR_BUTTONS: [
                        "microphone", "camera", "closedcaptions", "desktop", "fullscreen",
                        "fodeviceselection", "hangup", "profile", "chat", "recording",
                        "livestreaming", "etherpad", "sharedvideo", "settings", "raisehand",
                        "videoquality", "filmstrip", "invite", "feedback", "stats", "shortcuts",
                        "tileview", "videobackgroundblur", "download", "help", "mute-everyone",
                        "security"
                    ],
                },
            }

            try {
                // @ts-ignore
                const api = new window.JitsiMeetExternalAPI(domain, options)

                api.addEventListener("videoConferenceJoined", () => {
                    setLoading(false)
                })

                if (onApiReady) {
                    onApiReady(api)
                }
            } catch (error) {
                console.error("Failed to load Jitsi API", error)
                setLoading(false)
            }
        }

        loadJitsiScript()

        return () => {
            if (jitsiContainerRef.current) {
                jitsiContainerRef.current.innerHTML = ""
            }
        }
    }, [roomName, displayName, email])

    return (
        <div className="relative w-full h-[600px] bg-slate-900 rounded-lg overflow-hidden">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    <Loader2 className="h-10 w-10 animate-spin" />
                    <span className="ml-2">Connecting to Live Class...</span>
                </div>
            )}
            <div ref={jitsiContainerRef} className="w-full h-full" />
        </div>
    )
}

// Add type definition for window
declare global {
    interface Window {
        JitsiMeetExternalAPI: any
    }
}
