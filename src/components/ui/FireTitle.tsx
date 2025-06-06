'use client';

import React from 'react';
import { motion } from '@/lib/motion';
import { FaFire } from 'react-icons/fa';

interface FireTitleProps {
    title: string;
    subtitle?: string;
    className?: string;
}

const FireTitle: React.FC<FireTitleProps> = ({
    title,
    subtitle,
    className = ''
}) => {
    // Split title into words for animation
    const words = title.split(' ');

    return (
        <div className={`relative ${className}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold relative inline-flex flex-wrap">
                {words.map((word, wordIndex) => (
                    <React.Fragment key={wordIndex}>
                        <div className="relative mr-3 mt-2">
                            {/* Each letter with fire animation */}
                            <div className="relative">
                                {word.split('').map((letter, letterIndex) => (
                                    <motion.span
                                        key={letterIndex}
                                        className="inline-block"
                                        animate={{
                                            y: [0, -3, 0],
                                            color: ['#000', '#F97316', '#000']
                                        }}
                                        transition={{
                                            y: {
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: (wordIndex * 0.1) + (letterIndex * 0.05)
                                            },
                                            color: {
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                delay: (wordIndex * 0.1) + (letterIndex * 0.05)
                                            }
                                        }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}

                                {/* Fire particles above letters */}
                                {Math.random() > 0.5 && (
                                    <motion.div
                                        className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                                        initial={{ opacity: 0, y: 0 }}
                                        animate={{
                                            opacity: [0, 0.7, 0],
                                            y: [-5, -15],
                                            x: [0, Math.random() * 10 - 5]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: Math.random() * 2
                                        }}
                                    >
                                        <FaFire className="text-sm text-orange-500" />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                        {wordIndex < words.length - 1 && ' '}
                    </React.Fragment>
                ))}
            </h1>

            {subtitle && (
                <motion.p
                    className="text-gray-600 mt-4 text-lg md:text-xl max-w-3xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {subtitle}
                </motion.p>
            )}

            {/* Base fire */}
            <div className="absolute -bottom-8 left-0 flex">
                {[...Array(Math.min(title.length / 2, 10))].map((_, i) => (
                    <motion.div
                        key={i}
                        className="relative mx-1"
                        animate={{
                            y: [0, -5, 0]
                        }}
                        transition={{
                            duration: 1 + Math.random(),
                            repeat: Infinity,
                            delay: i * 0.1
                        }}
                    >
                        <FaFire className="text-2xl text-orange-500" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FireTitle;
