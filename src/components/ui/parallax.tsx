'use client';

import React from 'react';
import { motion, useScroll, useTransform } from '@/lib/motion';

/**
 * Parallax component that moves elements at different speeds while scrolling
 */
interface ParallaxProps {
    children: React.ReactNode;
    speed?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}

const Parallax = ({
    children,
    speed = 0.5,
    direction = 'up',
    className = '',
}: ParallaxProps) => {
    const { scrollY } = useScroll();

    const getDirectionMapping = () => {
        switch (direction) {
            case 'up':
                return { y: useTransform(scrollY, [0, 1000], [0, -500 * speed]) };
            case 'down':
                return { y: useTransform(scrollY, [0, 1000], [0, 500 * speed]) };
            case 'left':
                return { x: useTransform(scrollY, [0, 1000], [0, -500 * speed]) };
            case 'right':
                return { x: useTransform(scrollY, [0, 1000], [0, 500 * speed]) };
            default:
                return { y: useTransform(scrollY, [0, 1000], [0, -500 * speed]) };
        }
    };

    const motionProps = getDirectionMapping();

    return (
        <motion.div className={className} {...motionProps}>
            {children}
        </motion.div>
    );
};

export { Parallax };
