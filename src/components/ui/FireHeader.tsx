'use client';

import React from 'react';
import { FaFire } from 'react-icons/fa';
import { motion } from '@/lib/motion';
import { useFireContext } from './FireProvider';

interface FireHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
    intensity?: 'low' | 'medium' | 'high';
}

const FireHeader: React.FC<FireHeaderProps> = ({
    title,
    subtitle,
    className = '',
    intensity = 'medium'
}) => {
    const { isFireEnabled } = useFireContext();

    const config = {
        low: {
            flameCount: 2,
            duration: 3,
            scale: [1, 1.05, 1]
        },
        medium: {
            flameCount: 3,
            duration: 2,
            scale: [1, 1.1, 1]
        },
        high: {
            flameCount: 4,
            duration: 1.5,
            scale: [1, 1.15, 1]
        }
    };

    const { flameCount, duration, scale } = config[intensity];

    if (!isFireEnabled) {
        return (
            <div className={`relative ${className}`}>
                <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
                {subtitle && (
                    <p className="text-gray-600 mt-3 text-lg max-w-3xl">
                        {subtitle}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div className="flex items-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold relative">
                    {/* Animated Text */}
                    {title.split('').map((char, index) => (
                        <motion.span
                            key={index}
                            className="inline-block"
                            animate={{
                                y: [0, -3, 0],
                                color: intensity === 'high' ? ['#000', '#F97316', '#000'] : undefined
                            }}
                            transition={{
                                y: {
                                    duration: duration * 0.8,
                                    repeat: Infinity,
                                    delay: index * 0.05
                                },
                                color: {
                                    duration: duration,
                                    repeat: Infinity,
                                    delay: index * 0.05
                                }
                            }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                    ))}

                    {/* Top Fire */}
                    <motion.div
                        className="absolute -top-6 -left-6"
                        animate={{
                            rotate: [-10, 10, -10],
                            y: [0, -5, 0]
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <FaFire className="text-2xl text-orange-500" />
                    </motion.div>

                    {/* Bottom Fire */}
                    <motion.div
                        className="absolute -bottom-1 -right-6"
                        animate={{
                            rotate: [10, -10, 10],
                            y: [0, -3, 0]
                        }}
                        transition={{
                            duration: duration * 0.8,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 0.5
                        }}
                    >
                        <FaFire className="text-2xl text-orange-500" />
                    </motion.div>

                    {/* Extra Flames for high intensity */}
                    {intensity === 'high' && (
                        <>
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute -top-10"
                                    style={{
                                        left: `${25 + (i * 20)}%`
                                    }}
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.7, 0.3, 0.7]
                                    }}
                                    transition={{
                                        duration: duration * 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.3
                                    }}
                                >
                                    <FaFire className="text-sm text-orange-500" />
                                </motion.div>
                            ))}
                        </>
                    )}
                </h1>
            </div>

            {subtitle && (
                <motion.p
                    className="text-gray-600 mt-3 text-lg md:text-xl max-w-3xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {subtitle}
                </motion.p>
            )}

            <motion.div
                className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                animate={{
                    scaleX: [0.7, 1, 0.7]
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />
        </div>
    );
};

export default FireHeader;
