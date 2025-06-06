'use client';
import React from 'react';
import { motion } from '@/lib/motion';

interface GlowEffectProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

const GlowEffect = ({
    children,
    className = "",
    glowColor = "rgba(0, 120, 255, 0.4)"
}: GlowEffectProps) => {
    return (
        <div className={`relative ${className}`}>
            <motion.div
                className="absolute inset-0 rounded-inherit z-0 opacity-0"
                style={{ backgroundColor: glowColor, filter: 'blur(25px)' }}
                animate={{
                    opacity: [0, 0.5, 0],
                    scale: [0.9, 1.05, 0.9]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                }}
            />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default GlowEffect;
