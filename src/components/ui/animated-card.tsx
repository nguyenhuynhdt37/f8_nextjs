'use client';

import React from 'react';
import { motion } from '@/lib/motion';

/**
 * Animated card component with hover and focus effects
 */
interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverEffect?: 'lift' | 'glow' | 'scale' | 'border' | 'none';
}

const AnimatedCard = ({
    children,
    className = '',
    onClick,
    hoverEffect = 'lift',
}: AnimatedCardProps) => {
    const getHoverAnimation = () => {
        switch (hoverEffect) {
            case 'lift':
                return { y: -8, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' };
            case 'glow':
                return { boxShadow: '0 0 15px rgba(66, 153, 225, 0.5)' };
            case 'scale':
                return { scale: 1.02 };
            case 'border':
                return { borderColor: '#4299E1' };
            case 'none':
                return {};
            default:
                return { y: -8 };
        }
    };

    return (
        <motion.div
            className={`rounded-lg overflow-hidden transition-all duration-300 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={getHoverAnimation()}
            whileFocus={getHoverAnimation()}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export { AnimatedCard };
