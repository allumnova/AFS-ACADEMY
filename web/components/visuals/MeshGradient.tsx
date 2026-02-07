"use client";

import { motion } from "framer-motion";

export const MeshGradient = () => {
    return (
        <div className="fixed inset-0 -z-20 overflow-hidden bg-white">
            {/* Primary Fluid Gradients - Lighter Tones */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/40 blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -40, 0],
                    y: [0, 60, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-50/40 blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, 30, 0],
                    y: [0, 40, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-50/40 blur-[120px]"
            />

            {/* Subtle Noise / Texture overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-multiply pointer-events-none" />
        </div>
    );
};
