'use client';
import React from 'react';
import { motion } from '@/lib/motion';

interface AnimateInViewProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    animation?: 'fade' | 'slideUp' | 'slideRight' | 'zoom' | 'flip';
}

const AnimateInView = ({
    children,
    className = "",
    delay = 0,
    duration = 0.5,
    animation = 'fade'
}: AnimateInViewProps) => {

    const getVariants = () => {
        switch (animation) {
            case 'slideUp':
                return {
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                };
            case 'slideRight':
                return {
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 }
                };
            case 'zoom':
                return {
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                };
            case 'flip':
                return {
                    hidden: { opacity: 0, rotateX: 90 },
                    visible: { opacity: 1, rotateX: 0 }
                };
            case 'fade':
            default:
                return {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                };
        }
    };

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={getVariants()}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1.0]
            }}
        >
            {children}
        </motion.div>
    );
};

export default AnimateInView;
