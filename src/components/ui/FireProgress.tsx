'use client';

import React from 'react';
import { motion } from '@/lib/motion';
import { FaFire } from 'react-icons/fa';

interface FireProgressProps {
    progress: number;
    className?: string;
    height?: number;
    showPercentage?: boolean;
    showFireIndicator?: boolean;
}

const FireProgress: React.FC<FireProgressProps> = ({
    progress,
    className = '',
    height = 8,
    showPercentage = true,
    showFireIndicator = true
}) => {
    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center">
                <div className="flex-1 relative">
                    <div
                        className="w-full bg-gray-200 rounded-full overflow-hidden"
                        style={{ height: `${height}px` }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 rounded-full"
                        />
                    </div>

                    {/* Hiệu ứng ngọn lửa chạy dọc theo thanh tiến độ */}
                    {showFireIndicator && (
                        <motion.div
                            className="absolute top-1/2 transform -translate-y-1/2"
                            style={{ left: `${progress}%` }}
                            animate={{
                                x: [-15, 0, -15],
                                y: [-10, -15, -10]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            <FaFire className="text-orange-500" />
                        </motion.div>
                    )}

                    {/* Hiệu ứng tia lửa nhỏ */}
                    {progress > 10 && showFireIndicator && (
                        <>
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute top-0 transform -translate-y-full"
                                    style={{
                                        left: `${(progress * (i + 1)) / 4}%`,
                                        opacity: 0.7 - (i * 0.2)
                                    }}
                                    animate={{
                                        y: [-5, -15, -5],
                                        opacity: [0.7 - (i * 0.2), 0.3, 0.7 - (i * 0.2)]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3
                                    }}
                                >
                                    <FaFire className="text-xs text-orange-300" />
                                </motion.div>
                            ))}
                        </>
                    )}
                </div>

                {showPercentage && (
                    <div className="ml-3">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-sm font-medium ${progress > 75 ? 'text-orange-600' : 'text-gray-600'}`}
                        >
                            {progress}%
                        </motion.span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FireProgress;
