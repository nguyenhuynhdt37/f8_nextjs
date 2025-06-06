'use client';

import React from 'react';
import { motion } from '@/lib/motion';
import { FaFire, FaArrowRight } from 'react-icons/fa';

interface FireBannerProps {
    title: string;
    description?: string;
    ctaText?: string;
    onCtaClick?: () => void;
    className?: string;
    backgroundImage?: string;
}

const FireBanner: React.FC<FireBannerProps> = ({
    title,
    description,
    ctaText = 'Xem ngay',
    onCtaClick,
    className = '',
    backgroundImage
}) => {
    return (
        <motion.div
            className={`relative overflow-hidden rounded-2xl p-8 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 overflow-hidden"
                style={backgroundImage ? {
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                } : {}}
            >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-red-600/90" />

                {/* Animated fire particles */}
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            bottom: `-30px`,
                        }}
                        animate={{
                            y: [0, -100 - (Math.random() * 100)],
                            opacity: [0, 0.3, 0],
                            rotate: [0, Math.random() * 360]
                        }}
                        transition={{
                            duration: 2 + (Math.random() * 3),
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    >
                        <FaFire className="text-4xl text-yellow-300" />
                    </motion.div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl">
                <motion.h2
                    className="text-3xl font-bold text-white mb-4 flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.span
                        animate={{
                            rotate: [-5, 5, -5],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity
                        }}
                        className="mr-2"
                    >
                        <FaFire className="text-yellow-300 text-3xl" />
                    </motion.span>
                    {title}
                </motion.h2>

                {description && (
                    <motion.p
                        className="text-white/90 text-lg mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {description}
                    </motion.p>
                )}

                {ctaText && onCtaClick && (
                    <motion.button
                        className="bg-white text-orange-600 font-bold py-3 px-6 rounded-lg flex items-center shadow-lg hover:bg-orange-50 transition-colors"
                        onClick={onCtaClick}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="mr-2">{ctaText}</span>
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity
                            }}
                        >
                            <FaArrowRight />
                        </motion.span>
                    </motion.button>
                )}
            </div>

            {/* Decorative elements */}
            <motion.div
                className="absolute bottom-0 right-0 h-40 w-40"
                animate={{
                    scale: [1, 1.05, 1],
                    y: [0, -5, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            >
                <div className="absolute bottom-0 right-0 h-40 w-40 bg-gradient-to-tl from-yellow-500/20 to-orange-600/0 blur-xl rounded-full" />
            </motion.div>
        </motion.div>
    );
};

export default FireBanner;
