'use client';

import React from 'react';
import { FaFire } from 'react-icons/fa';
import { motion } from '@/lib/motion';

interface FireButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    withIcon?: boolean;
    withFlame?: boolean;
    intensity?: 'low' | 'medium' | 'high';
}

const FireButton: React.FC<FireButtonProps> = ({
    onClick,
    children,
    className = '',
    fullWidth = false,
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    withIcon = true,
    withFlame = true,
    intensity = 'medium'
}) => {
    // Variant styles
    const variants = {
        primary: `bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white`,
        secondary: `bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-800`,
        outline: `border-2 border-orange-500 text-orange-600 hover:bg-orange-50`
    };

    // Size styles
    const sizes = {
        sm: 'text-xs py-1 px-3 rounded',
        md: 'text-sm py-2 px-4 rounded-md',
        lg: 'text-base py-3 px-6 rounded-lg'
    };

    // Animation intensity
    const intensityConfig = {
        low: {
            duration: 3,
            scale: [1, 1.05, 1],
            flames: 2
        },
        medium: {
            duration: 2,
            scale: [1, 1.1, 1],
            flames: 4
        },
        high: {
            duration: 1.5,
            scale: [1, 1.15, 1],
            flames: 6
        }
    };

    const { duration, scale, flames } = intensityConfig[intensity];

    return (
        <motion.button
            type={type}
            onClick={disabled ? undefined : onClick}
            className={`relative overflow-hidden ${fullWidth ? 'w-full' : ''} 
                  font-bold shadow-lg
                  ${variants[variant]} ${sizes[size]} ${className}
                  ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            disabled={disabled}
        >
            <div className="relative z-10 flex items-center justify-center gap-2">
                {children}
                {withIcon && !disabled && (
                    <motion.div
                        animate={{
                            rotate: [-10, 10, -10],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <FaFire className={`${variant === 'primary' ? 'text-yellow-300' : 'text-orange-500'}`} />
                    </motion.div>
                )}
            </div>

            {/* Hiệu ứng tia lửa */}
            {withFlame && !disabled && (
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(flames)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-yellow-300 opacity-70"
                            style={{
                                left: `${15 + i * (70 / flames)}%`,
                                bottom: '-5px',
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.7, 0, 0.7],
                                scale: [1, 0.5, 1]
                            }}
                            transition={{
                                duration: duration,
                                repeat: Infinity,
                                delay: i * 0.2,
                                repeatType: "reverse"
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Glow effect for primary buttons */}
            {variant === 'primary' && !disabled && intensity !== 'low' && (
                <motion.div
                    className="absolute inset-0 rounded-md opacity-30 blur-md -z-10 bg-orange-500"
                    animate={{ scale }}
                    transition={{
                        duration: duration,
                        repeat: Infinity
                    }}
                />
            )}
        </motion.button>
    );
};


export default FireButton;
