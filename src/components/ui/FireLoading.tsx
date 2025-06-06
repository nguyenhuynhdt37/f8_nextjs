'use client';

import React from 'react';
import { FaFire } from 'react-icons/fa';
import { motion } from '@/lib/motion';

interface FireLoadingProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
    className?: string;
}

const FireLoading: React.FC<FireLoadingProps> = ({
    size = 'medium',
    text = 'Đang tải...',
    className = ''
}) => {
    const sizeConfig = {
        small: {
            containerSize: 'w-16 h-16',
            fireSize: 'text-3xl',
            textSize: 'text-xs'
        },
        medium: {
            containerSize: 'w-24 h-24',
            fireSize: 'text-4xl',
            textSize: 'text-sm'
        },
        large: {
            containerSize: 'w-32 h-32',
            fireSize: 'text-5xl',
            textSize: 'text-base'
        }
    };

    const { containerSize, fireSize, textSize } = sizeConfig[size];

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className={`relative ${containerSize} flex items-center justify-center`}>
                {/* Lửa xoay vòng */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            transformOrigin: '50% 50%',
                            rotate: `${i * 45}deg`,
                        }}
                        animate={{
                            scale: [1, 0.8, 1],
                            opacity: [0.8, 0.5, 0.8]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                            repeatType: "reverse"
                        }}
                    >
                        <motion.div
                            style={{
                                x: '0px',
                                y: '-40px',
                            }}
                            animate={{
                                y: ['-40px', '-45px', '-40px']
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.1,
                                repeatType: "reverse"
                            }}
                        >
                            <FaFire className={`${fireSize} text-orange-500`} />
                        </motion.div>
                    </motion.div>
                ))}

                {/* Lửa ở giữa */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    <FaFire className={`${fireSize} text-red-500`} />
                </motion.div>
            </div>

            {text && (
                <motion.p
                    className={`mt-4 text-gray-700 font-medium ${textSize}`}
                    animate={{
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
};

export default FireLoading;
