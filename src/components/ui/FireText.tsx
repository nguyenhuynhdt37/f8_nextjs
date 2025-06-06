'use client';

import React from 'react';
import { motion } from '@/lib/motion';
import { FaFire } from 'react-icons/fa';

interface FireTextProps {
    text: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    className?: string;
    withIcon?: boolean;
    iconPosition?: 'left' | 'right' | 'both';
    intensity?: 'low' | 'medium' | 'high';
}

const FireText: React.FC<FireTextProps> = ({
    text,
    as = 'h2',
    className = '',
    withIcon = true,
    iconPosition = 'left',
    intensity = 'medium'
}) => {
    // Config based on intensity
    const config = {
        low: {
            colors: ['#FFA500', '#FF6347'],
            duration: 3
        },
        medium: {
            colors: ['#FF4500', '#FF0000'],
            duration: 2
        },
        high: {
            colors: ['#FF0000', '#FF4500', '#FFA500'],
            duration: 1.5
        }
    };

    const { colors, duration } = config[intensity];

    // Dynamically create text elements
    const Element = as;

    // Split text into individual characters for animation
    const characters = text.split('');

    return (
        <Element className={`relative group inline-flex items-center ${className}`}>
            {withIcon && (iconPosition === 'left' || iconPosition === 'both') && (
                <motion.div
                    className="mr-2"
                    animate={{
                        rotate: [-10, 10, -10],
                        y: [0, -3, 0]
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity
                    }}
                >
                    <FaFire className={`text-orange-500 ${intensity === 'high' ? 'text-xl' : 'text-lg'}`} />
                </motion.div>
            )}

            <span className="relative">
                {characters.map((char, index) => (
                    <motion.span
                        key={index}
                        className="inline-block"
                        animate={{
                            y: [0, -3, 0],
                            color: intensity === 'high' ? colors : undefined
                        }}
                        transition={{
                            y: {
                                duration: Math.random() * 0.5 + duration / 2,
                                repeat: Infinity,
                                delay: index * 0.05
                            },
                            color: {
                                duration: duration,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }
                        }}
                        style={{
                            color: intensity === 'high' ? colors[0] : undefined
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                ))}

                {intensity === 'high' && (
                    <motion.div
                        className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-70"
                        animate={{
                            scaleX: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity
                        }}
                    />
                )}
            </span>

            {withIcon && (iconPosition === 'right' || iconPosition === 'both') && (
                <motion.div
                    className="ml-2"
                    animate={{
                        rotate: [10, -10, 10],
                        y: [0, -3, 0]
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        delay: 0.3
                    }}
                >
                    <FaFire className={`text-orange-500 ${intensity === 'high' ? 'text-xl' : 'text-lg'}`} />
                </motion.div>
            )}
        </Element>
    );
};

export default FireText;
