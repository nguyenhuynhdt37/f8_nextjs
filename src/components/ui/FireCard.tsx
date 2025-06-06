'use client';

import React from 'react';
import { FaFire } from 'react-icons/fa';
import { motion } from '@/lib/motion';

interface FireCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    intensity?: 'low' | 'medium' | 'high';
}

const FireCard: React.FC<FireCardProps> = ({
    children,
    className = '',
    onClick,
    intensity = 'medium'
}) => {
    // Cấu hình dựa trên cường độ
    const config = {
        low: {
            borderColor: 'border-orange-200',
            bgGradient: 'from-[#f7f7f7] to-[#fff8f5]',
            fireCount: 2,
            animationDuration: 3
        },
        medium: {
            borderColor: 'border-orange-300',
            bgGradient: 'from-[#f7f7f7] to-[#fff4ea]',
            fireCount: 3,
            animationDuration: 2.5
        },
        high: {
            borderColor: 'border-orange-400',
            bgGradient: 'from-[#f9f9f9] to-[#ffece0]',
            fireCount: 4,
            animationDuration: 2
        }
    };

    const { borderColor, bgGradient, fireCount, animationDuration } = config[intensity];

    return (
        <motion.div
            onClick={onClick}
            className={`relative rounded-xl border-2 ${borderColor} overflow-hidden 
                 bg-gradient-to-b ${bgGradient} shadow-md ${className}`}
            whileHover={{
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.2), 0 8px 10px -6px rgba(249, 115, 22, 0.1)'
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
            }}
        >
            {/* Fire effects at corners */}
            <motion.div
                className="absolute -top-2 -right-2 z-10"
                animate={{
                    opacity: [0.7, 1, 0.7],
                    rotate: [-5, 5, -5]
                }}
                transition={{
                    duration: animationDuration,
                    repeat: Infinity
                }}
            >
                <FaFire className="text-2xl text-orange-500" />
            </motion.div>

            {/* Only add bottom-left fire for medium and high intensity */}
            {(intensity === 'medium' || intensity === 'high') && (
                <motion.div
                    className="absolute -bottom-2 -left-2 z-10"
                    animate={{
                        opacity: [0.7, 1, 0.7],
                        rotate: [5, -5, 5]
                    }}
                    transition={{
                        duration: animationDuration,
                        repeat: Infinity,
                        delay: 0.5
                    }}
                >
                    <FaFire className="text-2xl text-orange-500" />
                </motion.div>
            )}

            {/* Only add for high intensity */}
            {intensity === 'high' && (
                <>
                    <motion.div
                        className="absolute top-1/2 -right-2 z-10 transform -translate-y-1/2"
                        animate={{
                            opacity: [0.6, 1, 0.6],
                            x: [0, -5, 0]
                        }}
                        transition={{
                            duration: animationDuration,
                            repeat: Infinity,
                            delay: 0.7
                        }}
                    >
                        <FaFire className="text-xl text-orange-500" />
                    </motion.div>

                    <motion.div
                        className="absolute top-1/2 -left-2 z-10 transform -translate-y-1/2"
                        animate={{
                            opacity: [0.6, 1, 0.6],
                            x: [0, 5, 0]
                        }}
                        transition={{
                            duration: animationDuration,
                            repeat: Infinity,
                            delay: 1
                        }}
                    >
                        <FaFire className="text-xl text-orange-500" />
                    </motion.div>
                </>
            )}

            {/* Hot badge for high intensity */}
            {intensity === 'high' && (
                <div className="absolute top-3 right-3 z-10">
                    <motion.div
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-1 px-3 rounded-full shadow-lg flex items-center"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 1.2,
                            ease: "easeInOut",
                            repeat: Infinity,
                        }}
                    >
                        <FaFire className="mr-1 text-yellow-300" />
                        <span>HOT</span>
                    </motion.div>
                </div>
            )}

            {children}
        </motion.div>
    );
};

export default FireCard;
