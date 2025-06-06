'use client';

import React from 'react';
import { motion } from '@/lib/motion';
import { FaFire } from 'react-icons/fa';

interface FireBadgeProps {
    text: string;
    className?: string;
    variant?: 'primary' | 'secondary' | 'hot';
    size?: 'sm' | 'md' | 'lg';
    withIcon?: boolean;
    onClick?: () => void;
}

const FireBadge: React.FC<FireBadgeProps> = ({
    text,
    className = '',
    variant = 'primary',
    size = 'md',
    withIcon = true,
    onClick
}) => {
    // Cấu hình dựa trên variant
    const variantStyles = {
        primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
        secondary: 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800',
        hot: 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
    };

    // Cấu hình dựa trên kích thước
    const sizeStyles = {
        sm: 'text-xs py-1 px-2',
        md: 'text-sm py-1 px-3',
        lg: 'text-base py-2 px-4'
    };

    return (
        <motion.div
            className={`inline-flex items-center rounded-full font-medium shadow-sm
                ${variantStyles[variant]} ${sizeStyles[size]} ${className}
                ${onClick ? 'cursor-pointer hover:shadow-md active:scale-95' : ''}`}
            onClick={onClick}
            whileHover={{ scale: onClick ? 1.05 : 1 }}
            whileTap={{ scale: onClick ? 0.95 : 1 }}
        >
            {withIcon && variant === 'hot' && (
                <motion.div
                    className="mr-1"
                    animate={{
                        rotate: [-10, 10, -10],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity
                    }}
                >
                    <FaFire className="text-yellow-300" />
                </motion.div>
            )}

            {withIcon && variant !== 'hot' && (
                <FaFire className="mr-1 text-yellow-300" />
            )}

            <span>{text}</span>

            {variant === 'hot' && (
                <div className="absolute inset-0 rounded-full overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white opacity-20 w-8 h-20 rotate-45"
                            style={{ top: '0%', left: '-20%' }}
                            animate={{
                                x: ['0%', '200%']
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.3,
                                repeatDelay: 1
                            }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default FireBadge;
